"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, BotMessageSquare, Sparkles, CheckCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { categorizePurchase, CategorizePurchaseOutput } from '@/ai/flows/categorize-purchase-with-ai';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

type AnalysisResult = CategorizePurchaseOutput & {
  productName: string;
  price: number;
  oraclePrice: number;
};

export function PurchaseScanner() {
  const { settings, transactions, addTransaction, addVaultEntry } = useApp();
  const [isPending, startTransition] = useTransition();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const { toast } = useToast();

  const wantsSpendingThisMonth = transactions
    .filter(t => t.category === 'Want' && new Date(t.date) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAnalysis = () => {
    const priceValue = parseFloat(price);
    if (!productName || isNaN(priceValue) || priceValue <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter a valid product name and price.', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      setResult(null);
      const res = await categorizePurchase({ productName, price: priceValue });
      if (res) {
        setResult({
          ...res,
          productName,
          price: priceValue,
          oraclePrice: priceValue * (1 + (Math.random() - 0.5) * 0.1), // Simulate oracle price +/- 5%
        });
      } else {
        toast({ title: 'AI Analysis Failed', description: 'Could not categorize the purchase. Please try again.', variant: 'destructive' });
      }
    });
  };

  const handleProceed = () => {
    if (!result) return;
    
    if (result.category === 'Want') {
      const newWantsTotal = wantsSpendingThisMonth + result.price;
      if (newWantsTotal > settings.wantsBudget) {
        setShowWarningModal(true);
        return;
      }
    }
    
    // Purchase under threshold
    addTransaction({
      product: result.productName,
      amount: result.price,
      category: result.category,
      aiReasoning: result.reasoning,
      status: 'Approved',
      oracleVerified: true,
    });
    setPurchaseComplete(true);
  };

  const handleLockAndPurchase = () => {
    if (!result) return;

    setIsLocking(true);
    setTimeout(() => { // Simulate blockchain transaction
      const overLimitAmount = (wantsSpendingThisMonth + result.price) - settings.wantsBudget;
      const lockedAmount = Math.max(0, overLimitAmount);

      const txId = `txn_${Date.now()}`;
      addTransaction({
        product: result.productName,
        amount: result.price,
        category: result.category,
        aiReasoning: result.reasoning,
        status: 'Locked',
        oracleVerified: true,
        lockedAmount: lockedAmount,
        vaultUnlockDate: new Date(Date.now() + settings.lockDuration * 24 * 60 * 60 * 1000).toISOString(),
        blockchainTxHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      });

      if (lockedAmount > 0) {
        addVaultEntry({
          amount: lockedAmount,
          lockedDate: new Date().toISOString(),
          unlockDate: new Date(Date.now() + settings.lockDuration * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Locked',
          originTransactionId: txId,
        });
      }

      setIsLocking(false);
      setShowWarningModal(false);
      setPurchaseComplete(true);
    }, 2000);
  };
  
  const resetScanner = () => {
    setProductName('');
    setPrice('');
    setResult(null);
    setPurchaseComplete(false);
  }

  if (isPending) {
    return (
        <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
            <Sparkles className="h-12 w-12 animate-pulse text-primary" />
            <p className="mt-4 text-lg font-semibold">Analyzing Purchase...</p>
            <p className="text-muted-foreground">Fetching price from Oracle, and categorizing with AI...</p>
        </Card>
    );
  }
  
  if (purchaseComplete) {
    const latestTx = transactions[0];
    return (
        <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
            <CheckCheck className="h-16 w-16 text-accent" />
            <h2 className="mt-4 text-2xl font-bold">Purchase Completed</h2>
            {latestTx.status === 'Locked' && latestTx.lockedAmount && (
                <>
                    <p className="text-muted-foreground">
                        ${latestTx.amount.toFixed(2)} for {latestTx.product}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-400">
                        ${latestTx.lockedAmount.toFixed(2)} locked in vault.
                    </p>
                </>
            )}
            <Button onClick={resetScanner} className="mt-6">
                Scan Another Purchase <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Card>
    );
  }

  if (result) {
    const isWant = result.category === 'Want';
    const newWantsTotal = isWant ? wantsSpendingThisMonth + result.price : wantsSpendingThisMonth;
    const isOverBudget = isWant && newWantsTotal > settings.wantsBudget;
    const progress = (wantsSpendingThisMonth / settings.wantsBudget) * 100;
    const newProgress = (newWantsTotal / settings.wantsBudget) * 100;

    return (
        <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold gradient-text mb-4">AI Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold">Product Info</h3>
                    <p>{result.productName}</p>
                    <p className="font-mono text-lg">${result.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Oracle-verified price: ${result.oraclePrice.toFixed(2)}</p>
                </div>
                <div>
                    <h3 className="font-semibold">AI Categorization</h3>
                    <Badge className={cn("text-lg", isWant ? 'border-amber-400 text-amber-400' : 'border-accent text-accent')} variant="outline">{result.category}</Badge>
                    <p className="text-sm text-muted-foreground mt-2 flex gap-2"><BotMessageSquare className="h-4 w-4 shrink-0 mt-0.5" />{result.reasoning}</p>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold">Spending Impact</h3>
                <p className="text-sm text-muted-foreground">Your 'Wants' spending this month: ${wantsSpendingThisMonth.toFixed(2)} / ${settings.wantsBudget.toFixed(2)}</p>
                <div className="relative h-4 w-full rounded-full bg-muted mt-2">
                    <div className="h-4 rounded-full bg-primary/20" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    <div className="absolute top-0 left-0 h-4 rounded-full bg-primary/20" style={{ width: `${Math.min(newProgress, 100)}%` }}>
                        <div className="h-4 rounded-full bg-amber-400" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                </div>
                {isOverBudget && <p className="text-amber-400 text-sm mt-2 flex gap-2"><ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />This purchase will exceed your Wants limit.</p>}
            </div>
            <div className="mt-6 flex gap-4">
                <Button onClick={handleProceed} className="flex-1" size="lg">Proceed with Purchase</Button>
                <Button onClick={() => setResult(null)} variant="outline" className="flex-1" size="lg">Cancel</Button>
            </div>
            <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><ShieldAlert className="text-amber-400" /> Impulse Protection Activated!</DialogTitle>
                        <DialogDescription>You are about to exceed your 'Wants' budget for this month.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Current 'Wants' spending: ${wantsSpendingThisMonth.toFixed(2)}</p>
                        <p>This purchase: ${result.price.toFixed(2)}</p>
                        <p>New total: <span className="font-bold">${newWantsTotal.toFixed(2)}</span> (Over by <span className="text-amber-400 font-bold">${(newWantsTotal - settings.wantsBudget).toFixed(2)}</span>)</p>
                        <p className="mt-4 bg-muted p-3 rounded-md text-muted-foreground">If you proceed, <span className="font-bold text-foreground">${(Math.max(0, newWantsTotal - settings.wantsBudget)).toFixed(2)} will be automatically locked in your Savings Vault for {settings.lockDuration} days.</span></p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowWarningModal(false)}>Cancel Purchase</Button>
                        <Button onClick={handleLockAndPurchase} disabled={isLocking}>{isLocking ? 'Locking...' : 'Lock & Purchase'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-0">
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Quick Scan</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="scan" className="p-6 text-center">
            <h3 className="text-lg font-semibold">Scan Product Barcode/Image</h3>
            <p className="text-muted-foreground mb-6">Simulated for demo purposes.</p>
            <Button size="lg" className="h-24 w-full">
              <Camera className="h-10 w-10" />
            </Button>
          </TabsContent>
          <TabsContent value="manual" className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Sony WH-1000XM5 Headphones" />
              </div>
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 399.99" />
              </div>
              <Button onClick={handleAnalysis} disabled={isPending} className="w-full">
                {isPending ? 'Analyzing...' : 'Analyze Purchase'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
