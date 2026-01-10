'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const freeFeatures = [
    "Link unlimited bank accounts",
    "Real-time spending tracking",
    "AI-powered spending insights",
    "Budget alerts and warnings",
    "Blockchain-verified transaction history",
    "Basic analytics and charts",
    "Monthly spending reports"
];

const premiumFeatures = [
    "Everything in Basic, plus:",
    "Advanced AI categorization (Needs vs Wants)",
    "Oracle-verified price checking",
    "Smart contract savings vault",
    "Automated impulse spending protection",
    "AI investment recommendations",
    "DeFi yield optimization",
    "Priority support"
];


export default function OnboardingPage() {
    const { setTier, completeOnboarding } = useApp();

    const handleSelectTier = (tier: 'free' | 'premium') => {
        setTier(tier);
        completeOnboarding();
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-extrabold tracking-tight">Welcome to SmartGuard</h1>
            </div>
            <p className="text-xl text-muted-foreground">Your Intelligent Financial Guardian, Powered by AI, Secured by Blockchain</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
            {/* Free Tier Card */}
            <Card className="glass-card flex flex-col">
                <CardHeader className="text-center">
                    <Badge variant="secondary" className="w-fit mx-auto mb-2">Free Forever</Badge>
                    <CardTitle className="text-2xl">SmartGuard Basic</CardTitle>
                    <CardDescription>See what you spend with powerful monitoring tools.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className="text-4xl font-bold text-center">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                       {freeFeatures.map(feat => (
                         <li key={feat} className="flex items-start gap-2">
                           <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" /> 
                           <span>{feat}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSelectTier('free')} className="w-full" size="lg">Start Free</Button>
                </CardFooter>
            </Card>

            {/* Premium Tier Card */}
            <Card className="glass-card flex flex-col border-primary/50 neon-glow relative">
                 <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground">Most Popular</Badge>
                <CardHeader className="text-center">
                    <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">First 3 Months $4.99/mo</Badge>
                    <CardTitle className="text-2xl gradient-text">SmartGuard Premium</CardTitle>
                    <CardDescription>Control what you spend with automated blockchain enforcement.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                     <p className="text-4xl font-bold text-center">$9.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                       {premiumFeatures.map(feat => (
                         <li key={feat} className="flex items-start gap-2">
                           <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                           <span>{feat}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSelectTier('premium')} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground" size="lg">Go Premium</Button>
                </CardFooter>
            </Card>
        </div>

        <Button variant="link" className="mt-8 text-muted-foreground">See detailed comparison</Button>
    </div>
  );
}
