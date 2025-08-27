import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getImageUrl, deleteFavorite, addFavorite } from '../../api/recipes';
import s from './UserRecipeCard.module.css';

export default function UserRecipeCard({
  item,
  mode = 'own',
  onRemoved,
  onRemovedError,
}) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [pending, setPending] = useState(false);

  const r = item?.recipe ?? item ?? {};
  const recipeId = item?.recipeId || r._id;

  const heading = r.title || r.name || 'Recipe';
  const desc = r.description || r.desc || '';
  const time = r.time ?? r.cookTime ?? r.totalTime ?? '';
  const cals = r.cals ?? r.calories ?? r.calory;
  const rawImg = r.photo || r.thumb || r.image || r.img || '';
  const img = getImageUrl(rawImg);

  const isFavoritesTab =
    /\/profile\/favorites/.test(loc.pathname) || mode === 'favorites';
  const [isSaved, setIsSaved] = useState(!!isFavoritesTab);

  async function toggleSave(id) {
    if (!id || pending) return;

    try {
      setPending(true);
      console.log('Try to toggle favorite with recipeId:', id);

      if (isSaved) {
        await deleteFavorite(id);
        setIsSaved(false);

        if (isFavoritesTab && typeof onRemoved === 'function') {
          onRemoved(id);
        }
      } else {
        await addFavorite(id);
        setIsSaved(true);
      }
    } catch (err) {
      if (typeof onRemovedError === 'function') onRemovedError(id, err);
      console.error('Failed to toggle favorite', err);
      alert('Operation failed. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={s.card} data-rc="v2">
      <div className={s.thumbWrap}>
        {img ? (
          <img
            className={s.thumb}
            src={img}
            alt={heading}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getImageUrl('/images/placeholder.png');
            }}
          />
        ) : (
          <div className={s.thumbFallback} aria-label="No image available" />
        )}
      </div>

      <div className={s.headerRow}>
        <h3 className={s.title} title={heading}>
          {heading}
        </h3>
        {time && (
          <span className={s.timeBadge} title={`${time} min`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={s.clockIcon}
              aria-hidden="true"
            >
              <path
                d="M12 7.61537V12.5481L15.2885 15.2884M19.125 12C19.125 15.935 15.935 19.125 12 19.125C8.06497 19.125 4.875 15.935 4.875 12C4.875 8.06497 8.06497 4.875 12 4.875C15.935 4.875 19.125 8.06497 19.125 12Z"
                stroke="black"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {time}
          </span>
        )}
      </div>

      <div className={s.descBlock}>
        <p className={s.desc}>{desc || '\u00A0'}</p>
        <span className={s.calsPill}>
          {typeof cals === 'number' ? `~${cals} cals` : '~N/A cals'}
        </span>
      </div>

      <div className={s.footerRow}>
        <button
          className={`${s.moreBtn} ${
            mode === 'own' ? s.moreBtnOwn : s.moreBtnFav
          }`}
          type="button"
          onClick={() => recipeId && navigate(`/recipes/${recipeId}`)}
          disabled={!recipeId}
        >
          Learn more
        </button>

        {isFavoritesTab && (
          <button
            type="button"
            className={`${s.favBtn} ${isSaved ? s.favBtnActive : ''}`}
            onClick={() => toggleSave(recipeId)}
            aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            aria-pressed={isSaved ? 'true' : 'false'}
            disabled={pending || !recipeId}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M11.9971 3.5C13.2607 3.50001 14.4206 3.62091 15.3398 3.76074C16.5036 3.93777 17.416 4.7353 17.6758 5.84961C17.9894 7.19485 18.2969 9.24141 18.2441 11.9902C18.1859 15.0233 17.7432 17.2117 17.3164 18.6396C17.201 19.0256 16.9339 19.2243 16.6318 19.2754C16.316 19.3287 15.9263 19.2236 15.6094 18.9082C15.0326 18.334 14.3719 17.7138 13.7627 17.2344C13.4586 16.9951 13.1558 16.7817 12.875 16.626C12.6101 16.4791 12.2995 16.3457 11.9971 16.3457C11.6993 16.3457 11.3783 16.4769 11.0977 16.6211C10.7986 16.7747 10.4675 16.9855 10.1289 17.2246C9.45038 17.7037 8.69895 18.3244 8.03711 18.8994C7.68779 19.2029 7.27644 19.2747 6.95215 19.1865C6.63917 19.1013 6.37522 18.8609 6.29395 18.4424C6.01488 17.0044 5.75 14.8805 5.75 12C5.75 9.12652 6.04615 7.09969 6.34082 5.79492C6.58505 4.71356 7.4671 3.94375 8.60156 3.76855C9.52893 3.62535 10.7091 3.5 11.9971 3.5Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
