import { Plus, Trash2 } from 'lucide-react';

import {
  EmptyState,
  FieldGrid,
  IconButton,
  TextField,
} from '../../ui';
import { WorkspaceSubsection } from '../../layout';
import {
  CollapsibleRecord,
  createProfileItemId,
  dateInputProps,
} from './profile-section-helpers';
import type { ProfileSectionProps } from './profile-section-types';

type CertificationsSectionProps = Pick<
  ProfileSectionProps,
  'changeProfile' | 'profile'
>;

export function CertificationsSection({
  changeProfile,
  profile,
}: CertificationsSectionProps) {
  const certifications = profile.baseProfile.professional.certifications;

  return (
    <WorkspaceSubsection
      title="Certifications"
      help="Credentials you may need to provide in application forms."
      action={
        <IconButton
          size="sm"
          aria-label="Add certification"
          title="Add certification"
          onClick={() =>
            changeProfile((draft) =>
              draft.baseProfile.professional.certifications.push({
                id: createProfileItemId(),
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                url: '',
              }),
            )
          }
        >
          <Plus aria-hidden="true" size={15} />
        </IconButton>
      }
    >
      {certifications.length === 0 ? (
        <EmptyState>No certifications yet.</EmptyState>
      ) : (
        <div className="grid gap-0">
          {certifications.map((certification, index) => (
            <CollapsibleRecord
              key={certification.id}
              initialOpen={
                certification.name.trim() === '' && index === certifications.length - 1
              }
            >
              <summary className="record-summary pr-8">
                <span>{certification.name || `Certification ${index + 1}`}</span>
                <span className="record-summary-meta">
                  {certification.issuer || 'Credential'}
                </span>
              </summary>
              <IconButton
                className="absolute right-0 top-1 z-10"
                size="xs"
                tone="danger"
                aria-label={`Remove certification ${index + 1}`}
                title={`Remove certification ${index + 1}`}
                onClick={() =>
                  changeProfile((draft) =>
                    draft.baseProfile.professional.certifications.splice(index, 1),
                  )
                }
              >
                <Trash2 aria-hidden="true" size={13} />
              </IconButton>
              <div className="grid gap-2 border-t border-app-border pt-2">
                <FieldGrid>
                  <TextField
                    label="Certification"
                    value={certification.name}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined) item.name = event.target.value;
                      })
                    }
                  />
                  <TextField
                    label="Issuer"
                    value={certification.issuer}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined)
                          item.issuer = event.target.value;
                      })
                    }
                  />
                  <TextField
                    label="Credential ID"
                    value={certification.credentialId}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined)
                          item.credentialId = event.target.value;
                      })
                    }
                  />
                  <TextField
                    label="Issue date"
                    {...dateInputProps(certification.issueDate)}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined)
                          item.issueDate = event.target.value;
                      })
                    }
                  />
                  <TextField
                    label="Expiry date"
                    {...dateInputProps(certification.expiryDate)}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined)
                          item.expiryDate = event.target.value;
                      })
                    }
                  />
                  <TextField
                    label="Credential URL"
                    value={certification.url}
                    onChange={(event) =>
                      changeProfile((draft) => {
                        const item =
                          draft.baseProfile.professional.certifications[index];
                        if (item !== undefined) item.url = event.target.value;
                      })
                    }
                  />
                </FieldGrid>
              </div>
            </CollapsibleRecord>
          ))}
        </div>
      )}
    </WorkspaceSubsection>
  );
}
