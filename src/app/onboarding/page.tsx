'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield, Wallet } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';
import { useState }from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const { user, setTier, connectWallet } = useApp();
    const { t } = useLanguage();
    const [selectedTier, setSelectedTier] = useState<'free' | 'premium' | null>(null);
    const router = useRouter();


    const freeFeatures = [
        t('link_unlimited_accounts'),
        t('real_time_spending_tracking'),
        t('ai_powered_spending_insights'),
        t('budget_alerts_and_warnings'),
        t('blockchain_verified_history'),
        t('basic_analytics'),
        t('monthly_spending_reports')
    ];

    const premiumFeatures = [
        t('everything_in_basic'),
        t('advanced_ai_categorization'),
        t('oracle_verified_price_checking'),
        t('smart_contract_vault'),
        t('automated_impulse_protection'),
        t('ai_investment_recommendations'),
        t('defi_yield_optimization'),
        t('priority_support')
    ];

    const handleSelectTier = (tier: 'free' | 'premium') => {
        setTier(tier);
        setSelectedTier(tier);
    }
    
    const handleContinue = () => {
        if (!user.walletAddress) {
            connectWallet();
            // After connecting, the layout effect will handle routing.
        } else {
             if (user.tier === 'premium') {
                router.push('/onboarding/economic-profile');
            } else {
                router.push('/dashboard');
            }
        }
    }


    if (selectedTier) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
             <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground mb-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-extrabold tracking-tight">One Last Step</h1>
                </div>
                <p className="text-xl text-muted-foreground">Connect your wallet to secure your account.</p>
            </div>
            <Card className="glass-card max-w-md w-full">
                <CardHeader>
                    <CardTitle>Connect Your Wallet</CardTitle>
                    <CardDescription>
                        We use the blockchain to ensure your financial data is transparent and secure. Your wallet is your key.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {user.walletAddress ? (
                         <div className="flex items-center justify-center flex-col gap-4 p-4 bg-muted rounded-lg text-center">
                            <Check className="h-12 w-12 text-accent"/>
                            <p className="font-semibold">Wallet Connected!</p>
                            <p className="text-sm text-muted-foreground">{`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">Your wallet is required to continue.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleContinue} className="w-full" size="lg">
                         {user.walletAddress ? 'Continue' : <><Wallet className="mr-2 h-4 w-4" /> Connect Wallet</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-extrabold tracking-tight">{t('welcome_to_smartguard')}</h1>
            </div>
            <p className="text-xl text-muted-foreground">{t('intelligent_financial_guardian')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
            {/* Free Tier Card */}
            <Card className="glass-card flex flex-col">
                <CardHeader className="text-center">
                    <Badge variant="secondary" className="w-fit mx-auto mb-2">{t('free_forever')}</Badge>
                    <CardTitle className="text-2xl">{t('smartguard_basic')}</CardTitle>
                    <CardDescription>{t('see_what_you_spend')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className="text-4xl font-bold text-center">{t('price_free')}</p>
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
                    <Button onClick={() => handleSelectTier('free')} className="w-full" size="lg">{t('start_free')}</Button>
                </CardFooter>
            </Card>

            {/* Premium Tier Card */}
            <Card className="glass-card flex flex-col border-primary/50 neon-glow relative">
                 <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground">{t('most_popular')}</Badge>
                <CardHeader className="text-center">
                    <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">{t('promo_price')}</Badge>
                    <CardTitle className="text-2xl gradient-text">{t('smartguard_premium')}</CardTitle>
                    <CardDescription>{t('control_what_you_spend')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                     <p className="text-4xl font-bold text-center">{t('price_premium')}</p>
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
                    <Button onClick={() => handleSelectTier('premium')} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground" size="lg">{t('go_premium')}</Button>
                </CardFooter>
            </Card>
        </div>

        <Button variant="link" className="mt-8 text-muted-foreground">{t('see_detailed_comparison')}</Button>
    </div>
  );
}
