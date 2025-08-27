import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';
import { Suspense, lazy } from 'react';
import { ClockLoader } from 'react-spinners';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

const Outlet = lazy(() => import('../Outlet/Outlet.jsx'));

export default function Layout({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={css.page}>
      <Header />

      <ModalContainer />

      <div className={css['outlet-container']}>
        <Suspense
          fallback={
            <div className={css.loader}>
              <ClockLoader color="#3d2218" size={300} />
            </div>
          }
        >
          <Outlet>{children}</Outlet>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
