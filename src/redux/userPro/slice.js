import { createSlice } from '@reduxjs/toolkit';
import { fetchOwn, fetchSaved, removeSaved } from './thunks';
import { normalizeListResponse, resolveTotalPages } from './utils';
const initialState = {
  items: [],
  loading: false,
  error: null,
  totalPages: 1,
  page: 1,
  hasNext: false,
  currentRequestId: null,
  type: 'own',
  totalItems: 0,
};
const applyFulfilled = (state, action) => {
  if (state.currentRequestId !== action.meta.requestId) return;
  state.loading = false;
  state.error = null;
  state.currentRequestId = null;
  const { list, totalPages, totalItems } = normalizeListResponse(
    action.payload,
  );
  state.totalItems = totalItems;
  const page = action.meta?.arg?.page ?? 1;
  const replace = action.meta?.arg?.replace ?? page <= 1;
  const limit = action.meta?.arg?.limit ?? 12;
  const tp = resolveTotalPages(totalPages, totalItems, limit);
  state.page = page;
  state.totalPages = tp;
  state.hasNext = page < tp;
  state.items = replace
    ? list
    : [
        ...state.items,
        ...list.filter(
          (it) =>
            !state.items.some((x) => (x.id ?? x._id) === (it.id ?? it._id)),
        ),
      ];
};
const handlePending = (state, action) => {
  state.loading = true;
  state.error = null;
  state.currentRequestId = action.meta.requestId;
  const page = action.meta?.arg?.page ?? 1;
  const replace = action.meta?.arg?.replace ?? page <= 1;
  if (replace) {
    state.items = [];
    state.page = 1;
    state.totalPages = 1;
    state.hasNext = false;
  }
};
const handleRejected = (state, action) => {
  if (state.currentRequestId !== action.meta.requestId) return;
  state.loading = false;
  state.currentRequestId = null;
  state.error = action.payload || action.error?.message || 'Error';
  state.hasNext = false;
};
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfile: () => ({ ...initialState }),
    setRecipeType: (state, action) => {
      const newType = action.payload;
      if (newType !== state.type) {
        state.type = newType;
        state.items = [];
        state.page = 1;
        state.totalPages = 1;
        state.hasNext = false;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwn.pending, handlePending)
      .addCase(fetchOwn.fulfilled, applyFulfilled)
      .addCase(fetchOwn.rejected, handleRejected)
      .addCase(fetchSaved.pending, handlePending)
      .addCase(fetchSaved.fulfilled, applyFulfilled)
      .addCase(fetchSaved.rejected, handleRejected)
      .addCase(removeSaved.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.items = state.items.filter(
          (it) => String(it.id ?? it._id) !== id,
        );
      });
  },
});
export const { resetProfile, setRecipeType } = userProfileSlice.actions;
export const selectUserProfile = (state) => state.userProfile;
export const selectUserRecipes = (state) => state.userProfile.items;
export const selectUserProfileLoading = (state) => state.userProfile.loading;
export const selectUserProfileError = (state) => state.userProfile.error;
export const selectUserProfilePage = (state) => state.userProfile.page;
export const selectUserProfileTotalPages = (state) =>
  state.userProfile.totalPages;
export const selectUserProfileHasNext = (state) => state.userProfile.hasNext;
export default userProfileSlice.reducer;
