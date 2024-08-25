import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '@store';
import { useParams } from 'react-router-dom';
import { ingredientSelectors } from '@slices';

export const IngredientDetails: FC = () => {
  const id = useParams().id || '';

  const ingredientData = useSelector(ingredientSelectors.getIngredientById(id));

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
