import {Keyword} from "b2b-types";
import {RootState} from "../../app/configureStore";
import {fetchKeywords} from "../../api/keywords";
import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

const adapter = createEntityAdapter<Keyword, string>({
    selectId: (arg) => arg.keyword,
    sortComparer: (a, b) => a.keyword.localeCompare(b.keyword),
})
const selectors = adapter.getSelectors();

export interface KeywordsState {
    loading: boolean;
}

const extraState: KeywordsState = {
    loading: false,
}

export const keywordTitleSorter = (a: Keyword, b: Keyword) => a.title.toLowerCase() === b.title.toLowerCase()
    ? (a.keyword > b.keyword ? 1 : -1)
    : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);


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

const keywordsSlice = createSlice({
    name: 'keywords',
    initialState: adapter.getInitialState(extraState),
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadKeywords.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadKeywords.fulfilled, (state, action) => {
                state.loading = false;
                adapter.setAll(state, action.payload)
            })
            .addCase(loadKeywords.rejected, (state, action) => {
                state.loading = false;
            })
    },
    selectors: {
        selectAllKeywords: (state) => selectors.selectAll(state),
        selectKeywordsLoading: (state) => state.loading,
    }
})
export const {selectAllKeywords, selectKeywordsLoading} = keywordsSlice.selectors;

export const selectKeywordsList = createSelector(
    [selectAllKeywords],
    (list) => {
        return [...list].sort(keywordTitleSorter)
    }
)

export default keywordsSlice;
