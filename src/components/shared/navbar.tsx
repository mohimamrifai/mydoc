import Logo from "./logo";
import SearchBar from "./search-bar";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AuthAndUserButton from "./auth-and-user-button";
export default function Navbar() {
  return (
    <nav className="border-b fixed top-0 left-0 right-0 bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Search and Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="w-72">
              <SearchBar />
            </div>
            <AuthAndUserButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="w-full">
                    <SearchBar />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Link 
                      href="/explore"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Explore
                    </Link>
                    <Link 
                      href="/join"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Bergabung di MyDoc
                    </Link>
                  </div>
                  <AuthAndUserButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
