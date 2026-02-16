'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Activity, BarChart3, Settings, LogOut, User, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    router.push('/');
  };

  if (isLoading) {
    return (
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <AlertCircle className="w-6 h-6 text-primary" />
              <span className="text-foreground">Golden 10</span>
            </Link>
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition">
            <AlertCircle className="w-6 h-6 text-primary" />
            <span className="text-foreground">Golden 10</span>
          </Link>

          {/* Center Nav Links */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/emergency"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                <span>Emergency</span>
              </Link>
              <Link
                href="/simulate"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
              >
                <Activity className="w-4 h-4" />
                <span>Simulate</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.name}</span>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border bg-muted/20">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-primary mt-1 capitalize">{user?.role.replace('_', ' ')}</p>
                    </div>
                    <Link
                      href="/hospital-profile"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition text-left border-b border-border"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Hospital Profile</span>
                    </Link>
                    <Link
                      href="/register-hospital"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition text-left border-b border-border"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Register Hospital</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <Button variant="outline" size="sm" className="border-border">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
