
"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useApp } from "@/hooks/use-app";
import { Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, CheckCircle, XCircle, Clock, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

export default function TransactionsPage() {
  const { transactions, user } = useApp();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const isPremium = user.tier === 'premium';

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch =
        filter === "" ||
        tx.product.toLowerCase().includes(filter.toLowerCase());
      const categoryMatch =
        categoryFilter === "All" || tx.category === categoryFilter;
      const statusMatch = statusFilter === "All" || tx.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [transactions, filter, categoryFilter, statusFilter]);

  const getStatusIcon = (status: Transaction["status"]) => {
    switch(status) {
      case "Approved": return <CheckCircle className="h-5 w-5 text-accent" />;
      case "Locked": return <Clock className="h-5 w-5 text-amber-400" />;
      case "Refunded": return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  }

  const getCategoryDisplay = (category: string) => {
    if (!isPremium && category !== 'Need' && category !== 'Want') {
        const categoryMap: {[key: string]: string} = {
            'food-dining': 'Food & Dining',
            'transportation': 'Transportation',
            'shopping': 'Shopping',
            'bills-utilities': 'Bills & Utilities',
            'entertainment': 'Entertainment',
            'subscriptions': 'Subscriptions',
            'income': 'Income',
            'clothing': 'Clothing',
        };
        return categoryMap[category] || category;
    }
    return t(category.toLowerCase()) || category;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('transactions_title')}
        description={t('transactions_desc')}
      />
      <div className="glass-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder={t('filter_by_product')}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t('all_categories')}</SelectItem>
              {isPremium ? (
                <>
                  <SelectItem value="Need">{t('needs')}</SelectItem>
                  <SelectItem value="Want">{t('wants')}</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="food-dining">Food & Dining</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="bills-utilities">Bills & Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t('all_statuses')}</SelectItem>
              <SelectItem value="Approved">{t('approved')}</SelectItem>
              <SelectItem value="Posted">{t('posted')}</SelectItem>
              <SelectItem value="Locked">{t('locked')}</SelectItem>
              <SelectItem value="Refunded">{t('refunded')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            {t('download_statement')}
          </Button>
        </div>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('product')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('amount')}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.product}</TableCell>
                  <TableCell>{format(new Date(tx.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.category === "Need" ? "secondary" : "outline"}
                      className={cn(
                        tx.category === 'Want' && 'border-amber-400 text-amber-400',
                        !isPremium && 'border-sky-400 text-sky-400'
                        )}
                    >
                      {getCategoryDisplay(tx.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <span>{t(tx.status.toLowerCase())}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("text-right font-mono", tx.amount > 0 ? "text-accent" : "text-foreground")}>
                    {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedTx(tx)}>
                          {t('view_details')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTx} onOpenChange={(isOpen) => !isOpen && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedTx && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTx.product}</DialogTitle>
                <DialogDescription>
                  Transaction ID: {selectedTx.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 {getPlaceholderImage(selectedTx.productImage)?.imageUrl && (
                    <div className="relative aspect-video w-full">
                        <Image src={getPlaceholderImage(selectedTx.productImage)!.imageUrl} alt={selectedTx.product} fill className="rounded-md object-cover"/>
                    </div>
                 )}
                <div className="text-sm"><strong>{t('amount')}:</strong> <span className={cn("font-mono", selectedTx.amount > 0 ? "text-accent" : "text-foreground")}>{selectedTx.amount < 0 ? '-' : ''}${Math.abs(selectedTx.amount).toFixed(2)}</span></div>
                <div className="text-sm"><strong>{t('date')}:</strong> {format(new Date(selectedTx.date), "PPP p")}</div>
                <div className="text-sm"><strong>{t('category')}:</strong> {getCategoryDisplay(selectedTx.category)}</div>
                <div className="text-sm"><strong>{t('status')}:</strong> {t(selectedTx.status.toLowerCase())}</div>
                
                {selectedTx.aiReasoning && (
                  <p className="rounded-md border bg-muted p-3 text-sm italic text-muted-foreground">
                      <strong>AI Reasoning:</strong> {selectedTx.aiReasoning}
                  </p>
                )}

                {selectedTx.oracleVerified && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verified by Oracle Network</span>
                  </div>
                )}

                {selectedTx.lockedAmount && (
                    <div className="text-sm text-amber-400"><strong>Locked Amount:</strong> ${selectedTx.lockedAmount.toFixed(2)}</div>
                )}
                {selectedTx.vaultUnlockDate && (
                    <div className="text-sm text-amber-400"><strong>Unlocks On:</strong> {format(new Date(selectedTx.vaultUnlockDate), "PPP")}</div>
                )}
                {selectedTx.blockchainTxHash && (
                    <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <strong>Tx Hash:</strong> 
                        </div>
                        <a href="#" className="ml-2 text-primary hover:underline truncate block">{selectedTx.blockchainTxHash}</a>
                    </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

