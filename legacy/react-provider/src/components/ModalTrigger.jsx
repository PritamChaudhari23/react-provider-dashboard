// components/ModalTrigger.jsx
import { useModal } from '../providers/ModalProvider';

export default function ModalTrigger() {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal('Hello from ModalProvider')}>
      Open Modal Manually
    </button>
  );
}
