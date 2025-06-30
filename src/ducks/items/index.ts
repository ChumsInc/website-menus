import {MenuItem} from "b2b-types";
import {RootState} from "@/app/configureStore";
import {postItemSort} from "@/api/menu";
import {selectCurrentMenu, setCurrentMenu} from "@/ducks/menu";
import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {loadMenu} from "../menu/actions";
import {loadMenuItem, removeMenuItem, saveMenuItem} from "../item/actions";

const adapter = createEntityAdapter<MenuItem, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => b.id - a.id,
})

const selectors = adapter.getSelectors();

export interface ItemsState {
    status: 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading';
}

const extraState: ItemsState = {
    status: 'idle',
}


export const prioritySort = (a: MenuItem, b: MenuItem) => a.priority - b.priority;

export const sortOrderKey = (list: MenuItem[]): string => [...list].sort(prioritySort).map(i => i.id).join(':');

export const sortedKey = (list: MenuItem[]): string => list.map(item => item.id).join(':');


export const saveItemSort = createAsyncThunk<MenuItem[], number[], { state: RootState }>(
    'items/saveSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const currentMenu = selectCurrentMenu(state);
        return await postItemSort(currentMenu!.id, arg)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const status = selectItemsStatus(state);
            const currentMenu = selectCurrentMenu(state);
            return !!currentMenu?.id && arg.length > 0 && status === 'idle';
        }
    }
)

const itemsSlice = createSlice({
    name: 'items',
    initialState: adapter.getInitialState(extraState),
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadMenu.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload?.items ?? []);
            })
            .addCase(saveItemSort.pending, (state) => {
                state.status = 'saving-sort';
            })
            .addCase(saveItemSort.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
            })
            .addCase(saveItemSort.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(saveMenuItem.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                }
            })
            .addCase(loadMenuItem.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                }
            })
            .addCase(removeMenuItem.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload)
            })
            .addCase(setCurrentMenu, (state, action) => {
                if (!action.payload) {
                    adapter.removeAll(state);
                }
            })
    },
    selectors: {
        selectItemList: (state) => selectors.selectAll(state),
        selectItemsStatus: (state) => state.status,
    }
})

export const {selectItemList, selectItemsStatus} = itemsSlice.selectors;

export const selectSortedItems = createSelector(
    [selectItemList],
    (list) => {
        return [...list].sort(prioritySort);
    }
)
export const selectCurrentSort = createSelector(
    [selectSortedItems],
    (list) => {
        return sortedKey(list);
    }
)

export default itemsSlice;
