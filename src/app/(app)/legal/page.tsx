'use client';

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function LegalPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('legal_title')}
        description={t('legal_desc')}
      />
      <Card className="glass-card">
        <CardContent className="prose prose-invert prose-lg max-w-none p-6 md:p-8">
          <h2>{t('competition_prototype')}</h2>
          <p>
            {t('competition_desc')}
          </p>
          <h3>{t('not_financial_service')}</h3>
          <p>
            {t('not_financial_service_desc')}
          </p>
          <h3>{t('non_custodial_security')}</h3>
          <p>
            {t('non_custodial_security_desc')}
          </p>
          <h3>{t('future_requirements')}</h3>
          <p>
            {t('future_requirements_desc')}
          </p>
          <ul>
            <li>{t('licensing')}</li>
            <li>{t('kyc_aml')}</li>
            <li>{t('audits')}</li>
            <li>{t('certifications')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
