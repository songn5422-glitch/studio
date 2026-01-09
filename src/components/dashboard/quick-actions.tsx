"use client";

import { Button } from '@/components/ui/button';
import { ScanLine, ShieldCheck, Cog } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Button asChild size="lg" className="h-20 text-lg">
        <Link href="/scan">
          <ScanLine className="mr-3 h-6 w-6" />
          Scan New Purchase
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary" className="h-20 text-lg">
        <Link href="/vault">
          <ShieldCheck className="mr-3 h-6 w-6" />
          View Savings Vault
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary" className="h-20 text-lg">
        <Link href="/settings">
          <Cog className="mr-3 h-6 w-6" />
          Set Spending Rules
        </Link>
      </Button>
    </div>
  );
}
