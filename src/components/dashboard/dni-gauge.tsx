"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const GAUGE_MAX = 100;
const SCORE_MAX = 1.0;

export function DniGauge() {
  const { dniEngine } = useApp();
  const score = dniEngine.currentScore;
  
  const needleValue = score * GAUGE_MAX;

  const data = [
    { name: 'Luxury', value: 30, color: 'hsl(var(--destructive))' },
    { name: 'Discretionary', value: 20, color: 'hsl(var(--chart-3))' },
    { name: 'Moderate', value: 20, color: 'hsl(var(--chart-5))' },
    { name: 'High', value: 20, color: 'hsl(var(--chart-2))' },
    { name: 'Essential', value: 10, color: 'hsl(var(--accent))' },
  ];

  const getStatus = () => {
    if (score < 0.4) return { text: "High luxury spending detected", color: "text-destructive" };
    if (score < 0.6) return { text: "Balanced mix of needs and wants", color: "text-amber-400" };
    return { text: "Prioritizing essential spending", color: "text-accent" };
  }

  const status = getStatus();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Dynamic Necessity Index (DNI)</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-bold mb-2">What is DNI?</p>
                <p>The DNI measures how essential your purchases are based on your occupation, spending habits, and real-time economic data to help you make smarter financial decisions.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Your current spending necessity score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={90}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <div
              className="h-24 w-1 bg-foreground/50 transition-transform duration-500 origin-bottom"
              style={{ transform: `rotate(${needleValue * 1.8 - 90}deg)` }}
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full" />
            <p className="text-4xl font-bold mt-2">{score.toFixed(2)}</p>
             <p className={cn("font-semibold text-sm", status.color)}>{status.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
