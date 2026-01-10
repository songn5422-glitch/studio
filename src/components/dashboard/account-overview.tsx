
"use client";

import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowDown, ArrowUp, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function AccountOverview() {
  const { user, updateBalance } = useApp();
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number.',
        variant: 'destructive',
      });
      return;
    }
    updateBalance(user.balance + depositAmount);
    toast({
      title: 'Deposit Successful',
      description: `$${depositAmount.toFixed(2)} has been added to your balance.`,
    });
    setAmount('');
    setDepositModalOpen(false);
  };
  
  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number.',
        variant: 'destructive',
      });
      return;
    }
    if (withdrawAmount > user.balance) {
      toast({
        title: 'Insufficient Funds',
        description: 'You cannot withdraw more than your current balance.',
        variant: 'destructive',
      });
      return;
    }
    updateBalance(user.balance - withdrawAmount);
    toast({
      title: 'Withdrawal Successful',
      description: `$${withdrawAmount.toFixed(2)} has been withdrawn from your balance.`,
    });
    setAmount('');
    setWithdrawModalOpen(false);
  };
  
  const totalBalance = user.tier === 'free' 
    ? user.connectedBanks.reduce((sum, bank) => sum + (bank.balance || 0), 0)
    : user.balance;

  return (
    <>
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {user.tier === 'free' ? t('total_linked_balance') : t('total_balance')}
            </p>
            <p className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
             {user.tier === 'free' && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                    <RefreshCcw className="h-3 w-3" />
                    <span>Last synced: 2 minutes ago</span>
                </div>
            )}
          </div>
           {user.tier === 'premium' ? (
            <div className="flex w-full gap-2 sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => setDepositModalOpen(true)}>
                <ArrowDown className="mr-2 h-4 w-4" /> {t('add_funds')}
                </Button>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => setWithdrawModalOpen(true)}>
                <ArrowUp className="mr-2 h-4 w-4" /> {t('withdraw')}
                </Button>
            </div>
           ) : (
            <Button size="lg" variant="secondary">
                <RefreshCcw className="mr-2 h-4 w-4" /> Sync Now
            </Button>
           )}
        </div>
         {user.tier === 'free' && (
            <div className="mt-4 space-y-2">
                {user.connectedBanks.map((bank) => {
                    const balance = bank.balance || 0;
                    return (
                        <div key={bank.id} className="flex justify-between items-center text-sm p-2 bg-background/50 rounded-md">
                            <span className="text-muted-foreground">{bank.name} ({bank.accountNumber})</span>
                            <span className={cn("font-mono text-foreground", balance < 0 && "text-destructive")}>
                              {balance < 0 ? '-' : ''}${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('deposit_funds')}</DialogTitle>
            <DialogDescription>{t('deposit_desc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank" className="text-right">{t('bank')}</Label>
              <Select defaultValue={user.connectedBanks.find(b => b.type !== 'Credit Card')?.accountNumber}>
                <SelectTrigger id="bank" className="col-span-3">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {user.connectedBanks.filter(b => b.type !== 'Credit Card').map(bank => (
                    <SelectItem key={bank.accountNumber} value={bank.accountNumber}>
                      {bank.name} {bank.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">{t('amount')}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleDeposit}>{t('deposit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('withdraw_to_bank')}</DialogTitle>
            <DialogDescription>{t('withdraw_desc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank-withdraw" className="text-right">{t('bank')}</Label>
              <Select defaultValue={user.connectedBanks.find(b => b.type !== 'Credit Card')?.accountNumber}>
                <SelectTrigger id="bank-withdraw" className="col-span-3">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {user.connectedBanks.filter(b => b.type !== 'Credit Card').map(bank => (
                    <SelectItem key={bank.accountNumber} value={bank.accountNumber}>
                      {bank.name} {bank.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount-withdraw" className="text-right">{t('amount')}</Label>
              <Input
                id="amount-withdraw"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleWithdraw}>{t('withdraw')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
