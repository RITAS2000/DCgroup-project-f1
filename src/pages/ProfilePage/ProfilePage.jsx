import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import s from './ProfilePage.module.css';

import { selectUserProfileTotalItems } from '../../redux/userPro/selectors';

import ProfileNavigation from '../../components/ProfileNavigation/ProfileNavigation.jsx';
import UserRecipesList from '../../components/UserRecipeList/UserRecipesList.jsx';

export default function ProfilePage() {
  const { recipeType } = useParams();
  const totalItems = useSelector(selectUserProfileTotalItems);
  const allowedTypes = ['own', 'favorites'];

  if (!allowedTypes.includes(recipeType)) {
    return <Navigate to="/profile/own" replace />;
  }

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <ProfileNavigation active={recipeType} />
        <p className={s.count}>{totalItems} recipes</p>
      </header>

      {recipeType === 'own' && <UserRecipesList type="own" />}
      {recipeType === 'favorites' && <UserRecipesList type="favorites" />}
    </section>
  );
}
