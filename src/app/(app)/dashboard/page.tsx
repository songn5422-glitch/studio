'use client';

import { PageHeader } from '@/components/dashboard/page-header';
import { AccountOverview } from '@/components/dashboard/account-overview';
import { ProtectionStatus } from '@/components/dashboard/protection-status';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useLanguage } from '@/context/language-context';

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('dashboard')}
        description={t('dashboard_description')}
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
