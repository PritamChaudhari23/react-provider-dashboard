// components/StatusBar.jsx
import { useUI } from '../providers/UIProvider';

export default function StatusBar() {
  const { loading, error } = useUI();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return null;
}
