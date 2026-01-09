import { PageHeader } from "@/components/dashboard/page-header";
import { PurchaseScanner } from "@/components/scan/purchase-scanner";

export default function ScanPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Scan Your Next Purchase"
        description="Let our AI analyze your purchase to help you stay on budget."
      />
      <div className="mx-auto max-w-2xl">
        <PurchaseScanner />
      </div>
    </div>
  );
}
