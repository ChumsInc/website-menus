import {type RootState} from "@/app/configureStore";
import {deleteMenuAPI, fetchMenu, postItemSort, postMenu} from "@/api/menu";
import type {Menu, MenuItem} from "b2b-types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {selectCurrentMenuStatus} from "@/ducks/menu/index.ts";

export const setCurrentMenu = createAction<Menu | null>('menu/setCurrent');
export const setNewMenu = createAction<void>('menu/setNew');


export const loadMenu = createAsyncThunk<Menu | null, number | string, { state: RootState }>(
    'menu/load',
    async (arg) => {
        return await fetchMenu(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)

export const saveMenu = createAsyncThunk<Menu | null, Menu, { state: RootState }>(
    'menu/save',
    async (arg) => {
        return await postMenu(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.title && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)

export interface SaveMenuSortProps {
    menuId: number;
    sort: number[];
}
export const saveMenuSort = createAsyncThunk<MenuItem[], SaveMenuSortProps, { state: RootState }>(
    'menu/saveSort',
    async (arg) => {
        return await postItemSort(arg.menuId, arg.sort);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.menuId
                && !!arg.sort.length
                && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)

export const removeMenu = createAsyncThunk<void, number, { state: RootState }>(
    'menu/remove',
    async (arg) => {
        return await deleteMenuAPI(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)
