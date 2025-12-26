import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, ChevronDown, Facebook, UserCircle, User, Settings, CreditCard, FileAudio } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../../utils/auth/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const NavbarLoginDropdown = () => {

  const { user, loading, logout } = useAuth(); 

  const loginWithGoogle = async (): Promise<void> => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log("✅ Google login success:", user);
    } catch (error: any) {
      console.error("❌ Google login failed:", error);
      alert("Google login failed: " + error.message);
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      const user = result.user;
      console.log("✅ Facebook login success:", user);
    } catch (error: any) {
      console.error("❌ Facebook login failed:", error);
      alert("Facebook login failed: " + error.message);
    }
  };



  if (loading) return <p>Loading...</p>;

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <Avatar className="w-7 h-7 md:w-6 md:h-6">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback>
              {user.displayName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <span className="hidden sm:inline-block">{user.displayName?.split(" ")[0] || "User"}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 sm:w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 ring-1 ring-black/5 dark:ring-white/10">
        <DropdownMenuLabel className="px-2 py-1">
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{user.displayName?.split(" ")[0] || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground truncate" title={user.email}>{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* <DropdownMenuItem onSelect={() => window.location.assign('/profile')} className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => window.location.assign('/recordings')} className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <FileAudio className="w-4 h-4" />
          My Recordings
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem onSelect={() => window.location.assign('/settings')} className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => window.location.assign('/billing')} className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <CreditCard className="w-4 h-4" />
          Billing
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="flex items-center gap-1.5 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <LogIn className="w-4 h-4" />
          <span className="">Login</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={8} className="z-50 w-64 sm:w-full bg-white dark:bg-gray-800 rounded-md shadow-lg p-3 space-y-2">
        <Button
          type="button"
          onClick={loginWithGoogle}
          className="w-full justify-start bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all duration-200 ease-in-out px-3 py-2 rounded-md flex items-center"
          aria-label="Sign in with Google"
        >
          <FcGoogle className="w-4 h-4 mr-2" />
          <span className="text-sm">Sign in with Google</span>
        </Button>

        {/* Uncomment if Facebook login is desired */}
        {/*
        <Button
          type="button"
          onClick={loginWithFacebook}
          className="w-full justify-start bg-[#1877F2] text-white hover:bg-[#165ec6] transition-all duration-200 ease-in-out px-3 py-2 rounded-md flex items-center"
          aria-label="Sign in with Facebook"
        >
          <Facebook className="w-4 h-4 mr-2" />
          <span className="text-sm">Sign in with Facebook</span>
        </Button>
        */}

        <div className="text-xs text-muted-foreground pt-1">We never post to your social accounts. Secure sign-in.</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

};

