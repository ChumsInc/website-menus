import {Keyword} from "b2b-types";
import {RootState} from "../../app/configureStore";
import {fetchKeywords} from "../../api/keywords";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";

export interface KeywordsState {
    list: Keyword[];
    loading: boolean;
}

export const initialState: KeywordsState = {
    list: [],
    loading: false,
}

export const keywordTitleSorter = (a: Keyword, b: Keyword) => a.title.toLowerCase() === b.title.toLowerCase()
    ? (a.keyword > b.keyword ? 1 : -1)
    : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);

export const selectKeywordsList = (state: RootState) => state.keywords.list;
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;


export const loadKeywords = createAsyncThunk<Keyword[], void>(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeywordsLoading(state);
        }
    }
)

const keywordsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadKeywords.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadKeywords.fulfilled, (state, action) => {
            state.loading = false;
            state.list = [...action.payload].sort(keywordTitleSorter);
        })
        .addCase(loadKeywords.rejected, (state, action) => {
            state.loading = false;
        })
});

export default keywordsReducer
