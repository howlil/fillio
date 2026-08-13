import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';

import type { PageAnalysisSummary } from '../../src/application/forms/analyze-field-contexts';
import {
  GET_PAGE_ANALYSIS,
  isPageAnalysisSummary,
} from '../../src/application/forms/page-messages';
import { ChromeProfileRepository } from '../../src/infrastructure/storage/chrome-profile-repository';
import { PopupPage } from '../../src/ui/popup/PopupPage';

const repository = new ChromeProfileRepository();

export default function App() {
  const [pageSummary, setPageSummary] = useState<PageAnalysisSummary | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    void browser.tabs
      .query({ active: true, currentWindow: true })
      .then(async ([tab]) => {
        if (tab?.id === undefined) return null;
        const response: unknown = await browser.tabs.sendMessage(tab.id, {
          type: GET_PAGE_ANALYSIS,
        });
        return isPageAnalysisSummary(response) ? response : null;
      })
      .then((summary) => {
        if (active) setPageSummary(summary);
      })
      .catch(() => {
        if (active) setPageSummary(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PopupPage
      repository={repository}
      openOptions={() => browser.runtime.openOptionsPage()}
      pageSummary={pageSummary}
    />
  );
}
