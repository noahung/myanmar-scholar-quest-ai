import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/images//myanmar%20scholar%20logo.png" alt="Scholar-M Logo" className="h-12 w-12 object-contain bg-white rounded-xl border-2 border-myanmar-maroon shadow" />
            <span className="font-extrabold text-2xl text-myanmar-maroon hidden md:block tracking-tight">Scholar-M</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 ml-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.href}
              className="flex items-center gap-1 text-lg font-bold text-myanmar-maroon/80 hover:text-myanmar-maroon transition-colors px-3 py-1 rounded-full hover:bg-myanmar-gold/20 focus:bg-myanmar-gold/30 focus:outline-none"
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.name)}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Button variant="outline" size="sm" disabled className="rounded-full px-5 py-2 font-bold">
              <User className="h-4 w-4 mr-2" />
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-5 py-2 font-bold">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback>{getInitials(profileData.full_name || user.email)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-myanmar-maroon font-bold">{profileData.full_name || user.email?.split('@')[0]}</span>
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="rounded-full px-6 py-2 font-bold border-myanmar-maroon text-myanmar-maroon bg-white hover:bg-myanmar-gold/10 hover:text-myanmar-maroon">
                <Link to="/login">
                  Log In
                </Link>
              </Button>
              <Button size="sm" asChild className="rounded-full px-6 py-2 font-bold bg-myanmar-maroon text-white hover:bg-myanmar-gold hover:text-myanmar-maroon">
                <Link to="/register">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full border border-myanmar-maroon text-myanmar-maroon"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
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
        "md:hidden fixed inset-y-0 right-0 top-20 z-50 bg-white/95 pt-6 px-6 w-4/5 max-w-xs shadow-2xl rounded-l-3xl transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-5rem)]",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )} style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.href}
              className="flex items-center gap-3 p-3 text-lg font-bold text-myanmar-maroon rounded-full hover:bg-myanmar-gold/20 transition-colors"
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
                className="flex items-center gap-3 p-3 text-lg font-bold text-myanmar-maroon rounded-full hover:bg-myanmar-gold/20 transition-colors"
                onClick={toggleMobileMenu}
              >
                <UserCircle className="h-5 w-5" />
                <span>{t('Profile')}</span>
              </Link>
              <Link 
                to="/saved-scholarships" 
                className="flex items-center gap-3 p-3 text-lg font-bold text-myanmar-maroon rounded-full hover:bg-myanmar-gold/20 transition-colors"
                onClick={toggleMobileMenu}
              >
                <BookOpen className="h-5 w-5" />
                <span>{t('Saved Scholarships')}</span>
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-3 p-3 text-lg font-bold text-myanmar-maroon rounded-full hover:bg-myanmar-gold/20 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span>{t('Admin Dashboard')}</span>
                </Link>
              )}
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 p-3 text-lg font-bold text-myanmar-maroon rounded-full hover:bg-myanmar-gold/20 transition-colors"
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
