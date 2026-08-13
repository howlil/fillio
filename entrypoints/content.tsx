import { createRoot, type Root } from 'react-dom/client';
import { browser } from 'wxt/browser';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { defineContentScript } from 'wxt/utils/define-content-script';

import {
  analyzeFieldContexts,
  type PageAnalysis,
  type PageAnalysisSummary,
} from '../src/application/forms/analyze-field-contexts';
import { isGetPageAnalysisMessage } from '../src/application/forms/page-messages';
import type { CorrectionTarget } from '../src/domain/corrections/correction-schema';
import type { FieldContext } from '../src/domain/forms/field-context';
import { createFieldSetFingerprint } from '../src/domain/forms/field-set-fingerprint';
import { createEmptyStoredProfile } from '../src/domain/profile/create-empty-profile';
import { resolveApplicationProfile } from '../src/domain/variants/resolve-profile';
import { applyFillInstructions } from '../src/infrastructure/dom/fill-controls';
import { extractFieldContexts } from '../src/infrastructure/dom/extract-field-contexts';
import { observeRelevantFormMutations } from '../src/infrastructure/dom/observe-form-mutations';
import { ChromeCorrectionRepository } from '../src/infrastructure/storage/chrome-correction-repository';
import { ChromeProfileRepository } from '../src/infrastructure/storage/chrome-profile-repository';
import { FloatingPanel } from '../src/ui/floating/FloatingPanel';
import { FLOATING_STYLES } from '../src/ui/floating/floating-styles';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  runAt: 'document_idle',
  world: 'ISOLATED',

  async main(ctx) {
    let currentSummary: PageAnalysisSummary | null = null;
    let currentAnalysis: PageAnalysis | null = null;
    let currentFieldSet = '';
    let reactRoot: Root | null = null;

    const messageListener = (message: unknown) => {
      if (isGetPageAnalysisMessage(message)) {
        return Promise.resolve(currentSummary);
      }
      return undefined;
    };
    browser.runtime.onMessage.addListener(messageListener);
    ctx.onInvalidated(() => {
      browser.runtime.onMessage.removeListener(messageListener);
    });

    try {
      const stored = await new ChromeProfileRepository().load();
      const envelope = stored ?? createEmptyStoredProfile();
      const selectedVariant =
        envelope.preferences.defaultVariantId === null
          ? undefined
          : envelope.variants.find(
              (variant) => variant.id === envelope.preferences.defaultVariantId,
            );
      const profile = resolveApplicationProfile(
        envelope.baseProfile,
        selectedVariant,
      );
      const correctionRepository = new ChromeCorrectionRepository();
      let corrections = await correctionRepository.listForOrigin(
        location.origin,
      );

      const renderPanel = () => {
        if (reactRoot === null) return;
        if (
          currentAnalysis === null ||
          currentAnalysis.summary.ready +
            currentAnalysis.summary.needsReview ===
            0
        ) {
          reactRoot.render(null);
          return;
        }

        reactRoot.render(
          <FloatingPanel
            summary={currentAnalysis.summary}
            reviewItems={currentAnalysis.plan.needsReview}
            onFill={() => {
              if (currentAnalysis === null) return;
              applyFillInstructions(
                document,
                location.origin,
                currentAnalysis.plan.ready,
              );
            }}
            onRemember={(context, target) => {
              void rememberCorrection(context, target);
            }}
          />,
        );
      };

      const analyzePage = (force = false) => {
        const fields = extractFieldContexts(document, location.origin);
        const nextFieldSet = createFieldSetFingerprint(fields);
        if (!force && nextFieldSet === currentFieldSet) return;

        currentFieldSet = nextFieldSet;
        currentAnalysis = analyzeFieldContexts(fields, profile, corrections);
        currentSummary = currentAnalysis.summary;
        renderPanel();
      };

      const rememberCorrection = async (
        context: FieldContext,
        target: CorrectionTarget,
      ) => {
        await correctionRepository.upsert({
          origin: context.origin,
          formFingerprint: context.formFingerprint,
          fieldFingerprint: context.fieldFingerprint,
          target,
          updatedAt: new Date().toISOString(),
        });
        corrections = await correctionRepository.listForOrigin(location.origin);
        analyzePage(true);
      };

      analyzePage(true);

      const ui = await createShadowRootUi<Root>(ctx, {
        name: 'fillio-form-assistant',
        position: 'inline',
        anchor: 'body',
        css: FLOATING_STYLES,
        isolateEvents: true,
        onMount(container, _shadow, shadowHost) {
          shadowHost.style.position = 'fixed';
          shadowHost.style.right = '20px';
          shadowHost.style.bottom = '20px';
          shadowHost.style.zIndex = '2147483647';

          const mountPoint = document.createElement('div');
          container.append(mountPoint);
          const root = createRoot(mountPoint);
          reactRoot = root;
          renderPanel();
          return root;
        },
        onRemove(root) {
          reactRoot = null;
          root?.unmount();
        },
      });

      ui.mount();

      const watcher = observeRelevantFormMutations(document.body, () => {
        analyzePage();
      });
      ctx.onInvalidated(() => {
        watcher.disconnect();
      });
    } catch {
      currentSummary = null;
      currentAnalysis = null;
    }
  },
});
