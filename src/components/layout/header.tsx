import { Logo } from '../icons/logo';
import { ConnectWalletButton } from './connect-wallet-button';
import { MobileNav } from './mobile-nav';
import { useApp } from '@/hooks/use-app';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const { user } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="hidden md:block">
            <Logo />
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        {user.tier === 'free' && user.onboardingCompleted && (
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 hidden sm:flex">
            <Star className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
        <LanguageSwitcher />
        <ConnectWalletButton />
      </div>
    </header>
  );
}
