import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/'; // треба було первирити функціонал

// axios.defaults.baseURL = 'https://dcgroup-react-node-b.onrender.com/';

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

export const register = createAsyncThunk(
  'auth/register',
  async (values, thunkAPI) => {
    try {
      console.log('Registering with:', values);
      const res = await axios.post('/api/auth/register', values);
      // setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (values, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/login', values);
      console.log('Login response:', res);

      const token = res.data.token; // 🔹 визначаємо token
      setAuthHeader(token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
//   try {
//     const state = thunkAPI.getState();
//     const token = state.auth.token;

//     await axios.post(
//       '/api/auth/logout',
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     clearAuthHeader();
//     return;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  try {
    await axios.post(
      '/api/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    console.warn('Logout error:', error.message);
  } finally {
    // завжди очищаємо токен і стан
    localStorage.removeItem('token');
    clearAuthHeader();
  }
});
