
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan', label: 'Scan Purchase', icon: ScanLine },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/analytics', label: 'Analytics', icon: AreaChart },
  { href: '/vault', label: 'Vault', icon: ShieldCheck },
];

const secondaryNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/legal', label: 'Legal', icon: Gavel },
]

export function NavLinks({ isCollapsed, isMobile = false }: { isCollapsed: boolean, isMobile?: boolean }) {
  const pathname = usePathname();

  const renderLink = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
    const LinkContent = (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          isActive && 'bg-muted text-primary',
          isCollapsed && 'justify-center'
        )}
      >
        <item.icon className="h-5 w-5" />
        <span className={cn('truncate', (isCollapsed && !isMobile) && 'sr-only')}>{item.label}</span>
      </Link>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>{item.label}</TooltipContent>
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
