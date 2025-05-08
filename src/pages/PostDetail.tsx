
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageCircle, Share, Send, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  author_id: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  commentsList?: Comment[];
  isLiked?: boolean;
  image_url?: string;
  share_count?: number;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  author_id: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, user]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      
      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      // Get author details
      const { data: authorData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', postData.author_id)
        .single();
      
      // Check if user has liked this post
      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', user.id)
          .single();
          
        isLiked = !!likeData;
      }
      
      // Get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      
      if (commentsError) throw commentsError;
      
      // Get comment authors
      const commentsList: Comment[] = [];
      
      for (const comment of commentsData || []) {
        // Get comment author details
        const { data: commentAuthorData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', comment.user_id)
          .single();
          
        // Check if user has liked this comment
        let isCommentLiked = false;
        if (user) {
          const { data: commentLikeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', comment.id)
            .eq('user_id', user.id)
            .single();
            
          isCommentLiked = !!commentLikeData;
        }
        
        commentsList.push({
          id: comment.id,
          author: {
            id: comment.user_id,
            name: commentAuthorData?.full_name || 'Anonymous',
            avatar: commentAuthorData?.avatar_url || '/placeholder.svg'
          },
          author_id: comment.user_id,
          content: comment.content,
          date: comment.created_at,
          likes: comment.likes || 0,
          isLiked: isCommentLiked
        });
      }
      
      const post: Post = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        author: {
          id: postData.author_id,
          name: authorData?.full_name || 'Anonymous',
          avatar: authorData?.avatar_url || '/placeholder.svg'
        },
        author_id: postData.author_id,
        date: postData.date,
        likes: postData.likes || 0,
        comments: postData.comments || 0,
        tags: postData.tags || [],
        commentsList,
        isLiked,
        image_url: postData.image_url,
        share_count: postData.share_count || 0
      };
      
      setPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      // Fallback to mock data if needed
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Add comment to the database
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment
        })
        .select();
        
      if (error) throw error;
      
      // Update comment count on the post
      const commentCount = (post?.comments || 0) + 1;
      await supabase
        .from('community_posts')
        .update({ comments: commentCount })
        .eq('id', id);
      
      // Refresh post data
      await fetchPost();
      
      // Clear comment input
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted"
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async () => {
    if (!user || !post) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Optimistically update UI
      const newLikeCount = post.isLiked ? post.likes - 1 : post.likes + 1;
      setPost({
        ...post,
        likes: newLikeCount,
        isLiked: !post.isLiked
      });
      
      if (post.isLiked) {
        // Unlike post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        // Like post
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
      }
      
      // Update like count on the post
      await supabase
        .from('community_posts')
        .update({ likes: newLikeCount })
        .eq('id', post.id);
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
      // Revert optimistic update
      fetchPost();
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!user || !post) {
      toast({
        title: "Login Required",
        description: "Please log in to like comments",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Find the comment
      const comment = post.commentsList?.find(c => c.id === commentId);
      if (!comment) return;
      
      // Optimistically update UI
      const newLikeCount = isLiked ? comment.likes - 1 : comment.likes + 1;
      
      setPost({
        ...post,
        commentsList: post.commentsList?.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              likes: newLikeCount,
              isLiked: !isLiked
            };
          }
          return c;
        })
      });
      
      if (isLiked) {
        // Unlike comment
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', commentId)
          .eq('user_id', user.id);
      } else {
        // Like comment
        await supabase
          .from('post_likes')
          .insert({
            post_id: commentId,
            user_id: user.id
          });
      }
      
      // Update like count on the comment
      await supabase
        .from('post_comments')
        .update({ likes: newLikeCount })
        .eq('id', commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
      // Revert optimistic update
      fetchPost();
    }
  };

  const handleSharePost = async () => {
    if (!post) return;
    
    try {
      const shareUrl = `${window.location.origin}/community/${post.id}`;
      
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
      
      // Update share count in database
      const newShareCount = (post.share_count || 0) + 1;
      setPost({
        ...post,
        share_count: newShareCount
      });
      
      await supabase
        .from('community_posts')
        .update({ share_count: newShareCount })
        .eq('id', post.id);
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

  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-myanmar-jade mb-4" />
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
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
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
            
            {post.image_url && (
              <div className="mt-6">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="rounded-md max-h-96 object-contain mx-auto"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                  onClick={handleLikePost}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById('comment-input')?.focus()}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSharePost}
              >
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
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt="Your avatar" />
              <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea 
                id="comment-input"
                placeholder="Write a comment..." 
                className="mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={handleCommentSubmit} 
                className="ml-auto flex gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
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
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 px-2 ${comment.isLiked ? 'text-red-500' : ''}`}
                      onClick={() => handleLikeComment(comment.id, !!comment.isLiked)}
                    >
                      <Heart className={`h-3.5 w-3.5 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {(!post.commentsList || post.commentsList.length === 0) && (
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
