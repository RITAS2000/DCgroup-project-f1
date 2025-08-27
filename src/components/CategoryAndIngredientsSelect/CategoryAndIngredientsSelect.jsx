import { Field, ErrorMessage, useFormikContext } from 'formik';

import css from './CategoryAndIngredientsSelect.module.css';

const CategoryAndIngredientsSelect = ({
  categories,
  placeholder,
  name,
  id,
}) => {
  // const { values } = useFormikContext();

  return (
    <>
      <Field className={css.select} as="select" name={name} id={id}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
      </Field>
      <ErrorMessage className={css.errorMsg} name={name} component="span" />
    </>
  );
};

export default CategoryAndIngredientsSelect;
