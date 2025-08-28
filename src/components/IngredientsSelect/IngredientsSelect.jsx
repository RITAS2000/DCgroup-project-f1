import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIngredients } from '../../redux/ingredient/operations.js';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../redux/ingredient/selectors.js';
import css from './IngredientsSelect.module.css';

const IngredientsSelect = ({ selectedIngredient, onChange }) => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={css.ingredientsSelectWrapper}>
      {loading && <span className={css.hint}>Loading…</span>}
      {error && <span className={css.hint}>Error: {String(error)}</span>}
      {!error && (
        <select
          id="filter-ingredient"
          aria-label="Ingredient"
          value={selectedIngredient || ''}
          onChange={(e) => onChange(e.target.value)} // передаём _id
          disabled={loading}
          className={css.select}
        >
          <option value="">Ingredient</option>
          {(ingredients || []).map((ing) => (
            <option key={ing._id} value={ing._id}>
              {ing.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default IngredientsSelect;
