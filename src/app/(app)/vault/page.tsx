"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { ShieldCheck, ArrowRight, Link as LinkIcon, Lock } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const Countdown = ({ unlockDate }: { unlockDate: string }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const distance = formatDistanceToNow(new Date(unlockDate), { addSuffix: true });
    
    return <p className="text-sm text-muted-foreground">{distance}</p>;
};


export default function VaultPage() {
  const { vaultEntries } = useApp();

  const totalLocked = useMemo(() => {
    return vaultEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [vaultEntries]);

  const vaultContractAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Savings Vault"
        description="Your secure, time-locked savings. A testament to your discipline."
      />
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-accent"/>Vault Overview</span>
          </CardTitle>
          <CardDescription>Estimated unlock value is in USDC (stablecoin).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Locked in Vault</p>
            <p className="text-4xl font-bold">${totalLocked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contract Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm truncate">{vaultContractAddress}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                  <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Time-Locked Funds</h2>
        {vaultEntries.map(entry => {
            const unlockDate = new Date(entry.unlockDate);
            const lockedDate = new Date(entry.lockedDate);
            const isUnlockable = isPast(unlockDate);
            
            const totalDuration = unlockDate.getTime() - lockedDate.getTime();
            const elapsed = new Date().getTime() - lockedDate.getTime();
            const progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;

            return (
                <Card key={entry.id} className="glass-card">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <p className="text-xl font-bold">${entry.amount.toFixed(2)}</p>
                            <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Locked on {format(lockedDate, 'MMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center justify-between">
                             <Badge variant={isUnlockable ? "default" : "secondary"} className={isUnlockable ? "bg-accent hover:bg-accent/90" : ""}>
                               {isUnlockable ? 'Unlockable' : 'Locked'}
                             </Badge>
                             <p className="text-xs text-muted-foreground">{format(unlockDate, 'MMM d, yyyy')}</p>
                           </div>
                           <Progress value={progress} className="h-2"/>
                           {!isUnlockable && <Countdown unlockDate={entry.unlockDate} />}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button disabled={!isUnlockable}>Withdraw</Button>
                            <Button disabled={!isUnlockable} variant="outline">Reinvest</Button>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
