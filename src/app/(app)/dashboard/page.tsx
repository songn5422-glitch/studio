'use client';

import { PageHeader } from '@/components/dashboard/page-header';
import { AccountOverview } from '@/components/dashboard/account-overview';
import { ProtectionStatus } from '@/components/dashboard/protection-status';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useLanguage } from '@/context/language-context';
import { useApp } from '@/hooks/use-app';
import { BudgetStatus } from '@/components/dashboard/budget-status';
import { AiInsights } from '@/components/analytics/ai-insights';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useApp();

  if (user.tier === 'free') {
    return (
      <div className="space-y-8">
        <PageHeader
          title={t('dashboard')}
          description={t('dashboard_description')}
        />
        <AccountOverview />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BudgetStatus />
          <AiInsights />
        </div>
         <Card className="glass-card text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary"/>
            </div>
            <CardTitle className="pt-4">Unlock Automated Savings</CardTitle>
            <CardDescription>
              Premium users get automated impulse spending protection and a smart-contract savings vault.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
               <Star className="mr-2 h-4 w-4" />
              {t('upgrade_to_premium')}
            </Button>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="flex items-center">
            <QuickActions />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('dashboard')}
        description={t('dashboard_description')}
      />
      <AccountOverview />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProtectionStatus />
        <AiInsights />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="flex items-center">
            <QuickActions />
          </div>
      </div>
    </div>
  );
}
