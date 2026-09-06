import { Plus, Trash2 } from 'lucide-react';

import {
  EmptyState,
  IconButton,
  RecordCard,
  RecordHeader,
  TextareaField,
  TextField,
} from '../../ui';
import { WorkspaceSection, WorkspaceSectionHeader } from '../../layout';
import {
  createProfileItemId,
  listValue,
  parseList,
} from './profile-section-helpers';
import type { ProfileSectionProps } from './profile-section-types';

export function DocumentsSection({
  activeSection,
  changeProfile,
  profile,
}: ProfileSectionProps) {
  return (
    <WorkspaceSection hidden={activeSection !== 'documents'}>
      <WorkspaceSectionHeader
        title="Reusable answers"
        description="Answers you reuse in job forms."
        action={
          <IconButton
            size="sm"
            aria-label="Add answer"
            title="Add answer"
            onClick={() =>
              changeProfile((draft) =>
                draft.baseProfile.customAnswers.push({
                  id: createProfileItemId(),
                  question: '',
                  answer: '',
                  canonicalIntent: '',
                  tags: [],
                }),
              )
            }
          >
            <Plus aria-hidden="true" size={15} />
          </IconButton>
        }
      />

      {profile.baseProfile.customAnswers.length === 0 ? (
        <EmptyState>No reusable answers yet.</EmptyState>
      ) : (
        <div className="grid gap-0">
          {profile.baseProfile.customAnswers.map((answer, index) => (
            <RecordCard
              key={answer.id}
              action={
                <IconButton
                  size="xs"
                  tone="danger"
                  aria-label={`Remove answer ${index + 1}`}
                  title={`Remove answer ${index + 1}`}
                  onClick={() =>
                    changeProfile((draft) =>
                      draft.baseProfile.customAnswers.splice(index, 1),
                    )
                  }
                >
                  <Trash2 aria-hidden="true" size={13} />
                </IconButton>
              }
            >
              <RecordHeader
                title={answer.question || `Answer ${index + 1}`}
                context={
                  answer.tags.length > 0 ? answer.tags.join(' · ') : undefined
                }
              />
              <TextField
                label="Question"
                value={answer.question}
                onChange={(event) =>
                  changeProfile((draft) => {
                    const item = draft.baseProfile.customAnswers[index];
                    if (item !== undefined) item.question = event.target.value;
                  })
                }
              />
              <TextareaField
                label="Answer"
                value={answer.answer}
                onChange={(event) =>
                  changeProfile((draft) => {
                    const item = draft.baseProfile.customAnswers[index];
                    if (item !== undefined) item.answer = event.target.value;
                  })
                }
              />
              <TextField
                label="Tags, comma separated"
                placeholder="visa, sponsorship, notice period"
                value={listValue(answer.tags)}
                onChange={(event) =>
                  changeProfile((draft) => {
                    const item = draft.baseProfile.customAnswers[index];
                    if (item !== undefined) {
                      item.tags = parseList(event.target.value);
                    }
                  })
                }
              />
            </RecordCard>
          ))}
        </div>
      )}
    </WorkspaceSection>
  );
}
