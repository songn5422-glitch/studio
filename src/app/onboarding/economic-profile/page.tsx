'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/hooks/use-app';
import { useRouter } from 'next/navigation';
import { Signature } from 'lucide-react';
import { cn } from '@/lib/utils';

const occupations = [
    { value: 'Software Engineer', label: 'Software Engineer', sector: 'Technology' },
    { value: 'Data Scientist', label: 'Data Scientist', sector: 'Technology' },
    { value: 'Product Manager', label: 'Product Manager', sector: 'Technology' },
    { value: 'Student', label: 'Student', sector: 'Education' },
    { value: 'Teacher', label: 'Teacher', sector: 'Education' },
    { value: 'Photographer', label: 'Photographer', sector: 'Creative' },
    { value: 'Writer', label: 'Writer', sector: 'Creative' },
    { value: 'Accountant', label: 'Accountant', sector: 'Business' },
    { value: 'Doctor', label: 'Doctor', sector: 'Healthcare' },
    // Add more...
];

export default function EconomicProfilePage() {
    const { user, setState } = useApp();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const contractRef = useRef<HTMLDivElement>(null);
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 5) {
            setScrolled(true);
        }
    };
    
    const handleSignContract = () => {
        setState(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                economicProfile: {
                    ...prevState.user.economicProfile,
                    contractSignedAt: new Date().toISOString(),
                    disciplineContractHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
                }
            }
        }));
        router.push('/dashboard');
    }

    if (user.tier !== 'premium') {
      if (typeof window !== 'undefined') {
        router.push('/onboarding');
      }
      return null;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Economic Profile Setup</h1>
                <p className="text-xl text-muted-foreground">Help us personalize your financial guardian.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Your Economic Context</CardTitle>
                        <CardDescription>This information helps our AI understand your unique financial needs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Your Primary Occupation</Label>
                            <Select 
                                value={user.economicProfile.occupation}
                                onValueChange={(value) => setState(p => ({...p, user: {...p.user, economicProfile: {...p.user.economicProfile, occupation: value}}}))}
                            >
                                <SelectTrigger id="occupation">
                                    <SelectValue placeholder="Select your occupation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {occupations.map(occ => (
                                        <SelectItem key={occ.value} value={occ.value}>{occ.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dependents">Financial Dependents</Label>
                            <Input 
                                id="dependents" 
                                type="number" 
                                min="0"
                                value={user.economicProfile.dependents}
                                onChange={(e) => setState(p => ({...p, user: {...p.user, economicProfile: {...p.user.economicProfile, dependents: parseInt(e.target.value)}}}))}
                                placeholder="e.g., 2"
                            />
                             <p className="text-xs text-muted-foreground">Number of people you financially support (e.g., children).</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card flex flex-col">
                    <CardHeader>
                        <CardTitle>The Discipline Contract</CardTitle>
                        <CardDescription>Please read and agree to the terms of your AI guardian.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4">
                        <div ref={contractRef} onScroll={handleScroll} className="prose prose-sm prose-invert max-w-none border bg-background/30 rounded-md p-4 h-64 overflow-y-auto font-mono text-xs">
                            <h4 className="text-center">SMARTGUARD ECONOMIC DISCIPLINE AGREEMENT</h4>
                            <p>This Commitment Contract ("Agreement") is entered into on {new Date().toLocaleDateString()} between the User (hereinafter "Signatory") and the SmartGuard Protocol (hereinafter "Guardian").</p>
                            
                            <h5>ARTICLE I: PURPOSE</h5>
                            <p>The Signatory voluntarily commits to a disciplined spending framework to optimize long-term financial wellbeing through algorithmic intervention and time-locked asset management.</p>

                            <h5>ARTICLE II: COMMITMENT TERMS</h5>
                            <ol>
                                <li>The Signatory agrees to submit purchases exceeding the Dynamic Necessity Index (DNI) threshold of 0.40 to Guardian review.</li>
                                <li>Guardian may recommend alternative purchases with equivalent utility at reduced cost, sourced via Oracle price verification.</li>
                                <li>Should Signatory proceed with low-DNI purchases, excess funds SHALL BE automatically allocated to the Time-Locked Vault for a minimum period of 30 days.</li>
                                <li>Vault funds may be deployed to yield-generating DeFi protocols (Aave, Compound, Yearn) at Guardian's discretion for Signatory benefit.</li>
                            </ol>
                            
                            <h5>ARTICLE III: MINDFULNESS PROVISION</h5>
                            <p>Guardian shall impose a 60-second "cooling period" before final commitment to low-necessity purchases, allowing Signatory to reconsider in a calm state.</p>
                            
                            <h5>ARTICLE IV: BLOCKCHAIN IMMUTABILITY</h5>
                            <p>This Agreement, once signed, shall be hashed and recorded on the Polygon blockchain for transparency and immutability.</p>
                            
                            <p className="text-center font-bold">BY CLICKING "SIGN & HASH AGREEMENT," THE SIGNATORY ACKNOWLEDGES READING, UNDERSTANDING, AND CONSENTING TO THESE TERMS.</p>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} disabled={!scrolled}/>
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I have read and understand the Discipline Contract
                            </label>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                         <Button onClick={handleSignContract} disabled={!agreed} className={cn("w-full neon-glow", agreed && "animate-pulse")}>
                            <Signature className="mr-2 h-4 w-4"/>
                            Sign & Hash Agreement
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
