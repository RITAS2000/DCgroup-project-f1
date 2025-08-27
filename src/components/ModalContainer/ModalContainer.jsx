import { useSelector } from 'react-redux';
import {
  selectModalType,
  selectIsModalOpen,
} from '../../redux/modal/selectors.js';
import ModalReUse from '../ModalReUse/ModalReUse.jsx';
import ModalNotAuthorized from '../ModalNotAuthorized/ModalNotAuthorized.jsx';
import ModalLogoutConfirm from '../ModalLogoutConfirm/ModalLogoutConfirm.jsx';

export default function ReModalContainer() {
  const isOpen = useSelector(selectIsModalOpen);
  const type = useSelector(selectModalType);

  if (!isOpen) return null;

  return (
    <ModalReUse>
      {type === 'notAuthorized' && <ModalNotAuthorized />}
      {type === 'logoutConfirm' && <ModalLogoutConfirm />}
    </ModalReUse>
  );
}
