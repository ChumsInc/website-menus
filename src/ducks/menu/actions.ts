import {RootState} from "@/app/configureStore";
import {selectCurrentMenu, selectCurrentMenuStatus} from "@/ducks/menu";
import {deleteMenuAPI, fetchMenu, postMenu, postItemSort} from "@/api/menu";
import {Menu, MenuItem} from "b2b-types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";


export const loadMenu = createAsyncThunk<Menu | null, number|string>(
    'menu/load',
    async (arg) => {
        return await fetchMenu(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)

export const saveMenu = createAsyncThunk<Menu | null, Menu>(
    'menu/save',
    async (arg) => {
        return await postMenu(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.title && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)


export const saveMenuSort = createAsyncThunk<MenuItem[], number[]>(
    'menu/saveSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const menu = selectCurrentMenu(state);
        return await postItemSort(menu!.id, arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.length
                && !!selectCurrentMenu(state)
                && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)

export const removeMenu = createAsyncThunk<void, number>(
    'menu/remove',
    async (arg) => {
        return await deleteMenuAPI(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentMenuStatus(state) === 'idle';
        }
    }
)
