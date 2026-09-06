import { Plus, Trash2 } from 'lucide-react';

import {
  EmptyState,
  FieldGrid,
  IconButton,
  RecordCard,
  TextField,
} from '../../ui';
import { WorkspaceSubsection } from '../../layout';
import { createProfileItemId } from './profile-section-helpers';
import type { ProfileSectionProps } from './profile-section-types';

type LanguagesSectionProps = Pick<
  ProfileSectionProps,
  'changeProfile' | 'profile'
>;

export function LanguagesSection({
  changeProfile,
  profile,
}: LanguagesSectionProps) {
  return (
    <WorkspaceSubsection
      title="Languages"
      help="Languages and proficiency used when a form asks for them."
      action={
        <IconButton
          size="sm"
          aria-label="Add language"
          title="Add language"
          onClick={() =>
            changeProfile((draft) =>
              draft.baseProfile.professional.languages.push({
                id: createProfileItemId(),
                name: '',
                proficiency: '',
              }),
            )
          }
        >
          <Plus aria-hidden="true" size={15} />
        </IconButton>
      }
    >
      {profile.baseProfile.professional.languages.length === 0 ? (
        <EmptyState>No languages yet.</EmptyState>
      ) : (
        <div className="grid gap-0">
          {profile.baseProfile.professional.languages.map((language, index) => (
            <RecordCard
              className="pr-8"
              key={language.id}
              action={
                <IconButton
                  size="xs"
                  tone="danger"
                  aria-label={`Remove language ${index + 1}`}
                  title={`Remove language ${index + 1}`}
                  onClick={() =>
                    changeProfile((draft) =>
                      draft.baseProfile.professional.languages.splice(index, 1),
                    )
                  }
                >
                  <Trash2 aria-hidden="true" size={13} />
                </IconButton>
              }
            >
              <FieldGrid>
                <TextField
                  label="Language"
                  placeholder="English"
                  value={language.name}
                  onChange={(event) =>
                    changeProfile((draft) => {
                      const item =
                        draft.baseProfile.professional.languages[index];
                      if (item !== undefined) item.name = event.target.value;
                    })
                  }
                />
                <TextField
                  label="Proficiency"
                  placeholder="Professional working"
                  value={language.proficiency}
                  onChange={(event) =>
                    changeProfile((draft) => {
                      const item =
                        draft.baseProfile.professional.languages[index];
                      if (item !== undefined)
                        item.proficiency = event.target.value;
                    })
                  }
                />
              </FieldGrid>
            </RecordCard>
          ))}
        </div>
      )}
    </WorkspaceSubsection>
  );
}
