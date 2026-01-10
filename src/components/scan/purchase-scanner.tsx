"use client";

import { useState, useTransition, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, BotMessageSquare, CheckCheck, ShieldAlert, ArrowRight, Search, Globe, Activity, BrainCircuit, ShieldCheck as ShieldCheckIcon, AlertTriangle, X } from 'lucide-react';
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
import { useLanguage } from '@/context/language-context';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';

type AnalysisResult = CategorizePurchaseOutput & {
  productName: string;
  price: number;
  oraclePrice: number;
  alternatives: { name: string; price: number; utility: number }[];
};

const analysisSteps = [
  { id: 'product', text: 'Identifying product...', detail: 'Verified via image recognition AI', icon: Search },
  { id: 'oracle', text: 'Fetching market prices via Oracle Network...', detail: 'Scanning 15 retailers for best price', icon: Globe },
  { id: 'ped', text: 'Fetching Price Elasticity of Demand...', detail: 'Oracle source: Economic Data API', icon: Activity },
  { id: 'utility', text: 'Calculating utility for your economic profile...', detail: 'Analyzing occupational necessity multipliers', icon: BrainCircuit },
  { id: 'dni', text: 'Generating Dynamic Necessity Index...', detail: 'Purchase necessity score generated', icon: ShieldCheckIcon },
];

const mockAlternatives = [
    { name: 'Sennheiser HD 560S', price: 189.99, utility: 87 },
    { name: 'Beyerdynamic DT 770 PRO', price: 169.00, utility: 85 },
    { name: 'Audio-Technica ATH-M50x', price: 149.00, utility: 82 },
];

export function PurchaseScanner() {
  const { settings, transactions, addTransaction, addVaultEntry, user } = useApp();
  const [isScanning, startScanning] = useTransition();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showIntervention, setShowIntervention] = useState(false);
  const [showMindfulnessTimer, setShowMindfulnessTimer] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const { t } = useLanguage();

  const wantsSpendingThisMonth = transactions
    .filter(t => t.category === 'Want' && new Date(t.date) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  useEffect(() => {
    if (isScanning) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= analysisSteps.length -1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isScanning]);
  
  useEffect(() => {
    if (showMindfulnessTimer && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      if(timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if(timerRef.current) clearTimeout(timerRef.current);
    }
  }, [showMindfulnessTimer, countdown]);

  const handleAnalysis = () => {
    const priceValue = parseFloat(price);
    if (!productName || isNaN(priceValue) || priceValue <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter a valid product name and price.', variant: 'destructive' });
      return;
    }

    startScanning(async () => {
      setResult(null);
      setShowIntervention(false);
      await new Promise(resolve => setTimeout(resolve, analysisSteps.length * 1000));
      
      const res = await categorizePurchase({ productName, price: priceValue });
      if (res) {
        const fullResult = {
          ...res,
          productName,
          price: priceValue,
          oraclePrice: priceValue * (1 + (Math.random() - 0.5) * 0.1), // Simulate oracle price +/- 5%
          alternatives: mockAlternatives,
        };
        setResult(fullResult);
        if (fullResult.category === 'Want') {
            setShowIntervention(true);
        }
      } else {
        toast({ title: 'AI Analysis Failed', description: 'Could not categorize the purchase. Please try again.', variant: 'destructive' });
      }
    });
  };

  const handleProceed = () => {
    if (!result) return;
    
    addTransaction({
      product: result.productName,
      amount: result.price * -1,
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
        amount: result.price * -1,
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
          principal: lockedAmount,
          amount: lockedAmount,
          lockedDate: new Date().toISOString(),
          unlockDate: new Date(Date.now() + settings.lockDuration * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Earning',
          originTransactionId: txId,
          protocol: Math.random() > 0.5 ? 'Aave' : 'Compound',
          apy: 3.5 + Math.random() * 1.5,
          accruedInterest: 0,
        });
      }

      setIsLocking(false);
      setShowMindfulnessTimer(false);
      setPurchaseComplete(true);
    }, 2000);
  };
  
  const resetScanner = () => {
    setProductName('');
    setPrice('');
    setResult(null);
    setPurchaseComplete(false);
    setShowIntervention(false);
    setShowMindfulnessTimer(false);
    setCountdown(60);
  }

  if (isScanning) {
    return (
        <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold gradient-text mb-2">Deep Economic Scan in Progress</h2>
            <p className="text-muted-foreground mb-6">Guardian AI is analyzing your purchase...</p>
            <div className="w-full max-w-md space-y-3">
              {analysisSteps.map((step, index) => (
                <div key={step.id} className={cn("flex items-center gap-4 transition-opacity", currentStep >= index ? 'opacity-100' : 'opacity-40')}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    {currentStep > index ? <CheckCheck className="h-5 w-5 text-primary" /> : <step.icon className="h-5 w-5 text-primary animate-pulse" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{step.text}</p>
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
        </Card>
    );
  }
  
  if (purchaseComplete) {
    const latestTx = transactions[0];
    return (
        <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
            <CheckCheck className="h-16 w-16 text-accent" />
            <h2 className="mt-4 text-2xl font-bold">Purchase Completed</h2>
            {latestTx.status === 'Locked' && latestTx.lockedAmount ? (
                <>
                    <p className="text-muted-foreground">
                        ${Math.abs(latestTx.amount).toFixed(2)} for {latestTx.product}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-400">
                        ${latestTx.lockedAmount.toFixed(2)} locked in vault.
                    </p>
                </>
            ) : (
              <p className="text-muted-foreground">${Math.abs(latestTx.amount).toFixed(2)} for {latestTx.product}</p>
            )}
            <Button onClick={resetScanner} className="mt-6">
                Scan Another Purchase <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Card>
    );
  }

  if (showMindfulnessTimer && result) {
      const overLimitAmount = Math.max(0, (wantsSpendingThisMonth + result.price) - settings.wantsBudget);
      const isButtonDisabled = countdown > 0;
      return (
          <div className="text-center">
              <h2 className="text-2xl font-bold gradient-text mb-2">Mindfulness Pause Activated</h2>
              <p className="text-muted-foreground mb-8">Guardian requires a moment of reflection before high-risk purchases.</p>
              
              <div className="relative mx-auto h-64 w-64">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle className="stroke-current text-muted" strokeWidth="5" cx="50" cy="50" r="45" fill="transparent"></circle>
                      <circle 
                          className="stroke-current text-primary transition-all duration-1000 ease-linear" 
                          strokeWidth="5" 
                          strokeDasharray={2 * Math.PI * 45} 
                          strokeDashoffset={2 * Math.PI * 45 * (1 - countdown/60)}
                          strokeLinecap="round" 
                          cx="50" cy="50" r="45" fill="transparent"
                          transform="rotate(-90 50 50)"
                      ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold font-mono">{countdown}</div>
                      <div className="text-sm text-muted-foreground">seconds remaining</div>
                  </div>
              </div>

              <Card className="glass-card max-w-md mx-auto mt-8 p-4">
                  <p className="text-sm text-muted-foreground">"Taking a moment to breathe prevents 90% of financial regret."</p>
                  <div className="mt-4 text-left space-y-1 text-sm bg-background/50 p-3 rounded-md">
                      <h4 className="font-semibold">Economic Impact Preview</h4>
                      <p>Purchase Amount: <span className="font-mono">${result.price.toFixed(2)}</span></p>
                      <p>Amount to be locked: <span className="font-mono text-amber-400">${overLimitAmount.toFixed(2)}</span></p>
                      <p>Vault Duration: <span className="font-mono">{settings.lockDuration} days</span></p>
                  </div>
              </Card>

              <div className="mt-8 flex gap-4 justify-center">
                   <Button onClick={resetScanner} variant="outline" size="lg">Cancel Purchase</Button>
                   <Button 
                       onClick={handleLockAndPurchase} 
                       size="lg" 
                       disabled={isButtonDisabled || isLocking}
                       className={cn(!isButtonDisabled && "animate-pulse neon-glow")}
                   >
                       {isLocking ? 'Locking...' : (isButtonDisabled ? `Commit in ${countdown}s` : 'Commit to Vault & Purchase')}
                   </Button>
              </div>
          </div>
      )
  }

  if (showIntervention && result) {
    return (
        <div className="p-4 md:p-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                    <h2 className="text-xl font-bold text-amber-400">Guardian Intervention: Better Value Detected</h2>
                </div>
                <p className="text-muted-foreground mt-2">We found alternatives that preserve utility while saving you money.</p>
            </div>

            <Card className="glass-card max-w-md mx-auto mb-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold line-through text-muted-foreground">{result.productName}</p>
                        <p className="text-2xl font-bold text-red-400">${result.price.toFixed(2)}</p>
                    </div>
                    <X className="h-8 w-8 text-red-400" />
                </div>
                 <Badge variant="destructive" className="mt-2">Low Economic Necessity (DNI: 0.38)</Badge>
            </Card>

            <div className="text-center mb-4">
                <p className="font-semibold">Guardian AI found better value alternatives ↓</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.alternatives.map(alt => (
                    <Card key={alt.name} className="glass-card p-4 flex flex-col">
                        <h3 className="font-bold text-lg">{alt.name}</h3>
                        <p className="text-2xl font-bold text-accent">${alt.price.toFixed(2)}</p>
                        <Badge className="bg-accent/20 text-accent border-none w-fit">Save ${(result.price - alt.price).toFixed(2)}</Badge>
                        <div className="flex-grow mt-4">
                            <Label>Utility Match: {alt.utility}%</Label>
                            <Progress value={alt.utility} className="h-2 mt-1" />
                        </div>
                        <Button variant="secondary" className="w-full mt-4">Swap to This</Button>
                    </Card>
                ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                 <Button onClick={resetScanner} variant="outline" size="lg" className="order-2 sm:order-1">
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Cancel Purchase
                 </Button>
                 <Button onClick={() => setShowMindfulnessTimer(true)} size="lg" className="order-1 sm:order-2">
                    Stick with Original
                    <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
            </div>
        </div>
    )
  }

  if (result && !showIntervention) {
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
                    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-lg font-semibold", result.category === 'Want' ? 'border-amber-400 text-amber-400' : 'border-accent text-accent')} >{t(result.category.toLowerCase())}</div>
                    <p className="text-sm text-muted-foreground mt-2 flex gap-2"><BotMessageSquare className="h-4 w-4 shrink-0 mt-0.5" />{result.reasoning}</p>
                </div>
            </div>
            <div className="mt-6 flex gap-4">
                <Button onClick={handleProceed} className="flex-1" size="lg">Proceed with Purchase</Button>
                <Button onClick={resetScanner} variant="outline" className="flex-1" size="lg">Cancel</Button>
            </div>
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
              <Button onClick={handleAnalysis} disabled={isScanning} className="w-full">
                {isScanning ? 'Analyzing...' : 'Analyze Purchase'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
