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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Bell, Bot, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { settings, user, setState } = useApp();
  const { toast } = useToast();

  const handleSettingsChange = (key: keyof typeof settings, value: any) => {
    setState(prevState => ({
      ...prevState,
      settings: { ...prevState.settings, [key]: value }
    }));
  };
  
  const handleSave = () => {
    // State is already saved to localStorage via context useEffect
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Customize your SmartGuard experience and fine-tune your financial rules."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Banknote/> Spending Rules</CardTitle>
              <CardDescription>Set your monthly budget limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wants-budget">Monthly 'Wants' Budget</Label>
                <Input
                  id="wants-budget"
                  type="number"
                  value={settings.wantsBudget}
                  onChange={(e) => handleSettingsChange('wantsBudget', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="needs-budget">Monthly 'Needs' Budget</Label>
                <Input
                  id="needs-budget"
                  type="number"
                  value={settings.needsBudget}
                  onChange={(e) => handleSettingsChange('needsBudget', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Alert me when 'Wants' spending reaches: {settings.alertThreshold}%</Label>
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
              <CardTitle className="flex items-center gap-2"><ShieldCheck/> Vault Settings</CardTitle>
              <CardDescription>Configure your impulse protection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label>Default lock duration</Label>
                <Select value={String(settings.lockDuration)} onValueChange={(value) => handleSettingsChange('lockDuration', parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                </Select>
               </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-lock trigger</Label>
                    <p className="text-sm text-muted-foreground">Lock excess amount when 'Wants' spending exceeds limit.</p>
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
                <CardTitle className="flex items-center gap-2"><Bot/> AI Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Categorization Sensitivity</Label>
                   <Select value={settings.categorizationSensitivity} onValueChange={(value) => handleSettingsChange('categorizationSensitivity', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Lenient">Lenient (More Needs)</SelectItem>
                        <SelectItem value="Balanced">Balanced</SelectItem>
                        <SelectItem value="Strict">Strict (More Wants)</SelectItem>
                    </SelectContent>
                </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell/> Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Label>Budget threshold alerts</Label><Switch defaultChecked/></div>
                    <div className="flex items-center justify-between"><Label>Vault unlock notifications</Label><Switch defaultChecked/></div>
                    <div className="flex items-center justify-between"><Label>Weekly spending summaries</Label><Switch/></div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
