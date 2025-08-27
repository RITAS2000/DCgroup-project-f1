import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../redux/auth/operations.js';
import { toast } from 'react-toastify';

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const hasShownToast = useRef(false); // трекнемо чи показаний тост
  const hasLoggedOut = useRef(false); // трекнемо чи вже робився logout

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          if (!hasShownToast.current) {
            hasShownToast.current = true;
            toast.info('Сесія закінчилась. Будь ласка, увійдіть знову.');
          }

          if (!hasLoggedOut.current) {
            hasLoggedOut.current = true;
            dispatch(logout());
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  return null;
};

export default UnauthorizedHandler;
