import {MenuItem} from "b2b-types";
import {RootState} from "../../app/configureStore";
import {postItemSort} from "../../api/menu";
import {selectCurrentMenu} from "../menu/selectors";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {loadMenu, setNewMenu} from "../menu/actions";
import {loadMenuItem, removeMenuItem, saveMenuItem} from "../item/actions";

export interface ItemsState {
    list: MenuItem[];
    status: 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading';
    currentSort: string;
}

export const initialState: ItemsState = {
    list: [],
    status: 'idle',
    currentSort: '',
}

export const prioritySort = (a: MenuItem, b: MenuItem) => a.priority - b.priority;

export const sortOrderKey = (list: MenuItem[]):string => [...list].sort(prioritySort).map(i => i.id).join(':');

export const selectItemList = (state: RootState) => state.items.list;
export const selectItemsStatus = (state: RootState) => state.items.status;
export const selectCurrentSort = (state: RootState) => state.items.currentSort;

export const saveItemSort = createAsyncThunk<MenuItem[], MenuItem[]>(
    'items/saveSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const currentMenu = selectCurrentMenu(state);
        return await postItemSort(currentMenu!.id, arg.map(item => item.id))
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

const itemsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadMenu.fulfilled, (state, action) => {
            state.list = [...(action.payload?.items ?? [])].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(saveItemSort.pending, (state) => {
            state.status = 'saving-sort';
        })
        .addCase(saveItemSort.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = [...action.payload].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(saveItemSort.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(saveMenuItem.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(item => item.id !== action.payload?.id),
                    action.payload,
                ].sort(prioritySort);
                state.currentSort = sortOrderKey(state.list);
            }
        })
        .addCase(loadMenuItem.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(item => item.id !== action.payload?.id),
                    action.payload,
                ].sort(prioritySort);
                state.currentSort = sortOrderKey(state.list);
            }
        })
        .addCase(removeMenuItem.fulfilled, (state, action) => {
            state.list = [...action.payload].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(setNewMenu, (state) => {
            state.list = [];
            state.currentSort = sortOrderKey(state.list);
        })
});

export default itemsReducer;
