// components/LoginPanel.jsx
import { useAuth } from '../providers/AuthProvider';

export default function LoginPanel() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login('Pritam')}>Login</button>
      )}
    </div>
  );
}
