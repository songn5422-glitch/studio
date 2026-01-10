"use client";

import { Button } from '@/components/ui/button';
import { ScanLine, ShieldCheck, Cog, Lock, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const { t } = useLanguage();
  const { user, setTier } = useApp();
  const router = useRouter();

  if (user.tier === 'free') {
      return (
        <div className="w-full space-y-4">
            <Button asChild size="lg" className="h-16 text-lg w-full">
                <Link href="/settings">
                    <Cog className="mr-3 h-6 w-6" />
                    {t('set_budget_goals')}
                </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-16 text-lg w-full">
                <Link href="/analytics">
                    <BarChart2 className="mr-3 h-6 w-6" />
                    {t('view_spending_analysis')}
                </Link>
            </Button>
             <Card className="glass-card text-center p-4">
                <CardHeader className="p-2">
                     <div className="mx-auto bg-primary/20 rounded-full h-12 w-12 flex items-center justify-center mb-2">
                        <Lock className="h-6 w-6 text-primary"/>
                    </div>
                    <CardTitle className="text-base">Want automated savings?</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <Button size="sm" className="w-full" onClick={() => {
                      setTier('premium');
                      router.push('/scan');
                    }}>
                        <ScanLine className="mr-2 h-4 w-4" />
                        Upgrade to Scan
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <Button asChild size="lg" className="h-20 text-lg">
        <Link href="/scan">
          <ScanLine className="mr-3 h-6 w-6" />
          {t('scan_new_purchase')}
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary" className="h-20 text-lg">
        <Link href="/vault">
          <ShieldCheck className="mr-3 h-6 w-6" />
          {t('view_savings_vault')}
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary" className="h-20 text-lg">
        <Link href="/settings">
          <Cog className="mr-3 h-6 w-6" />
          {t('set_spending_rules')}
        </Link>
      </Button>
    </div>
  );
}
