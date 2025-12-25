import { Metadata } from 'next';
import { FeaturesManagement } from '@/components/admin/features-management';
import { RoleGuard } from '@/components/auth/role-guard';

export const metadata: Metadata = {
  title: 'Features Management | Admin',
  description: 'Manage features for templates and AI agent',
};

export default function FeaturesPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="container mx-auto py-8">
        <FeaturesManagement />
      </div>
    </RoleGuard>
  );
}
