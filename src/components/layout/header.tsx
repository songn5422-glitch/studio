import { Logo } from '../icons/logo';
import { ConnectWalletButton } from './connect-wallet-button';
import { MobileNav } from './mobile-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="hidden md:block">
            <Logo />
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        <ConnectWalletButton />
      </div>
    </header>
  );
}
