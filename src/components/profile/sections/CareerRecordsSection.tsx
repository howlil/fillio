import { CertificationsSection } from './CertificationsSection';
import { LanguagesSection } from './LanguagesSection';
import { ProjectsSection } from './ProjectsSection';
import type { ProfileSectionProps } from './profile-section-types';

export function CareerRecordsSection({
  activeSection,
  changeProfile,
  profile,
}: ProfileSectionProps) {
  if (activeSection !== 'experience') return null;

  return (
    <div className="grid gap-3">
      <LanguagesSection changeProfile={changeProfile} profile={profile} />
      <CertificationsSection changeProfile={changeProfile} profile={profile} />
      <ProjectsSection changeProfile={changeProfile} profile={profile} />
    </div>
  );
}
