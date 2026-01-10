"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export function VaultYieldCard() {
  const { vaultEntries } = useApp();

  const { totalLocked, totalInterest, avgApy } = useMemo(() => {
    const totalLocked = vaultEntries.reduce((sum, entry) => sum + entry.principal, 0);
    const totalInterest = vaultEntries.reduce((sum, entry) => sum + (entry.accruedInterest || 0), 0);
    const totalWeightedApy = vaultEntries.reduce((sum, entry) => sum + (entry.principal * (entry.apy || 0)), 0);
    const avgApy = totalLocked > 0 ? totalWeightedApy / totalLocked : 0;
    return { totalLocked, totalInterest, avgApy };
  }, [vaultEntries]);

  return (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle>Vault Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShieldCheck/>Protected Capital</p>
                    <p className="text-3xl font-bold">${totalLocked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp/>Earned Yield</p>
                    <p className="text-3xl font-bold text-green-400">+${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    {avgApy > 0 && <p className="text-xs text-green-400">{avgApy.toFixed(2)}% Avg. APY</p>}
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Total Value</p>
                <p className="font-semibold">${(totalLocked + totalInterest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <Button asChild variant="secondary" className="w-full">
                <Link href="/vault">View Detailed Portfolio</Link>
            </Button>
        </CardContent>
    </Card>
  );
}
