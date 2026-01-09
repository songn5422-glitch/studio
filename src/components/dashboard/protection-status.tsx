"use client";

import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export function ProtectionStatus() {
  const { transactions, settings } = useApp();

  const wantsSpendingThisMonth = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return transactions
      .filter(t => t.category === 'Want' && new Date(t.date) > oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  const wantsBudget = settings.wantsBudget;
  const percentageUsed = Math.min((wantsSpendingThisMonth / wantsBudget) * 100, 100);

  const getStatus = () => {
    if (percentageUsed > 70) {
      return { label: 'Protection Active', color: 'text-destructive', progressColor: 'bg-destructive' };
    }
    if (percentageUsed > 30) {
      return { label: 'Caution', color: 'text-amber-400', progressColor: 'bg-amber-400' };
    }
    return { label: 'Safe Zone', color: 'text-accent', progressColor: 'bg-accent' };
  };

  const status = getStatus();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Protection Status</CardTitle>
        <CardDescription>
            Your &quot;Wants&quot; spending relative to your monthly budget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
            <p className="text-2xl font-bold">Current Level:</p>
            <p className={cn("text-2xl font-bold", status.color)}>{status.label}</p>
        </div>
        <Progress value={percentageUsed} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:via-amber-400 [&>div]:to-destructive" />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>${wantsSpendingThisMonth.toFixed(2)}</span>
          <span>${wantsBudget.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
