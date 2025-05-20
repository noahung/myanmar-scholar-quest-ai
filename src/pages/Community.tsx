import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Share, Plus, Filter, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  likes: number;
  comments: number;
  share_count?: number;
  tags: string[];
  image_url?: string;
  isLiked?: boolean;
};

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [user]);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      
      // Query posts and join with profiles for author information
      const { data: postsData, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          title,
          content,
          author_id,
          date,
          likes,
          comments,
          tags,
          image_url,
          share_count
        `)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // For each post, fetch the author's profile
      const formattedPosts: Post[] = [];
      
      for (const post of postsData || []) {
        // Get author profile
        const { data: authorData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', post.author_id)
          .single();
          
        // Check if the current user has liked this post
        let isLiked = false;
        
        if (user) {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .single();
            
          isLiked = !!likeData;
        }

        // Get actual comment count
        const { count: commentCount, error: commentError } = await supabase
          .from('post_comments')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', post.id);

        if (commentError) {
          console.error("Error fetching comment count:", commentError);
        }
        
        formattedPosts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            id: post.author_id,
            name: authorData?.full_name || 'Anonymous',
            avatar: authorData?.avatar_url || undefined
          },
          date: post.date,
          likes: post.likes || 0,
          comments: commentCount || 0,
          tags: post.tags || [],
          image_url: post.image_url,
          isLiked,
          share_count: post.share_count
        });
      }

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Fallback to mock data if Supabase fetch fails
      setPosts([
        {
          id: "1",
          title: "My Experience with the JICA Scholarship Application",
          content: "Hello everyone! I wanted to share my experience applying for the JICA scholarship last year. The process was quite intensive but well worth it. I'm now studying Environmental Engineering in Tokyo...",
          author: {
            id: "author1",
            name: "Thet Paing",
            avatar: "/placeholder.svg"
          },
          date: "2025-04-10",
          likes: 24,
          comments: 8,
          tags: ["JICA", "Japan", "Experience"],
          isLiked: false
        },
        {
          id: "2",
          title: "Tips for IELTS Preparation from a 7.5 Scorer",
          content: "After three months of intensive preparation, I scored 7.5 on my IELTS test. Here are some strategies that worked for me: 1. Consistent daily practice with real test materials...",
          author: {
            id: "author2",
            name: "Su Myat",
            avatar: "/placeholder.svg"
          },
          date: "2025-04-05",
          likes: 32,
          comments: 15,
          tags: ["IELTS", "Language Test", "Study Tips"],
          isLiked: false
        },
        {
          id: "3",
          title: "Need Advice on Statement of Purpose for Fulbright",
          content: "I'm planning to apply for the Fulbright scholarship this year, but I'm struggling with my statement of purpose. My field is Public Health, and I want to focus on improving healthcare systems in rural Myanmar...",
          author: {
            id: "author3",
            name: "Min Thu",
            avatar: "/placeholder.svg"
          },
          date: "2025-04-02",
          likes: 10,
          comments: 22,
          tags: ["Fulbright", "USA", "SoP", "Help Needed"],
          isLiked: false
        },
        {
          id: "4",
          title: "Success Story: From Yangon to Cambridge",
          content: "Three years ago, I was just a graduate trying to figure out my next steps. Today, I'm completing my Master's at Cambridge University. Here's my full journey and how Scholar-M resources helped me...",
          author: {
            id: "author4",
            name: "Kyaw Zin",
            avatar: "/placeholder.svg"
          },
          date: "2025-03-28",
          likes: 56,
          comments: 13,
          tags: ["Success Story", "UK", "Cambridge"],
          isLiked: false
        },
        {
          id: "5",
          title: "Guide to Moving to Germany for Studies",
          content: "I moved to Berlin last semester and wanted to share a practical guide for Myanmar students planning to study in Germany. From visa application to finding accommodation, public transportation, and cultural adjustments...",
          author: {
            id: "author5",
            name: "Phyu Phyu",
            avatar: "/placeholder.svg"
          },
          date: "2025-03-25",
          likes: 41,
          comments: 17,
          tags: ["Germany", "Practical Tips", "Relocation"],
          isLiked: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewPost = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a new post",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Direct users to create post page
    navigate("/create-post");
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Optimistically update UI
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !isLiked
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);

      if (isLiked) {
        // Unlike post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        if (error) throw error;
          
        // Update post like count
        await supabase
          .from('community_posts')
          .update({ likes: updatedPosts.find(p => p.id === postId)?.likes || 0 })
          .eq('id', postId);
      } else {
        // Like post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
          
        if (error) throw error;
        
        // Update post like count
        await supabase
          .from('community_posts')
          .update({ likes: updatedPosts.find(p => p.id === postId)?.likes || 0 })
          .eq('id', postId);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
      // Revert optimistic update
      fetchPosts();
    }
  };

  const handleSharePost = async (post: Post) => {
    try {
      const shareUrl = `${window.location.origin}/myanmar-scholar-quest-ai/community/${post.id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `Check out this post on Scholar-M: ${post.title}`,
          url: shareUrl
        });
        
        toast({
          title: "Post shared successfully",
          description: "The post has been shared"
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste the link anywhere"
        });
      }
      
      // Increment share count in database
      const { error } = await supabase
        .from('community_posts')
        .update({ 
          share_count: (post.share_count || 0) + 1 
        })
        .eq('id', post.id);
        
      if (error) throw error;
        
    } catch (error) {
      console.error("Error sharing post:", error);
      // If it's not a user abort, show an error
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        toast({
          title: "Error",
          description: "Failed to share post",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="pattern-border pb-2">
          <h1 className="text-3xl font-bold tracking-tighter mb-2 text-myanmar-maroon">Community</h1>
        </div>
        <p className="max-w-[600px] text-muted-foreground">
          Connect with fellow Myanmar students, share experiences, and learn from others in the scholarship journey.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-myanmar-maroon" />
          <span className="text-sm text-myanmar-maroon font-semibold">{posts.length} posts in the community</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full border-myanmar-jade text-myanmar-jade font-bold">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="rounded-full bg-myanmar-gold text-myanmar-maroon font-bold px-6" onClick={handleNewPost}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-myanmar-jade" />
        </div>
      )}

      {/* Rest of the component */}
      {!isLoading && (
        <Tabs defaultValue="popular" className="mb-8">
          <TabsList className="w-full bg-myanmar-jade/10 rounded-xl p-1 flex gap-2">
            <TabsTrigger value="popular" className="rounded-full px-6 py-2 font-semibold">Popular</TabsTrigger>
            <TabsTrigger value="recent" className="rounded-full px-6 py-2 font-semibold">Recent</TabsTrigger>
            <TabsTrigger value="unanswered" className="rounded-full px-6 py-2 font-semibold">Unanswered</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-4">
            <div className="space-y-6">
              {posts.sort((a, b) => b.likes - a.likes).map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost} 
                  onShare={handleSharePost}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            <div className="space-y-6">
              {posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost} 
                  onShare={handleSharePost}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="unanswered" className="mt-4">
            <div className="space-y-6">
              {posts.filter(post => post.comments === 0).length > 0 ? (
                posts.filter(post => post.comments === 0).map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={handleLikePost} 
                    onShare={handleSharePost}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No unanswered posts found</h3>
                  <p className="text-muted-foreground mt-2">All posts have comments!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onShare: (post: Post) => void;
}

function PostCard({ post, onLike, onShare }: PostCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10 hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-myanmar-maroon">{post.author.name}</p>
              <p className="text-xs text-myanmar-maroon/70">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/community/${post.id}`}>
          <CardTitle className="text-lg mt-2 hover:text-myanmar-jade transition-colors text-myanmar-maroon">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm mb-4 text-myanmar-maroon/80">{post.content}</p>
        {post.image_url && (
          <div className="mt-4 mb-4">
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-xl max-h-48 object-cover w-full border border-myanmar-gold/30"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs border-myanmar-gold text-myanmar-gold">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 rounded-full ${post.isLiked ? 'text-red-500' : 'text-myanmar-maroon'}`}
              onClick={() => onLike(post.id, !!post.isLiked)}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 rounded-full text-myanmar-maroon"
              onClick={() => navigate(`/community/${post.id}`)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 rounded-full text-myanmar-maroon"
            onClick={() => onShare(post)}
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
