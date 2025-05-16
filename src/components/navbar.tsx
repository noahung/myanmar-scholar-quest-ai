import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  BookOpen,
  MessageCircle,
  Search,
  User,
  Menu,
  X,
  UserCircle,
  LogOut,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/language-selector";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, session, signOut, isLoading, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState({
    full_name: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setProfileData({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { name: 'Scholarships', href: "/scholarships", icon: BookOpen },
    { name: 'Community', href: "/community", icon: MessageCircle },
    { name: 'Guides', href: "/guides", icon: Search },
  ];

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-myanmar-maroon text-white p-1 rounded-md">
              <span className="font-bold text-xl">S-M</span>
            </div>
            <span className="font-bold text-xl hidden md:block">Scholar-M</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.href}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.name)}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          
          {isLoading ? (
            <Button variant="outline" size="sm" disabled>
              <User className="h-4 w-4 mr-2" />
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback>{getInitials(profileData.full_name || user.email)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{profileData.full_name || user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <UserCircle className="h-4 w-4 mr-2" />
                    {t('Profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved-scholarships" className="cursor-pointer flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t('Saved Scholarships')}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('Admin Dashboard')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('Sign Out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                {t('Login')}
              </Link>
            </Button>
          )}
          
          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Close menu overlay"
        />
      )}
      <div className={cn(
        "md:hidden fixed inset-y-0 right-0 top-16 z-50 bg-background pt-4 px-4 w-4/5 max-w-xs shadow-lg rounded-l-2xl transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-4rem)]",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )} style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.href}
              className="flex items-center gap-2 p-2 text-lg border-b border-border rounded-md hover:bg-accent transition-colors"
              onClick={toggleMobileMenu}
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.name)}</span>
            </Link>
          ))}
          {user && (
            <>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 p-2 text-lg border-b border-border rounded-md hover:bg-accent transition-colors"
                onClick={toggleMobileMenu}
              >
                <UserCircle className="h-5 w-5" />
                <span>{t('Profile')}</span>
              </Link>
              <Link 
                to="/saved-scholarships" 
                className="flex items-center gap-2 p-2 text-lg border-b border-border rounded-md hover:bg-accent transition-colors"
                onClick={toggleMobileMenu}
              >
                <BookOpen className="h-5 w-5" />
                <span>{t('Saved Scholarships')}</span>
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 p-2 text-lg border-b border-border rounded-md hover:bg-accent transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span>{t('Admin Dashboard')}</span>
                </Link>
              )}
              <Button 
                variant="ghost" 
                className="flex items-center justify-start gap-2 p-2 text-lg w-full border-b border-border rounded-md hover:bg-accent transition-colors"
                onClick={() => {
                  handleSignOut();
                  toggleMobileMenu();
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>{t('Sign Out')}</span>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
