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
import { ArrowDown, ArrowUp } from 'lucide-react';

export function AccountOverview() {
  const { user, updateBalance } = useApp();
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

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

  return (
    <>
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
            <p className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => setDepositModalOpen(true)}>
              <ArrowDown className="mr-2 h-4 w-4" /> Add Funds
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => setWithdrawModalOpen(true)}>
              <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>Deposit funds from your linked bank account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank" className="text-right">Bank</Label>
              <Select defaultValue={user.connectedBanks[0].accountNumber}>
                <SelectTrigger id="bank" className="col-span-3">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {user.connectedBanks.map(bank => (
                    <SelectItem key={bank.accountNumber} value={bank.accountNumber}>
                      {bank.name} {bank.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
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
            <Button type="submit" onClick={handleDeposit}>Deposit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw to Bank</DialogTitle>
            <DialogDescription>Withdraw funds to your linked bank account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank-withdraw" className="text-right">Bank</Label>
              <Select defaultValue={user.connectedBanks[0].accountNumber}>
                <SelectTrigger id="bank-withdraw" className="col-span-3">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {user.connectedBanks.map(bank => (
                    <SelectItem key={bank.accountNumber} value={bank.accountNumber}>
                      {bank.name} {bank.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount-withdraw" className="text-right">Amount</Label>
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
            <Button type="submit" onClick={handleWithdraw}>Withdraw</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
