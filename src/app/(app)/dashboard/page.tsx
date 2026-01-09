import { PageHeader } from '@/components/dashboard/page-header';
import { AccountOverview } from '@/components/dashboard/account-overview';
import { ProtectionStatus } from '@/components/dashboard/protection-status';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your financial command center. Monitor your balance and spending at a glance."
      />
      <AccountOverview />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProtectionStatus />
        <QuickActions />
      </div>
      <RecentActivity />
    </div>
  );
}
