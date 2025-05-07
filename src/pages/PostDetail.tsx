
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageCircle, Share, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
}

// Mock data for development
const posts: Post[] = [
  {
    id: "1",
    title: "My Experience with the JICA Scholarship Application",
    content: "Hello everyone! I wanted to share my experience applying for the JICA scholarship last year. The process was quite intensive but well worth it. I'm now studying Environmental Engineering in Tokyo.\n\nThe application process took about 3 months from start to finish. Here's a breakdown of what I did:\n\n1. **Document Preparation (1 month)**: Gathered all required documents including transcripts, recommendation letters, and certificates. The most time-consuming part was getting the official translations done.\n\n2. **Research Proposal (2 weeks)**: Spent considerable time refining my research proposal with help from my undergraduate supervisor. Make sure your proposal aligns with Japan's development priorities for Myanmar.\n\n3. **Application Submission**: Submitted everything to the JICA office in Yangon. Be sure to double-check all requirements as they're very strict about completeness.\n\n4. **Written Exam**: The exam tested English proficiency and basic knowledge in my field. Study materials from previous years helped a lot.\n\n5. **Interview (most critical)**: Faced a panel of 5 interviewers including Japanese officials. They asked detailed questions about my proposal and why I chose Japan specifically.\n\n6. **Waiting Period**: The most stressful part! Took about 2 months to hear back.\n\nSome tips that might help future applicants:\n- Start preparing documents early, especially those requiring official approval\n- Research your target universities and professors thoroughly\n- Practice interview questions in both technical and cultural contexts\n- Demonstrate knowledge about Japan and how your research can benefit Myanmar\n\nFeel free to ask questions in the comments. I'm happy to help anyone interested in this scholarship!",
    author: {
      name: "Thet Paing",
      avatar: "/placeholder.svg"
    },
    date: "2025-04-10",
    likes: 24,
    comments: 8,
    tags: ["JICA", "Japan", "Experience"],
    commentsList: [
      {
        id: "1",
        author: {
          name: "Su Myat",
          avatar: "/placeholder.svg"
        },
        content: "Thank you for sharing your experience! How did you prepare for the interview? Any specific questions they asked that caught you off guard?",
        date: "2025-04-11",
        likes: 3
      },
      {
        id: "2",
        author: {
          name: "Kyaw Zin",
          avatar: "/placeholder.svg"
        },
        content: "What was the most challenging part of the research proposal? I'm planning to apply next year and would appreciate any insights.",
        date: "2025-04-12",
        likes: 2
      }
    ]
  }
];

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // This will be replaced with a Supabase query
    // For now, we're using mock data
    setLoading(true);
    
    // Find the post with the matching ID
    const foundPost = posts.find(p => p.id === id);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    setLoading(false);
  }, [id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // This will be replaced with a Supabase insert
    // For now, we're just showing a message
    console.log("Comment submitted:", newComment);
    
    // Simulate adding the comment (would be handled by Supabase in production)
    if (post) {
      const newCommentObj = {
        id: `temp-${Date.now()}`,
        author: {
          name: "Current User",
          avatar: "/placeholder.svg"
        },
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };
      
      setPost({
        ...post,
        commentsList: [...(post.commentsList || []), newCommentObj],
        comments: post.comments + 1
      });
      
      setNewComment("");
    }
  };

  const toggleLike = () => {
    // This will be replaced with a Supabase toggle
    // For now, we're just toggling the local state
    setLiked(!liked);
    
    if (post) {
      setPost({
        ...post,
        likes: liked ? post.likes - 1 : post.likes + 1
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
          </Button>
        </div>

        {/* Post card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <img src={post.author.avatar} alt={post.author.name} />
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}
                  onClick={toggleLike}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Comments section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments ({post.comments})</h2>
          
          {/* New comment form */}
          <div className="mb-6 flex gap-4">
            <Avatar>
              <img src="/placeholder.svg" alt="Your avatar" />
            </Avatar>
            <div className="flex-1">
              <Textarea 
                placeholder="Write a comment..." 
                className="mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleCommentSubmit} className="ml-auto flex gap-2">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* Comments list */}
          <div className="space-y-6">
            {post.commentsList?.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <img src={comment.author.avatar} alt={comment.author.name} />
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Heart className="h-3.5 w-3.5 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {post.commentsList && post.commentsList.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
