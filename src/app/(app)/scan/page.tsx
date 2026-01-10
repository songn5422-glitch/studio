'use client';
import { PageHeader } from "@/components/dashboard/page-header";
import { PurchaseScanner } from "@/components/scan/purchase-scanner";
import { useLanguage } from "@/context/language-context";
import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";

export default function ScanPage() {
  const { t } = useLanguage();
  const { user, setTier } = useApp();
  const isPremium = user.tier === 'premium';

  if (!isPremium) {
    return (
       <div className="space-y-8">
        <PageHeader
          title={t('scan_purchase')}
          description={t('scan_desc')}
        />
        <Card className="glass-card text-center max-w-2xl mx-auto">
            <CardHeader>
                <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-primary"/>
                </div>
                <CardTitle className="pt-4">This is a Premium Feature</CardTitle>
                <CardDescription>
                    Upgrade to SmartGuard Premium to unlock AI-powered purchase scanning, price verification, and automated savings protection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                    <Star className="mr-2 h-4 w-4" />
                    {t('upgrade_to_premium')}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Unlock all premium features and take control of your spending.</p>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('scan_title')}
        description={t('scan_desc')}
      />
      <div className="mx-auto max-w-2xl">
        <PurchaseScanner />
      </div>
    </div>
  );
}
