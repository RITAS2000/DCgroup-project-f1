import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  withCredentials: false,
});

export const searchRecipes = createAsyncThunk(
  'recipes/search',
  async ({ title, category, ingredient, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('api/recipes', {
        params: { title, category, ingredient, page },
      });

      const d = data?.data ?? {};
      return {
        recipes: d.data || [],
        page: d.page ?? 1,
        perPage: d.perPage ?? 12,
        totalItems: d.totalItems ?? d.total ?? 0,
        totalPages: d.totalPages ?? 0,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          recipes: [],
          page: 1,
          perPage: 12,
          totalItems: 0,
          totalPages: 0,
        };
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
