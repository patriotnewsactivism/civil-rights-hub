import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, Users, Scale, Megaphone, BookOpen } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span>Civil Rights Hub</span>
              <span className="text-xs font-normal text-muted-foreground">by We The People News</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/attorneys">
                <Scale className="h-4 w-4 mr-2" />
                Attorneys
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/activists">
                <Megaphone className="h-4 w-4 mr-2" />
                Activists
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/resources">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </Link>
            </Button>
            {user ? (
              <Button asChild>
                <Link to="/community">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
