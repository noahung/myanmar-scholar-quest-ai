
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Shield, UserCheck, Trash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Type for profile data
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

export function UserAdminTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [makingAdmin, setMakingAdmin] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Fetch all users from the profiles table
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load users",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [toast]);

  // Function to make a user an admin
  const makeUserAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setMakingAdmin(true);
      
      // First, get the user's profile to check if it exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .maybeSingle();
        
      if (profileError) {
        throw new Error(`Error finding user: ${profileError.message}`);
      }
      
      if (!profileData) {
        throw new Error(`No user found with email ${email}`);
      }
      
      // Update the profile to make the user an admin
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', profileData.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User ${email} has been made an admin`
      });
      
      // Refresh the user list
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      setUsers(data || []);
      setEmail("");
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to make user an admin",
        variant: "destructive"
      });
    } finally {
      setMakingAdmin(false);
    }
  };

  // Function to remove admin status
  const removeAdmin = async (userId: string) => {
    try {
      // Don't allow removing admin status from yourself
      if (userId === currentUser?.id) {
        toast({
          title: "Error",
          description: "You cannot remove your own admin status",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Admin status removed"
      });
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: false } : user
      ));
    } catch (error: any) {
      console.error("Error removing admin status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin status",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          User Administration
        </CardTitle>
        <CardDescription>
          Manage user accounts and admin privileges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <Input 
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="max-w-xs"
          />
          <Button onClick={makeUserAdmin} disabled={makingAdmin}>
            <Shield className="h-4 w-4 mr-2" />
            {makingAdmin ? "Processing..." : "Make Admin"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading users...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt="Avatar" 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <User className="h-8 w-8 p-1 rounded-full bg-muted" />
                        )}
                        <span>{user.full_name || 'Anonymous'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          User
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_admin && user.id !== currentUser?.id && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeAdmin(user.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
