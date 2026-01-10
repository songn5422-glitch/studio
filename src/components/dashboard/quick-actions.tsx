"use client";

import { Button } from '@/components/ui/button';
import { ScanLine, ShieldCheck, Cog, Lock, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useApp } from '@/hooks/use-app';
import { Card, CardContent } from '../ui/card';

export function QuickActions() {
  const { t } = useLanguage();
  const { user } = useApp();

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
                <Link href="/transactions">
                    <BarChart2 className="mr-3 h-6 w-6" />
                    {t('view_all_transactions')}
                </Link>
            </Button>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
