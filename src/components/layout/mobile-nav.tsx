'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Logo } from '../icons/logo';
import { NavLinks } from './nav-links';
import { Separator } from '../ui/separator';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="p-4">
            <Logo />
        </div>
        <Separator />
        <div className="flex-1 p-2">
          <NavLinks isCollapsed={false} isMobile={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
