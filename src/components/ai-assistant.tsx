import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  X, 
  Send,
  Loader,
  BookmarkPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { SaveToNotesButton } from "@/components/user-notes";
import { API_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

interface AiAssistantProps {
  scholarshipId?: string;
  initialMessage?: string;
  isScholarshipAssistant?: boolean;
}

export function AiAssistant({ scholarshipId, initialMessage, isScholarshipAssistant = false }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    // Set initial welcome message based on context
    if (isScholarshipAssistant && scholarshipId) {
      setMessages([
        {
          id: '1',
          content: "Hello! Ask me any questions about this scholarship, and I'll help you understand the requirements, benefits, and application process.",
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([
        {
          id: '1',
          content: "မင်္ဂလာပါ! အခန်းဘာသာစကားဖြင့် ပညာသင်ခွင့်ရှာဖွေနေပါက ကျွန်ုပ်က ကူညီပေးနိုင်ပါသည်။ (Hi there! I'm your Scholar-M assistant. How can I help you with finding scholarships today?)",
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, [isScholarshipAssistant, scholarshipId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Load chat history if user is logged in
    if (user && (isOpen || isScholarshipAssistant)) {
      loadChatHistory();
    }
  }, [user, isOpen, scholarshipId, isScholarshipAssistant]);

  useEffect(() => {
    // If initialMessage is provided, send it automatically
    if (initialMessage && (isOpen || isScholarshipAssistant) && messages.length === 1) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen, isScholarshipAssistant, messages]);

  async function loadChatHistory() {
    if (!user) return;

    try {
      // Use REST API for fetching chat history
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        let endpoint = `${API_URL}/ai_chat_history?user_id=eq.${user.id}&order=created_at.asc&limit=20`;
        
        if (scholarshipId) {
          endpoint += `&scholarship_id=eq.${scholarshipId}`;
        } else {
          endpoint += `&scholarship_id=is.null`;
        }
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load chat history');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const historyMessages: Message[] = data.flatMap(item => [
            {
              id: `user-${item.id}`,
              content: item.message,
              sender: 'user' as const,
              timestamp: new Date(item.created_at)
            },
            {
              id: `assistant-${item.id}`,
              content: item.response,
              sender: 'assistant' as const,
              timestamp: new Date(item.created_at)
            }
          ]);

          // Replace the initial welcome message with the history
          setMessages(historyMessages);
        }
      }
    } catch (error) {
      console.error("Error in loadChatHistory:", error);
    }
  }

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message: message,
          userId: user?.id,
          scholarshipId: scholarshipId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process your request.",
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: error.message || "Failed to get a response from the AI assistant."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Archive chat history to Supabase when user clicks the button
  const handleArchiveHistory = async () => {
    if (!user || messages.length < 2) return;
    const pairs = [];
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].sender === 'user' && messages[i + 1].sender === 'assistant') {
        pairs.push({
          user_id: user.id,
          message: messages[i].content,
          response: messages[i + 1].content,
          created_at: messages[i].timestamp.toISOString(),
        });
      }
    }
    if (pairs.length > 0) {
      const { error } = await supabase.from('ai_chat_history').insert(pairs);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to archive chat history.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Chat archived',
          description: 'This chat session has been saved to your history.',
        });
        // Optionally clear chat after archiving
        // setMessages([]);
      }
    }
  };

  return (
    <div className={cn(
      isExpanded
        ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/30"
        : "fixed bottom-4 right-4 z-50 w-auto",
      isScholarshipAssistant && !isExpanded ? "relative bottom-0 right-0 w-full h-full" : ""
    )}>
      {isOpen || isScholarshipAssistant ? (
        <div className={cn(
          "bg-white border-0 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 animate-fade-in",
          isExpanded
            ? "w-[90vw] max-w-2xl h-[90vh] max-h-[90vh]"
            : isScholarshipAssistant
              ? "w-full h-[500px]"
              : "w-80 sm:w-96 h-96",
          // Responsive: on mobile, make chat window nearly full width
          !isExpanded && !isScholarshipAssistant ? "max-w-xs w-[95vw] sm:w-96" : ""
        )}>
          <div className="flex items-center justify-between bg-myanmar-maroon text-white p-3 rounded-t-2xl">
            <h3 className="font-medium">
              {scholarshipId ? "Scholarship Assistant" : "Scholar-M AI Assistant"}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpand}
                className="h-8 w-8 text-white hover:bg-myanmar-gold/20 hidden sm:inline-flex"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7M4 4v7M20 20h-7M20 20v-7" /></svg>
                )}
              </Button>
              {!isScholarshipAssistant && (
                <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white hover:bg-myanmar-gold/20">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-end p-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleArchiveHistory}
              disabled={!user || messages.length < 2}
              className="text-xs rounded-full border-myanmar-maroon text-myanmar-maroon font-bold hover:bg-myanmar-gold/10"
            >
              Archive to History
            </Button>
          </div>
          
          <div className={cn(
            "flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-b-2xl",
            isScholarshipAssistant ? "" : ""
          )}>
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-2xl p-3 shadow-sm",
                  message.sender === 'user' 
                    ? "bg-myanmar-gold/80 text-myanmar-maroon ml-auto" 
                    : "bg-myanmar-jade/10 text-myanmar-maroon mr-auto"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {message.sender === 'assistant' && (
                    <SaveToNotesButton 
                      content={message.content}
                      scholarshipId={scholarshipId}
                    />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-myanmar-jade/10 rounded-2xl p-3 max-w-[80%] mr-auto">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-myanmar-jade/20 p-3 flex gap-2 bg-white rounded-b-2xl">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-myanmar-jade/30 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-myanmar-gold"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading} className="rounded-full bg-myanmar-gold text-myanmar-maroon hover:bg-myanmar-gold/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          size="lg" 
          className="rounded-full h-12 w-12 bg-myanmar-maroon hover:bg-myanmar-gold/90 text-white shadow-lg fixed bottom-4 right-4 z-50 sm:static"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}
    </div>
  );
}
