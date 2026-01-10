
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  ArrowRightLeft,
  AreaChart,
  ShieldCheck,
  Settings,
  Gavel,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApp } from '@/hooks/use-app';
import { Badge } from '../ui/badge';
import { useLanguage } from '@/context/language-context';

export function NavLinks({ isCollapsed, isMobile = false }: { isCollapsed: boolean, isMobile?: boolean }) {
  const pathname = usePathname();
  const { user } = useApp();
  const { t } = useLanguage();
  const isPremium = user.tier === 'premium';

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, premium: false },
    { href: '/scan', label: t('scan_purchase'), icon: ScanLine, premium: true },
    { href: '/transactions', label: t('transactions'), icon: ArrowRightLeft, premium: false },
    { href: '/analytics', label: t('analytics'), icon: AreaChart, premium: false },
    { href: '/vault', label: t('vault'), icon: ShieldCheck, premium: true },
  ];
  
  const secondaryNavItems = [
      { href: '/settings', label: t('settings'), icon: Settings, premium: false },
      { href: '/legal', label: t('legal'), icon: Gavel, premium: false },
  ]

  const renderLink = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
    const isLocked = item.premium && !isPremium;

    const LinkContent = (
      <Link
        href={isLocked ? '#' : item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all',
          isLocked ? 'cursor-not-allowed opacity-50' : 'hover:text-primary',
          isActive && !isLocked && 'bg-muted text-primary',
          isCollapsed && 'justify-center'
        )}
        onClick={(e) => isLocked && e.preventDefault()}
      >
        <item.icon className="h-5 w-5" />
        <span className={cn('truncate', (isCollapsed && !isMobile) && 'sr-only')}>{item.label}</span>
        {isLocked && !isCollapsed && <Lock className="ml-auto h-4 w-4" />}
      </Link>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            {item.label}
            {isLocked && <Badge variant="destructive" className="ml-2">Premium</Badge>}
          </TooltipContent>
        </Tooltip>
      );
    }
    return <div key={item.href}>{LinkContent}</div>;
  }

  return (
    <div className="flex h-full flex-col justify-between">
        <nav className="grid items-start gap-1">
            {navItems.map(renderLink)}
        </nav>
        <nav className="grid items-start gap-1">
            {secondaryNavItems.map(renderLink)}
        </nav>
    </div>
  );
}
