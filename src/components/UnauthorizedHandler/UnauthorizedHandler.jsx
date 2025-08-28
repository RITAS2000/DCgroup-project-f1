import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/operations.js';
import { selectRecipesError } from '../../redux/recipes/selectors.js';
import {
  selectAuthToken,
  selectUserProfileError,
} from '../../redux/userPro/selectors.js';
import { toast } from 'react-toastify';
import { clearAuth } from '../../redux/auth/slice.js';

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const recipesError = useSelector(selectRecipesError);
  const usersError = useSelector(selectUserProfileError);
  const stateToken = useSelector(selectAuthToken);

  useEffect(() => {
    const tokenMissing = !(stateToken || localStorage.getItem('token'));
    if (
      tokenMissing ||
      recipesError?.status === 401 ||
      usersError?.status === 401
    ) {
      if (!tokenMissing) dispatch(logout());
      dispatch(clearAuth());
      localStorage.removeItem('token');
      toast.error('Session has expired. Please log in again.');
    }
    if (usersError?.status === 404) {
      dispatch(clearAuth());
      localStorage.removeItem('token');
      toast.error('Session has expired. Please log in again.');
    }
  }, [recipesError, usersError, stateToken, dispatch]);

  return null;
};

export default UnauthorizedHandler;
