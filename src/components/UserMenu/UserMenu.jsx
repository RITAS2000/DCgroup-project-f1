import { useDispatch, useSelector } from 'react-redux';
import css from './UserMenu.module.css';
import { selectUser } from '../../redux/auth/selectors.js';
import { Link } from 'react-router-dom';

import { openModal } from '../../redux/modal/slice.js';

import { useNavigate } from 'react-router-dom';


export default function UserMenu({ onClick }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();


  const handleLogOut = (e) => {
    e.preventDefault(); 
    dispatch(openModal({type: 'logoutConfirm'}));

  };

  return (
    <div className={css.userMenu}>
      <div className={css.userName}>
        <div className={css.letter}>
          {user?.name ? user.name.charAt(0) : ''}
        </div>
        <span>{user?.name || ''}</span>
      </div>

      <div className={css.separator}></div>

      <button className={css.btnLogout} onClick={handleLogOut}>
        <svg width="24" height="24">
          <use href="/sprite/symbol-defs.svg#icon-log-out" />
        </svg>
      </button>
    </div>
  );
}
