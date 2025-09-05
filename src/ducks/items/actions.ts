import {createAsyncThunk} from "@reduxjs/toolkit";
import {MenuItem} from "b2b-types";
import {RootState} from "../../app/configureStore";
import {selectCurrentMenu} from "../menu/selectors";
import {postItemSort} from "../../api/menu";
import {selectItemsStatus} from "./selectors";

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
