import { ProfilePage } from '../../src/ui/profile/ProfilePage';
import { ChromeProfileRepository } from '../../src/infrastructure/storage/chrome-profile-repository';

const repository = new ChromeProfileRepository();

export default function App() {
  return <ProfilePage repository={repository} />;
}
