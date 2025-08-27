import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipe, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/recipes',
        recipe,
      );
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);
