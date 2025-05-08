
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, UserCircle, BookOpen, MessageCircle, History, BookmarkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { UserNotes } from "@/components/user-notes";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    bio: "",
    education: "",
    avatar_url: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user) {
      fetchUserProfile();
      fetchSavedScholarships();
      fetchUserPosts();
      fetchChatHistory();
    }
  }, [user, isLoading, navigate]);

  async function fetchUserProfile() {
    if (!user) return;
    
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: user.email || "",
          bio: data.bio || "",
          education: data.education || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setLoadingProfile(false);
    }
  }

  async function fetchSavedScholarships() {
    // This would be implemented once we have a saved_scholarships table
    setSavedScholarships([]);
  }

  async function fetchUserPosts() {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('author_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setUserPosts(data || []);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }

  async function fetchChatHistory() {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setChatHistory(data || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }

  async function handleProfileUpdate() {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          education: profile.education,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your profile has been updated"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !event.target.files || !event.target.files[0]) return;
    
    try {
      setIsUpdating(true);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the image
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const avatarUrl = data.publicUrl;
      
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      
      setProfile(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));
      
      toast({
        title: "Success",
        description: "Your avatar has been updated"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  if (isLoading || loadingProfile) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-myanmar-jade mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tighter mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Saved Scholarships</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>My Posts</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              <span>My Notes</span>
            </TabsTrigger>
            <TabsTrigger value="chat-history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Chat History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information and profile settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-lg">{profile.full_name ? getInitials(profile.full_name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar" className="cursor-pointer text-sm text-myanmar-jade hover:underline">
                        Change Avatar
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={profile.email}
                          disabled={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Background</Label>
                      <Input
                        id="education"
                        value={profile.education}
                        onChange={e => setProfile(prev => ({ ...prev, education: e.target.value }))}
                        disabled={isUpdating}
                        placeholder="Your education background, e.g., BSc in Computer Science, Yangon University"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us a bit about yourself"
                        disabled={isUpdating}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="scholarships" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Scholarships</CardTitle>
                <CardDescription>Scholarships you've saved for later reference.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* This would show saved scholarships once we implement that feature */}
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't saved any scholarships yet.</p>
                  <Button variant="link" onClick={() => navigate('/scholarships')}>
                    Browse Scholarships
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Posts</CardTitle>
                <CardDescription>Posts you've created in the community.</CardDescription>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't created any posts yet.</p>
                    <Button variant="link" onClick={() => navigate('/community')}>
                      Go to Community
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {/* Display user posts here */}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6 space-y-4">
            <UserNotes className="w-full" />
          </TabsContent>
          
          <TabsContent value="chat-history" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Chat History</CardTitle>
                <CardDescription>Your conversations with the AI assistant.</CardDescription>
              </CardHeader>
              <CardContent>
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't chatted with the AI assistant yet.</p>
                    <Button variant="link" onClick={() => navigate('/')}>
                      Start a Conversation
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {chatHistory.map((chat: any) => (
                      <li key={chat.id} className="border rounded p-3">
                        <p className="font-medium">You:</p>
                        <p className="text-sm text-muted-foreground mb-2">{chat.message}</p>
                        <p className="font-medium">AI:</p>
                        <p className="text-sm text-muted-foreground">{chat.response}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(chat.created_at).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
