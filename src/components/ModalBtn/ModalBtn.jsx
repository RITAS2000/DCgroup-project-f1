import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/modal/slice.js';

export default function ModalBtn() {
  const dispatch = useDispatch();

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '20px' }}>
      <button onClick={() => dispatch(openModal({ type: 'notAuthorized' }))}>
        Open Not Authorized
      </button>
       <button onClick={() => dispatch(openModal({ type: 'logoutConfirm' }))}>
        Open Logout Confirm
      </button>
    </div>
  );
}
