import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Legal & Compliance"
        description="Important information about this prototype."
      />
      <Card className="glass-card">
        <CardContent className="prose prose-invert prose-lg max-w-none p-6 md:p-8">
          <h2>SmartGuard MVP - Competition Prototype</h2>
          <p>
            This is a demonstration product developed for a blockchain competition. It is intended for educational and evaluation purposes only.
          </p>
          <h3>Not a Financial Service</h3>
          <p>
            SmartGuard is not a licensed financial service. No real money is being managed, and all transactions are simulated on the Polygon Mumbai testnet using valueless test tokens. Do not use real financial information or connect mainnet wallets.
          </p>
          <h3>Non-Custodial & Security</h3>
          <p>
            This application demonstrates a non-custodial architecture. In a real-world scenario, users would maintain full custody of their funds via their own private wallets. The smart contracts used in this prototype have not been professionally audited.
          </p>
          <h3>Future Production Requirements</h3>
          <p>
            A production version of SmartGuard would require, but is not limited to:
          </p>
          <ul>
            <li>Appropriate financial services licensing in all operating jurisdictions.</li>
            <li>Full Know Your Customer (KYC) and Anti-Money Laundering (AML) compliance.</li>
            <li>Third-party, professional smart contract audits.</li>
            <li>Data privacy and security certifications (e.g., SOC 2).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
