"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";
import { format, subDays } from "date-fns";

export function SpendingChart() {
  const { transactions } = useApp();

  const chartData = useMemo(() => {
    const dataByDay: { [key: string]: { date: string; Needs: number; Wants: number } } = {};
    
    for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const formattedDate = format(date, 'MMM d');
        dataByDay[formattedDate] = { date: formattedDate, Needs: 0, Wants: 0 };
    }
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const formattedDate = format(date, 'MMM d');
      if (dataByDay[formattedDate]) {
        dataByDay[formattedDate][t.category] += t.amount;
      }
    });

    return Object.values(dataByDay);
  }, [transactions]);
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Daily spending over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Needs" stroke="hsl(var(--accent))" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Wants" stroke="hsl(var(--chart-3))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
