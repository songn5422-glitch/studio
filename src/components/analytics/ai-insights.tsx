import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const mockInsights = [
  "You spent 40% more on Entertainment this month compared to last month.",
  "Your best saving day is Tuesday, where you make 60% fewer impulse purchases.",
  "Consider reducing your 'Wants' limit to $500 to save an additional $100/month.",
];

export function AiInsights() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary h-6 w-6" />
          AI Insights
        </CardTitle>
        <CardDescription>Actionable advice based on your spending habits.</CardDescription>
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
