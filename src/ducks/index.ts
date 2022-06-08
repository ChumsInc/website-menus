import {combineReducers} from "redux";
import {alertsReducer, pagesReducer, sortableTablesReducer, sitesReducer} from 'chums-ducks/dist/ducks';
import {default as keywordsReducer} from './keywords';
import {default as menusReducer} from './menus';
import {default as menuReducer} from './menu';
import {default as itemsReducer} from './items';
import {default as itemReducer} from './item';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    sites: sitesReducer,
    sortableTables: sortableTablesReducer,
    keywords: keywordsReducer,
    menus: menusReducer,
    menu: menuReducer,
    items: itemsReducer,
    item: itemReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;

