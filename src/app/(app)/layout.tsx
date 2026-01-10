'use client';

import { useState } from 'react';
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

  if (!user.onboardingCompleted) {
    // This should be handled by the context, but as a fallback
    router.push('/onboarding');
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
