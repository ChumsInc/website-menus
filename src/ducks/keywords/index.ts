import type {Keyword} from "b2b-types";
import type {RootState} from "@/app/configureStore.ts";
import {fetchKeywords} from "@/api/keywords.ts";
import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {dismissAlert} from "@chumsinc/alert-list";

const adapter = createEntityAdapter<Keyword, string>({
    selectId: (arg) => arg.keyword,
    sortComparer: (a, b) => a.keyword.localeCompare(b.keyword),
})

const selectors = adapter.getSelectors();


export interface KeywordsState {
    status: 'idle' | 'loading' | 'rejected';
}

export const extraState: KeywordsState = {
    status: 'idle'
}

const keywordsSlice = createSlice({
    name: 'keywords',
    initialState: adapter.getInitialState(extraState),
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadKeywords.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadKeywords.fulfilled, (state, action) => {
                state.status = 'idle'
                adapter.setAll(state, action.payload)
            })
            .addCase(loadKeywords.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('keywords/')) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectKeywordsList: (state) => selectors.selectAll(state),
        selectKeywordsStatus: (state) => state.status,
    }
});

export default keywordsSlice;
export const {selectKeywordsList, selectKeywordsStatus} = keywordsSlice.selectors;

export const keywordTitleSorter = (a: Keyword, b: Keyword) => a.title.toLowerCase() === b.title.toLowerCase()
    ? (a.keyword > b.keyword ? 1 : -1)
    : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);


export const loadKeywords = createAsyncThunk<Keyword[], void>(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectKeywordsStatus(state) === 'idle';
        }
    }
)
