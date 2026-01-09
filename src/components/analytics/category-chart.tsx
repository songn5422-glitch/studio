"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from 'react';

// Simple mapping for demo purposes
const getBroaderCategory = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('grocery') || name.includes('food')) return 'Food & Groceries';
    if (name.includes('rent') || name.includes('utilities')) return 'Housing';
    if (name.includes('gas') || name.includes('transport')) return 'Transportation';
    if (name.includes('game') || name.includes('subscription') || name.includes('dinner')) return 'Entertainment';
    if (name.includes('headphone') || name.includes('electronic')) return 'Electronics';
    if (name.includes('coat') || name.includes('fashion')) return 'Clothing';
    return 'Others';
};


const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#8884d8'];

export function CategoryChart() {
    const { transactions } = useApp();

    const chartData = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        transactions.forEach(t => {
            const category = getBroaderCategory(t.product);
            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }
            categoryMap[category] += t.amount;
        });

        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [transactions]);


    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Spending distribution by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  borderColor: 'hsl(var(--border))',
                                }}
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
