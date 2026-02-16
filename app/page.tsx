'use client';

import Link from 'next/link';
import { AlertCircle, Zap, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with improved design */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Background glow effect */}
        <div className="absolute inset-0 -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Save lives in the golden 10</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold text-balance mb-8 leading-tight">
          <span className="text-foreground">AI-Powered</span>{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Emergency Response
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Optimize hospital routing with real-time AI intelligence. Reduce dispatch times, improve patient outcomes, and save lives through intelligent emergency coordination.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/simulate">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-12 gap-2">
              Try Simulation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline" size="lg" className="text-lg px-8 h-12 border-border hover:border-primary">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-primary">4.2 min</div>
            <p className="text-sm text-muted-foreground">Avg. dispatch time reduction</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-secondary">34%</div>
            <p className="text-sm text-muted-foreground">Better bed utilization</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-accent">19%</div>
            <p className="text-sm text-muted-foreground">Survival rate improvement</p>
          </div>
        </div>
      </section>

      {/* Problem Section - 4 columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The Challenge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Emergency response systems face critical operational challenges that impact patient outcomes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/30 transition">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Critical Delays</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Average dispatch delays exceed 8 minutes, consuming the golden window
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-card border border-border rounded-2xl p-8 hover:border-secondary/50 transition-all hover:shadow-xl hover:shadow-secondary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-secondary/30 transition">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Hospital Overload</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Resources scattered across facilities, ERs bottlenecked with no visibility
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-card border border-border rounded-2xl p-8 hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/30 transition">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Manual Routing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Decisions made on incomplete data, critical traffic patterns overlooked
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/30 transition">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Poor Outcomes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Suboptimal placements lead to increased mortality and complications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - 4 columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Golden 10 Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world results from hospitals using our AI platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden bg-card border border-primary/20 rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold text-primary mb-3">4.2 min</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Average dispatch time reduction from baseline
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-card border border-secondary/20 rounded-2xl p-8 bg-gradient-to-br from-secondary/10 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold text-secondary mb-3">34%</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Improvement in hospital bed utilization
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-card border border-accent/20 rounded-2xl p-8 bg-gradient-to-br from-accent/10 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold text-accent mb-3">28%</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Increase in golden window adherence rate
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-card border border-[hsl(var(--status-stable))]/20 rounded-2xl p-8 bg-gradient-to-br from-[hsl(var(--status-stable))]/10 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--status-stable))]/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold text-[hsl(var(--status-stable))] mb-3">19%</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estimated survival rate improvement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-12 md:p-16">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 -z-10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -mt-48 -ml-48 -z-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mb-48 -mr-48 -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">2.3M+</div>
              <p className="text-muted-foreground font-medium">Patients Served Annually</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent mb-3">450+</div>
              <p className="text-muted-foreground font-medium">Hospitals Integrated</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent mb-3">99.2%</div>
              <p className="text-muted-foreground font-medium">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-[hsl(var(--status-stable))] to-[hsl(var(--status-stable))]/70 bg-clip-text text-transparent mb-3">12k+</div>
              <p className="text-muted-foreground font-medium">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="absolute inset-0 -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>

        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
          Ready to optimize emergency response?
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience how AI-powered routing saves lives in the critical golden 10 minutes. Try our simulation or sign up to manage your hospital operations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/simulate">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-12 gap-2">
              Try Simulation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="text-lg px-8 h-12 border-border hover:border-primary">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-foreground mb-4">
                <AlertCircle className="w-5 h-5 text-primary" />
                <span>Golden 10</span>
              </div>
              <p className="text-sm text-muted-foreground">Saving lives through AI-powered emergency coordination</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Golden 10. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
