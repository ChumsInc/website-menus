import {combineReducers} from "redux";
import menusReducer from "../ducks/menus";
import {configureStore} from "@reduxjs/toolkit";
import menuReducer from "../ducks/menu";
import menuItemReducer from "../ducks/item";
import keywordsReducer from "../ducks/keywords";
import itemsReducer from "../ducks/items";
import alertsReducer from "../ducks/alerts";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    items: itemsReducer,
    keywords: keywordsReducer,
    menu: menuReducer,
    menus: menusReducer,
    menuItem: menuItemReducer,
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
