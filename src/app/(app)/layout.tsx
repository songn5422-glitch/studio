'use client';

import { useState, useEffect } from 'react';
import { NavLinks } from '@/components/layout/nav-links';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useApp } from '@/hooks/use-app';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user.walletAddress) {
      router.push('/onboarding');
    } else if (user.tier === 'premium' && !user.economicProfile.contractSignedAt) {
      router.push('/onboarding/economic-profile');
    }
  }, [user.walletAddress, user.tier, user.economicProfile.contractSignedAt, router]);


  if (!user.walletAddress || (user.tier === 'premium' && !user.economicProfile.contractSignedAt)) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <aside
          className={cn(
            'hidden border-r bg-background/80 md:flex md:flex-col transition-[width] duration-300',
            isCollapsed ? 'w-20' : 'w-64'
          )}
        >
          <div
            className={cn(
              'flex h-16 items-center px-6',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div className={cn(isCollapsed && 'hidden')}>
              <Logo />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
              />
            </Button>
          </div>
          <div className="flex-1 p-2">
            <NavLinks isCollapsed={isCollapsed} />
          </div>
        </aside>
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
