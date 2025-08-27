import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import css from './Filters.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const Filters = ({ title }) => {
  const dispatch = useDispatch();

  // локальные фильтры
  const [selectedCategory, setSelectedCategory] = useState('');
  // здесь храним именно _id ингредиента
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // из стора
  const query = useSelector((s) => s.recipes.query); // { title, category, ingredient }
  const totalItems = useSelector((s) => s.recipes.totalItems); // общее кол-во найденных
  const itemsLen = useSelector((s) => s.recipes.items?.length) || 0;
  const total = totalItems || itemsLen;

  // список ингредиентов для конвертации id -> name
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  // нормализованный заголовок/поисковая строка (строка!)
  const queryTitle = (title ?? query?.title ?? '').trim();

  // мапа id->name для быстрого получения имени по выбранному id
  // const ingIdToName = useMemo(() => {
  //   const m = new Map();
  //   for (const ing of ingredients || []) {
  //     if (ing && ing._id) m.set(String(ing._id), ing.name);
  //   }
  //   return m;
  // }, [ingredients]);

  // имя ингредиента, которое ждёт бэкенд (конвертация из _id)
  // const selectedIngredientName = selectedIngredient;
  // ? ingIdToName.get(String(selectedIngredient)) || ''
  // : '';

  useEffect(() => {
    // если выбран ингредиент по _id, но справочник ещё не загрузился —
    // ждём, чтобы корректно конвертировать id -> name
    if (selectedIngredient && !ingredientsLoaded) return;

    // если нет ни текста, ни выбранных фильтров — не дергаем бэкенд
    if (!queryTitle && !selectedCategory && !selectedIngredient) return;
    console.log(
      '[filters] title=',
      queryTitle,
      'category=',
      selectedCategory,
      'ingredientName=',
      selectedIngredient,
    );
    dispatch(
      searchRecipes({
        title: queryTitle, // строка
        category: selectedCategory, // имя категории
        ingredient: selectedIngredient, // ИМЯ ингредиента
        page: 1,
      }),
    );
  }, [
    dispatch,
    queryTitle,
    selectedCategory,
    selectedIngredient, // важно, чтобы эффект сработал, когда _id сменился до загрузки справочника
    ingredientsLoaded, // и повторился, когда справочник подгрузился
  ]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    // title по ТЗ не трогаем
  };

  const headingTitle = queryTitle;

  return (
    <div className={css.filtersWrapper}>
      <div className={css.topRow}>
        <h2>
          {headingTitle ? `Search recipes for "${headingTitle}"` : 'Recipes'}
        </h2>
      </div>

      <div className={css.bottomRow}>
        <span className={css.count}>
          {total} recipe{total !== 1 ? 's' : ''}
        </span>

        <button
          type="button"
          className={css.filtersBtn}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span>Filters</span>
          <svg className={css.icon} aria-hidden="true">
            <use href={`${SPRITE}#icon-filter`} />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={css.panel}>
          <button className={css.resetButton} onClick={handleReset}>
            Reset filters
          </button>

          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* сюда и уходит/хранится _id; до запроса конвертируется в name */}
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
        </div>
      )}
    </div>
  );
};

export default Filters;
