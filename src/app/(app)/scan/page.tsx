'use client';
import { PageHeader } from "@/components/dashboard/page-header";
import { PurchaseScanner } from "@/components/scan/purchase-scanner";
import { useLanguage } from "@/context/language-context";

export default function ScanPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('scan_title')}
        description={t('scan_desc')}
      />
      <div className="mx-auto max-w-2xl">
        <PurchaseScanner />
      </div>
    </div>
  );
}
