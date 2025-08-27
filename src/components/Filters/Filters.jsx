import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import {
  selectRecipes,
  selectSearchQuery,
} from '../../redux/recipes/selectors.js';
import css from './Filters.module.css';

const Filters = ({ title }) => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');

  const recipes = useSelector(selectRecipes);
  const searchQuery = useSelector(selectSearchQuery);

  useEffect(() => {
    dispatch(
      searchRecipes({
        title: title || searchQuery,
        category: selectedCategory,
        ingredient: selectedIngredient,
      }),
    );
  }, [title, selectedCategory, selectedIngredient, dispatch, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
  };

  return (
    <div className={css.filtersWrapper}>
      <div className={css.topRow}>
        <h2>{title ? `Search Recipes For "${title}"` : 'Recipes'}</h2>
      </div>

      <div className={css.bottomRow}>
        <span className={css.count}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </span>

        <button className={css.resetButton} onClick={handleReset}>
          Reset Filters
        </button>

        <CategorySelect
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        <IngredientsSelect
          selectedIngredient={selectedIngredient}
          onChange={setSelectedIngredient}
        />
      </div>
    </div>
  );
};

export default Filters;
