import { browser } from 'wxt/browser';

import { ChromeProfileRepository } from '../../src/infrastructure/storage/chrome-profile-repository';
import { PopupPage } from '../../src/ui/popup/PopupPage';

const repository = new ChromeProfileRepository();

export default function App() {
  return (
    <PopupPage
      repository={repository}
      openOptions={() => browser.runtime.openOptionsPage()}
    />
  );
}
