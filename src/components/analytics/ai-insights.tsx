'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Lightbulb } from "lucide-react";

const mockInsights = [
  "You spent 40% more on Entertainment this month compared to last month.",
  "Your best saving day is Tuesday, where you make 60% fewer impulse purchases.",
  "Consider reducing your 'Wants' limit to $500 to save an additional $100/month.",
];

export function AiInsights() {
  const { t } = useLanguage();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary h-6 w-6" />
          {t('ai_insights')}
        </CardTitle>
        <CardDescription>{t('ai_insights_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockInsights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">{insight}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
