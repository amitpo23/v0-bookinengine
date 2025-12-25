import { Metadata } from 'next';
import { EmailSettings } from '@/components/admin/email-settings';
import { RoleGuard } from '@/components/auth/role-guard';

export const metadata: Metadata = {
  title: 'Email Settings | Admin',
  description: 'Manage email notifications and confirmations',
};

export default function EmailSettingsPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground mt-2">
            הגדרות שליחת אימיילים אוטומטית לאחר הזמנות
          </p>
        </div>
        <EmailSettings />
      </div>
    </RoleGuard>
  );
}
