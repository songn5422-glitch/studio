"use client";

import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, ShoppingCart, Utensils, Car, VenetianMask, Receipt } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function RecentActivity() {
  const { transactions, user } = useApp();
  const { t } = useLanguage();
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'food-dining': return <Utensils className="h-5 w-5 text-muted-foreground" />;
        case 'transportation': return <Car className="h-5 w-5 text-muted-foreground" />;
        case 'shopping': return <ShoppingCart className="h-5 w-5 text-muted-foreground" />;
        case 'entertainment': return <VenetianMask className="h-5 w-5 text-muted-foreground" />;
        case 'bills-utilities': return <Receipt className="h-5 w-5 text-muted-foreground" />;
        case 'Need': return <CheckCircle className="h-5 w-5 text-accent" />;
        case 'Want': return <XCircle className="h-5 w-5 text-amber-400" />;
        default: return <ShoppingCart className="h-5 w-5 text-muted-foreground" />;
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{t('recent_activity')}</CardTitle>
        <CardDescription>{t('your_last_5_transactions')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentTransactions.map(tx => (
            <li key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {getCategoryIcon(tx.category)}
                <div>
                  <p className="font-semibold">{tx.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 {user.tier === 'premium' && (
                    <Badge variant={tx.category === 'Need' ? 'secondary' : 'outline'} className={cn(tx.category === 'Want' && 'border-amber-400 text-amber-400')}>
                        {tx.category === 'Need' ? t('needs') : t('wants')}
                    </Badge>
                 )}
                <p className={cn("font-semibold text-right w-24", tx.amount > 0 ? "text-accent" : "text-foreground")}>
                  {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
