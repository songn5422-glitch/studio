'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, TestTube } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';

export function ConnectWalletButton() {
  const { user, connectWallet, disconnectWallet } = useApp();

  if (!user.walletAddress) {
    return (
      <Button onClick={connectWallet} className="neon-glow">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  const truncatedAddress = `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`;

  return (
    <div className="flex items-center gap-4">
       <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5">
          <TestTube className="h-3 w-3 text-amber-400" />
          Polygon Mumbai
        </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.walletAddress}`} alt="Wallet Avatar" />
              <AvatarFallback>0x</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-end sm:flex">
              <span className="font-semibold">{truncatedAddress}</span>
              <span className="text-xs text-muted-foreground">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Wallet</p>
              <p className="text-xs leading-none text-muted-foreground">{truncatedAddress}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
