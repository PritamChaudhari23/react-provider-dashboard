// components/Header.jsx
import { useAuth } from '../providers/AuthProvider';

export default function Header() {
  const { user } = useAuth();

  return (
    <header>
      <h2>Layered Providers Demo</h2>
      <p>Status: {user ? `Logged in as ${user.name}` : 'Logged out'}</p>
    </header>
  );
}
