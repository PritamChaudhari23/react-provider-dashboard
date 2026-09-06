// components/SecretAction.jsx
import { useData } from '../providers/DataProvider';
import { useModal } from '../providers/ModalProvider';

export default function SecretAction() {
  const { fetchSecretData } = useData();
  const { openModal } = useModal();

  const handleClick = async () => {
    const result = await fetchSecretData();
    if (result) openModal(result);
  };

  return <button onClick={handleClick}>Get Secret Data</button>;
}
