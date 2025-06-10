import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Share, Plus, Filter, BookOpen, Loader2, ArrowUp, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { AdminBadge } from "@/components/AdminBadge";

type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    is_admin?: boolean;
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 10;
  const loaderRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  // Infinite scroll: observe loader div
  React.useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, hasMore, isFetchingMore, isLoading]);

  // Show back to top button on scroll
  React.useEffect(() => {
    const onScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch posts with pagination
  async function fetchPosts(pageNum = 1, replace = false) {
    try {
      if (replace) setIsLoading(true);
      const from = (pageNum - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      const { data: postsData, error } = await supabase
        .from('community_posts')
        .select(`id, title, content, author_id, date, likes, comments, tags, image_url, share_count`)
        .order('date', { ascending: false })
        .range(from, to);
      if (error) throw error;

      // For each post, fetch the author's profile
      const formattedPosts: Post[] = [];
      
      for (const post of postsData || []) {
        // Get author profile
        const { data: authorData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, is_admin')
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
            avatar: authorData?.avatar_url || undefined,
            is_admin: authorData?.is_admin || false,
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

      setPosts((prev) => replace ? formattedPosts : [...prev, ...formattedPosts]);
      setHasMore((postsData?.length || 0) === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({ title: "Error", description: "Failed to load posts", variant: "destructive" });
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
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

  // Initial and paginated fetch
  React.useEffect(() => {
    fetchPosts(page, page === 1);
    // eslint-disable-next-line
  }, [page, user]);

  // Refresh handler
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    fetchPosts(1, true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#fdf6ee] to-[#f8fafc] pb-12">
      <div className="w-full flex flex-col items-center justify-center pt-10 pb-6 px-2 bg-gradient-to-b from-[#fff8f0] via-[#f8fafc] to-transparent">
        <div className="relative flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-myanmar-maroon mb-2 drop-shadow-sm">Community</h1>
          <span className="block w-24 h-2 rounded-full bg-gradient-to-r from-myanmar-maroon via-myanmar-gold to-myanmar-jade mb-2" />
        </div>
        <p className="max-w-xl text-lg text-myanmar-maroon/80 text-center mb-6 mt-2">
          Connect with fellow Myanmar students, share experiences, and learn from others in the scholarship journey.
        </p>
      </div>

      <div className="max-w-2xl mx-auto -mt-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/90 rounded-2xl shadow-2xl p-6 border border-myanmar-gold/10">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-myanmar-maroon" />
            <span className="text-base md:text-lg text-myanmar-maroon font-semibold">{posts.length} posts in the community</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-myanmar-jade text-myanmar-jade font-bold px-5 py-2 text-base">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="rounded-full bg-myanmar-gold text-myanmar-maroon font-bold px-6 py-2 text-base shadow hover:bg-myanmar-gold/90 transition-all" onClick={handleNewPost}>
              <Plus className="h-5 w-5 mr-2" />
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
            <div ref={loaderRef} className="h-8 flex items-center justify-center">
              {isFetchingMore && <Loader2 className="h-6 w-6 animate-spin text-myanmar-jade" />}
              {!hasMore && <span className="text-xs text-muted-foreground">No more posts</span>}
            </div>
          </Tabs>
        )}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          {showTopBtn && (
            <button
              className="rounded-full bg-myanmar-maroon text-white shadow-lg p-3 hover:bg-myanmar-gold hover:text-myanmar-maroon transition-all"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to Top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
          <button
            className="rounded-full bg-white border border-myanmar-gold text-myanmar-maroon shadow-lg p-3 hover:bg-myanmar-gold/20 transition-all"
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            <RefreshCw className="h-5 w-5 animate-spin" />
          </button>
        </div>
      </div>
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
            <div className="flex items-center gap-1">
              <p className="font-medium text-myanmar-maroon">{post.author.name}</p>
              {post.author.is_admin && <AdminBadge />}
            </div>
            <p className="text-xs text-myanmar-maroon/70">
              {new Date(post.date).toLocaleDateString()}
            </p>
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
              className="rounded-xl w-full h-auto object-contain border border-myanmar-gold/30"
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
            <span>{post.share_count || 0}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
