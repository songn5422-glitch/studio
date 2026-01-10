"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShieldAlert, ShieldCheck, Ratio } from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "@/context/language-context";

export function SummaryCards() {
  const { transactions, vaultEntries } = useApp();
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) > oneMonthAgo);
    
    const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const needsSpent = monthlyTransactions.filter(t => t.category === 'Need').reduce((sum, t) => sum + t.amount, 0);
    const wantsSpent = totalSpent - needsSpent;
    const ratio = totalSpent > 0 ? (needsSpent / totalSpent) * 100 : 0;
    
    const totalSaved = vaultEntries.reduce((sum, v) => sum + v.amount, 0);
    const preventedPurchases = vaultEntries.length;

    return { totalSpent, ratio, totalSaved, preventedPurchases };
  }, [transactions, vaultEntries]);

  const summaryData = [
    {
      title: t('total_spent_this_month'),
      value: `$${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      title: t('needs_vs_wants_ratio'),
      value: `${stats.ratio.toFixed(0)}% / ${(100 - stats.ratio).toFixed(0)}%`,
      icon: Ratio,
    },
    {
      title: t('total_saved_in_vault'),
      value: `$${stats.totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ShieldCheck,
    },
    {
      title: t('impulse_purchases_prevented'),
      value: stats.preventedPurchases,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index} className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
