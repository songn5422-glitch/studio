"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";
import { format } from 'date-fns';
import { useLanguage } from "@/context/language-context";

export function SavingsChart() {
  const { vaultEntries } = useApp();
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    if (vaultEntries.length === 0) return [];
    
    const sortedEntries = [...vaultEntries].sort((a, b) => new Date(a.lockedDate).getTime() - new Date(b.lockedDate).getTime());
    
    let cumulativeSavings = 0;
    return sortedEntries.map(entry => {
      cumulativeSavings += entry.amount;
      return {
        date: format(new Date(entry.lockedDate), 'MMM d'),
        savings: cumulativeSavings
      };
    });
  }, [vaultEntries]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{t('savings_growth')}</CardTitle>
        <CardDescription>{t('savings_growth_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                 contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Area type="monotone" dataKey="savings" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
