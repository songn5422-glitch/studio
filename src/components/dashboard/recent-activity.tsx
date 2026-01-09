"use client";

import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

export function RecentActivity() {
  const { transactions } = useApp();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your last 5 transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentTransactions.map(tx => (
            <li key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {tx.status === 'Approved' ? <CheckCircle className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-destructive" />}
                <div>
                  <p className="font-semibold">{tx.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <Badge variant={tx.category === 'Need' ? 'secondary' : 'outline'} className={cn(tx.category === 'Want' && 'border-amber-400 text-amber-400')}>
                  {tx.category}
                </Badge>
                <p className="font-semibold text-right w-24">
                  ${tx.amount.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
