import type {MenuItem} from "b2b-types";
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {loadMenu} from "../menu/actions";
import {loadMenuItem, removeMenuItem, saveMenuItem} from "../item/actions";
import {saveItemSort} from "./actions";
import {prioritySort, sortOrderKey} from "./utils";
import {setNewMenu} from "@/ducks/menu/actions";


const adapter = createEntityAdapter<MenuItem, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const selectors = adapter.getSelectors();


export interface ItemsState {
    status: 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading' | 'rejected';
    currentSort: string;
}

export const extraState: ItemsState = {
    status: 'idle',
    currentSort: '',
}

const itemsSlice = createSlice({
    name: 'items',
    initialState: adapter.getInitialState(extraState),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMenu.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload?.items ?? []);
                state.currentSort = sortOrderKey(action.payload?.items ?? []);
            })
            .addCase(saveItemSort.pending, (state) => {
                state.status = 'saving-sort';
            })
            .addCase(saveItemSort.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload)
                state.currentSort = sortOrderKey(action.payload);
            })
            .addCase(saveItemSort.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(saveMenuItem.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                    state.currentSort = sortOrderKey(Object.values(state.entities));
                }
            })
            .addCase(loadMenuItem.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                    state.currentSort = sortOrderKey(Object.values(state.entities));
                }
            })
            .addCase(removeMenuItem.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload);
                state.currentSort = sortOrderKey(action.payload)
            })
            .addCase(setNewMenu, (state) => {
                adapter.removeAll(state)
                state.currentSort = sortOrderKey(Object.values(state.entities));
            })
    },
    selectors: {
        selectItemList: (state) => selectors.selectAll(state),
        selectItemsStatus: (state) => state.status,
        selectCurrentSort: (state) => state.currentSort,
        selectItemsCount: (state) => selectors.selectAll(state).length,
    }
})

export default itemsSlice;
export const {selectItemList, selectItemsStatus, selectCurrentSort, selectItemsCount} = itemsSlice.selectors;

export const selectSortedItems = createSelector(
    [selectItemList],
    (items) => {
        return items.sort(prioritySort)
    }
)
