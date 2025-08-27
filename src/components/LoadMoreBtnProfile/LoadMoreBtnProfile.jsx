import s from './LoadMoreBtn.module.css';
export default function LoadMoreBtn({ onClick, disabled, loading }) {
  return (
    <div className={s.wrap}>
      <button
        className={s.btn}
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {loading ? 'Loading…' : 'Load More'}
      </button>
    </div>
  );
}
