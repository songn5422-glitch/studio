import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-xl font-bold text-foreground', className)}>
      <Shield className="h-6 w-6 text-primary" />
      <span>SmartGuard</span>
    </div>
  );
}
