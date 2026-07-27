import { SettingsModal } from '@/components/blocks/modal';
import type { SettingsModalSectionId } from '@/components/blocks/modal/settings-modal/settings-modal-rail';

type SettingsPreviewPageProps = {
  searchParams?: {
    section?: string;
    admin?: string;
  };
};

export default function SettingsPreviewPage({
  searchParams,
}: SettingsPreviewPageProps) {
  const section = getInitialSection(searchParams?.section ?? null);
  const adminParam = searchParams?.admin;
  const isAdmin =
    adminParam === 'true' ||
    adminParam === '1' ||
    ORGANIZATION_SECTIONS.has(section);

  return (
    <div className='flex min-h-screen items-center justify-center bg-bg-weak-50 p-6'>
      <SettingsModal
        key={`${isAdmin}-${section}`}
        isAdmin={isAdmin}
        defaultSection={section}
        triggerLabel='Reopen settings'
      />
    </div>
  );
}

const SETTINGS_SECTIONS: ReadonlySet<string> = new Set([
  'profile',
  'preferences',
  'notifications',
  'general',
  'members',
  'business-profile',
  'integrations',
  'analysis-templates',
  'billing',
]);

const ORGANIZATION_SECTIONS: ReadonlySet<SettingsModalSectionId> = new Set([
  'general',
  'members',
  'business-profile',
  'integrations',
  'analysis-templates',
  'billing',
]);

function getInitialSection(section: string | null): SettingsModalSectionId {
  if (section && SETTINGS_SECTIONS.has(section)) {
    return section as SettingsModalSectionId;
  }

  return 'profile';
}
