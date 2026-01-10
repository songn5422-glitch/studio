"use client";

import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useLanguage } from '@/context/language-context';

export function BudgetStatus() {
  const { transactions, settings } = useApp();
  const { t } = useLanguage();

  const spendingThisMonth = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return transactions
      .filter(t => new Date(t.date) > oneMonthAgo && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);
  
  const totalBudget = settings.totalBudget;
  const percentageUsed = Math.min((spendingThisMonth / totalBudget) * 100, 100);

  const getStatus = () => {
    if (percentageUsed > 90) {
      return { label: t('over_budget'), color: 'text-destructive', progressColor: 'bg-destructive' };
    }
    if (percentageUsed > 70) {
      return { label: t('approaching_limit'), color: 'text-amber-400', progressColor: 'bg-amber-400' };
    }
    return { label: t('on_track'), color: 'text-accent', progressColor: 'bg-accent' };
  };

  const status = getStatus();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{t('this_months_budget')}</CardTitle>
        <CardDescription>
            {t('budget_desc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
            <p className={cn("text-2xl font-bold", status.color)}>{status.label}</p>
        </div>
        <Progress value={percentageUsed} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:via-amber-400 [&>div]:to-destructive" />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>${spendingThisMonth.toFixed(2)}</span>
          <span>${totalBudget.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
