
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  X, 
  Send,
  Loader
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

interface AiAssistantProps {
  scholarshipId?: string;
}

export function AiAssistant({ scholarshipId }: AiAssistantProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "မင်္ဂလာပါ! အခန်းဘာသာစကားဖြင့် ပညာသင်ခွင့်ရှာဖွေနေပါက ကျွန်ုပ်က ကူညီပေးနိုင်ပါသည်။ (Hi there! I'm your Scholar-M assistant. How can I help you with finding scholarships today?)",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Load chat history if user is logged in
    if (user && isOpen) {
      loadChatHistory();
    }
  }, [user, isOpen]);

  async function loadChatHistory() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20);

      if (error) {
        console.error("Error loading chat history:", error);
        return;
      }

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
    } catch (error) {
      console.error("Error in loadChatHistory:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message: inputMessage,
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-card border rounded-lg shadow-lg w-80 sm:w-96 flex flex-col h-96 transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-t-lg">
            <h3 className="font-medium">
              {scholarshipId ? "Scholarship Assistant" : "Scholar-M AI Assistant"}
            </h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.sender === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted mr-auto"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted rounded-lg p-3 max-w-[80%] mr-auto">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          size="lg" 
          className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}
    </div>
  );
}
