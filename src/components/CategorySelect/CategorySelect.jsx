import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/categorie/operation.js';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../redux/categorie/selectors.js';
import css from './CategorySelect.module.css';

const CategorySelect = ({ selectedCategory, onChange }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className={css.categorySelectWrapper}>
      {loading && <span>Loading ...</span>}
      {error && <span>Error: {error}</span>}
      {!loading && !error && (
        <select
          value={selectedCategory || ''}
          onChange={(e) => onChange(e.target.value)}
          className={css.select}
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategorySelect;
