import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
    query: string | null;
}

const initialState: SearchState = {
    query: null,
};

const searchSlice = createSlice({
    name: "global_search",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearchQuery: (state) => {
            state.query = '';
        },
    },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

export const SearchReducer = searchSlice.reducer;
