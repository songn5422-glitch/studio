"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { SummaryCards } from "@/components/analytics/summary-cards";
import { SpendingChart } from "@/components/analytics/spending-chart";
import { CategoryChart } from "@/components/analytics/category-chart";
import { SavingsChart } from "@/components/analytics/savings-chart";
import { AiInsights } from "@/components/analytics/ai-insights";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Spending Analytics"
        description="Visualize your financial habits and gain insights to improve."
      />
      <SummaryCards />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SpendingChart />
        <CategoryChart />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SavingsChart />
        <AiInsights />
      </div>
    </div>
  );
}
