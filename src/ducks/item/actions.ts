import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {MenuItem} from "b2b-types";
import {deleteMenuItemAPI, fetchMenuItem, postMenuItemAPI} from "../../api/menu";
import {RootState} from "../../app/configureStore";
import {selectCurrentMenuStatus} from "../menu/selectors";
import {selectCurrentMenuItemStatus} from "./selectors";
import {MenuItemArg} from "../../types";
import {selectItemList} from "../items";

export const updateMenuItem = createAction<Partial<MenuItem>>('menuItem/update');
export const setCurrentMenuItem = createAction<MenuItem>('menuItem/setCurrent');

export const loadMenuItem = createAsyncThunk<MenuItem | null, MenuItemArg>(
    'menuItem/load',
    async (arg) => {
        return fetchMenuItem(arg)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.parentId
                && !!arg.id
                && selectCurrentMenuItemStatus(state) === 'idle';
        }
    }
)

export const saveMenuItem = createAsyncThunk<MenuItem | null, MenuItem>(
    'menuItem/save',
    async (arg, {getState}) => {
        if (!arg.id) {
            const state = getState() as RootState;
            const items = selectItemList(state);
            arg.priority = items.length;
        }
        return await postMenuItemAPI(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg?.parentId
                && selectCurrentMenuStatus(state) === 'idle'
                && selectCurrentMenuItemStatus(state) === 'idle';
        }
    }
)

export const removeMenuItem = createAsyncThunk<MenuItem[], MenuItemArg>(
    'menuItem/remove',
    async (arg) => {
        return await deleteMenuItemAPI(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.parentId
                && !!arg.id
                && selectCurrentMenuStatus(state) === 'idle'
                && selectCurrentMenuItemStatus(state) === 'idle';
        }
    }
)
