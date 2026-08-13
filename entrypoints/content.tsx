import { createRoot, type Root } from 'react-dom/client';
import { browser } from 'wxt/browser';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { defineContentScript } from 'wxt/utils/define-content-script';

import {
  analyzeFieldContexts,
  type PageAnalysisSummary,
} from '../src/application/forms/analyze-field-contexts';
import { isGetPageAnalysisMessage } from '../src/application/forms/page-messages';
import { createEmptyStoredProfile } from '../src/domain/profile/create-empty-profile';
import { resolveApplicationProfile } from '../src/domain/variants/resolve-profile';
import { applyFillInstructions } from '../src/infrastructure/dom/fill-controls';
import { extractFieldContexts } from '../src/infrastructure/dom/extract-field-contexts';
import { ChromeProfileRepository } from '../src/infrastructure/storage/chrome-profile-repository';
import { FloatingPanel } from '../src/ui/floating/FloatingPanel';
import { FLOATING_STYLES } from '../src/ui/floating/floating-styles';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  runAt: 'document_idle',
  world: 'ISOLATED',

  async main(ctx) {
    let currentSummary: PageAnalysisSummary | null = null;

    browser.runtime.onMessage.addListener((message: unknown) => {
      if (isGetPageAnalysisMessage(message)) {
        return currentSummary;
      }
      return undefined;
    });

    try {
      const stored = await new ChromeProfileRepository().load();
      const envelope = stored ?? createEmptyStoredProfile();
      const selectedVariant =
        envelope.preferences.defaultVariantId === null
          ? undefined
          : envelope.variants.find(
              (variant) =>
                variant.id === envelope.preferences.defaultVariantId,
            );
      const profile = resolveApplicationProfile(
        envelope.baseProfile,
        selectedVariant,
      );
      const fields = extractFieldContexts(document, location.origin);
      const analysis = analyzeFieldContexts(fields, profile);
      currentSummary = analysis.summary;

      if (analysis.summary.ready + analysis.summary.needsReview === 0) {
        return;
      }

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
          root.render(
            <FloatingPanel
              summary={analysis.summary}
              onFill={() => {
                applyFillInstructions(
                  document,
                  location.origin,
                  analysis.plan.ready,
                );
              }}
            />,
          );
          return root;
        },
        onRemove(root) {
          root?.unmount();
        },
      });

      ui.mount();
    } catch {
      currentSummary = null;
    }
  },
});
