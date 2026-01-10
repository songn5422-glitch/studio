
"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { ShieldCheck, Link as LinkIcon, Lock, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/language-context";

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

const ProtocolLogo = ({ protocol }: { protocol?: 'Aave' | 'Compound' }) => {
    if (protocol === 'Aave') return <ShieldCheck className="h-5 w-5 text-purple-400" />
    if (protocol === 'Compound') return <ShieldCheck className="h-5 w-5 text-green-400" />
    return <ShieldCheck className="h-5 w-5 text-muted-foreground" />
}


export default function VaultPage() {
  const { vaultEntries } = useApp();
  const { t } = useLanguage();

  const { totalLocked, totalInterest } = useMemo(() => {
    const totalLocked = vaultEntries.reduce((sum, entry) => sum + (entry.principal || entry.amount), 0);
    const totalInterest = vaultEntries.reduce((sum, entry) => sum + (entry.accruedInterest || 0), 0);
    return { totalLocked, totalInterest };
  }, [vaultEntries]);

  const vaultContractAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('vault_title')}
        description={t('vault_desc')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-2">
            <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-accent"/>{t('vault_overview')}</span>
            </CardTitle>
            <CardDescription>{t('estimated_unlock_value')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('total_locked_in_vault')}</p>
                    <p className="text-4xl font-bold">${totalLocked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Sparkles className="h-4 w-4 text-primary"/>{t('total_yield_earned')}</p>
                    <p className="text-4xl font-bold text-green-400">+${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
            
            </CardContent>
        </Card>
         <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Contract Info</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{t('contract_address')}</p>
                <div className="flex items-center gap-2">
                <p className="font-mono text-sm truncate">{vaultContractAddress}</p>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <LinkIcon className="h-4 w-4" />
                </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('time_locked_funds')}</h2>
        {vaultEntries.map(entry => {
            const unlockDate = new Date(entry.unlockDate);
            const lockedDate = new Date(entry.lockedDate);
            const isUnlockable = isPast(unlockDate);
            
            const totalDuration = unlockDate.getTime() - lockedDate.getTime();
            const elapsed = new Date().getTime() - lockedDate.getTime();
            const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 100;
            
            const principal = entry.principal || entry.amount;
            const currentValue = principal + (entry.accruedInterest || 0);

            return (
                <Card key={entry.id} className="glass-card">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-7 items-center gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <p className="text-xl font-bold">${currentValue.toFixed(2)}</p>
                             <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Principal: ${(principal).toFixed(2)}</p>
                                <p className="text-sm text-green-400">(+${(entry.accruedInterest || 0).toFixed(2)})</p>
                             </div>
                            <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Locked on {format(lockedDate, 'MMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ProtocolLogo protocol={entry.protocol}/>
                                <p className="font-semibold">{entry.protocol || 'Unknown'}</p>
                                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-none">{entry.apy?.toFixed(2)}% APY</Badge>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                           <div className="flex items-center justify-between">
                             <Badge variant={isUnlockable ? "default" : "secondary"} className={isUnlockable ? "bg-accent hover:bg-accent/90" : ""}>
                               {isUnlockable ? t('unlockable') : t(entry.status.toLowerCase())}
                             </Badge>
                             <p className="text-xs text-muted-foreground">{format(unlockDate, 'MMM d, yyyy')}</p>
                           </div>
                           <Progress value={progress} className="h-2"/>
                           {!isUnlockable && <Countdown unlockDate={entry.unlockDate} />}
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <Button disabled={!isUnlockable} variant="outline">{t('reinvest_button')}</Button>
                            <Button disabled={!isUnlockable}>{t('withdraw_button')}</Button>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
