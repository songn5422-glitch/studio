"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useApp } from "@/hooks/use-app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Bell, Bot, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
  const { settings, user, setState } = useApp();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSettingsChange = (key: keyof typeof settings, value: any) => {
    setState(prevState => ({
      ...prevState,
      settings: { ...prevState.settings, [key]: value }
    }));
  };
  
  const handleSave = () => {
    // State is already saved to localStorage via context useEffect
    toast({ title: t('settings_title') + " Saved", description: "Your preferences have been updated." });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('settings_title')}
        description={t('settings_desc')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Banknote/> {t('spending_rules')}</CardTitle>
              <CardDescription>{t('spending_rules_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wants-budget">{t('monthly_wants_budget')}</Label>
                <Input
                  id="wants-budget"
                  type="number"
                  value={settings.wantsBudget}
                  onChange={(e) => handleSettingsChange('wantsBudget', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="needs-budget">{t('monthly_needs_budget')}</Label>
                <Input
                  id="needs-budget"
                  type="number"
                  value={settings.needsBudget}
                  onChange={(e) => handleSettingsChange('needsBudget', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('alert_me_at')} {settings.alertThreshold}%</Label>
                <Slider
                  value={[settings.alertThreshold]}
                  onValueChange={(value) => handleSettingsChange('alertThreshold', value[0])}
                  max={100}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck/> {t('vault_settings')}</CardTitle>
              <CardDescription>{t('vault_settings_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label>{t('default_lock_duration')}</Label>
                <Select value={String(settings.lockDuration)} onValueChange={(value) => handleSettingsChange('lockDuration', parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">7 {t('days')}</SelectItem>
                        <SelectItem value="14">14 {t('days')}</SelectItem>
                        <SelectItem value="30">30 {t('days')}</SelectItem>
                        <SelectItem value="60">60 {t('days')}</SelectItem>
                        <SelectItem value="90">90 {t('days')}</SelectItem>
                    </SelectContent>
                </Select>
               </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('auto_lock_trigger')}</Label>
                    <p className="text-sm text-muted-foreground">{t('auto_lock_desc')}</p>
                  </div>
                  <Switch
                    checked={settings.autoLockEnabled}
                    onCheckedChange={(checked) => handleSettingsChange('autoLockEnabled', checked)}
                  />
                </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot/> {t('ai_preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('categorization_sensitivity')}</Label>
                   <Select value={settings.categorizationSensitivity} onValueChange={(value) => handleSettingsChange('categorizationSensitivity', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Lenient">{t('lenient')}</SelectItem>
                        <SelectItem value="Balanced">{t('balanced')}</SelectItem>
                        <SelectItem value="Strict">{t('strict')}</SelectItem>
                    </SelectContent>
                </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell/> {t('notifications')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Label>{t('budget_threshold_alerts')}</Label><Switch defaultChecked/></div>
                    <div className="flex items-center justify-between"><Label>{t('vault_unlock_notifications')}</Label><Switch defaultChecked/></div>
                    <div className="flex items-center justify-between"><Label>{t('weekly_spending_summaries')}</Label><Switch/></div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">{t('save_changes')}</Button>
        </div>
      </div>
    </div>
  );
}
