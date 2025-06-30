import {combineReducers} from "redux";
import menusSlice from "../ducks/menus";
import {configureStore} from "@reduxjs/toolkit";
import menuSlice from "../ducks/menu";
import itemSlice from "../ducks/item";
import keywordsSlice from "../ducks/keywords";
import itemsSlice from "../ducks/items";
import {alertsSlice} from "@chumsinc/alert-list";

const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [itemsSlice.reducerPath]: itemsSlice.reducer,
    [keywordsSlice.reducerPath]: keywordsSlice.reducer,
    [menuSlice.reducerPath]: menuSlice.reducer,
    [menusSlice.reducerPath]: menusSlice.reducer,
    [itemSlice.reducerPath]: itemSlice.reducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;
