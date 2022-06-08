import {combineReducers} from "redux";
import {
    ActionInterface,
    ActionPayload,
    currentSiteSelector,
    dismissContextAlertAction,
    selectAlertListByContext,
    selectTableSort,
    siteSelected,
    SortableTableField,
    SorterProps
} from "chums-ducks";
import {Menu} from "b2b-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {apiActionHelper} from "../utils";
import {getMenuListAPI} from "../../api/menu";
import {createSelector} from "reselect";


export interface MenusPayload extends ActionPayload {
    list?: Menu[],
}

export interface MenusAction extends ActionInterface {
    payload?: MenusPayload,
}

interface MenusThunkAction extends ThunkAction<any, RootState, unknown, MenusAction> {
}

export type MenuSortField = keyof Omit<Menu, 'status' | 'items' | 'parents'>

export interface MenuSortProps extends SorterProps {
    field: MenuSortField
}

export interface MenuTableField extends SortableTableField {
    field: MenuSortField,
}

export const MENU_TABLE_KEY = 'menu-list';

export const menuSorter = ({field, ascending}: MenuSortProps) => (a: Menu, b: Menu) => {
    const ascMod = ascending ? 1 : -1;
    switch (field) {
    case 'id':
        return (a[field] - b[field]) * ascMod;
    default:
        return (a[field].toLowerCase() === b[field].toLowerCase()
            ? a.id - b.id
            : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * ascMod;
    }
}

const toggleInactiveMenus = 'menus/toggleInactive';
const loadMenuList = 'menus/loadList';
const [loadMenuListPending, loadMenuListResolved, loadMenuListRejected] = apiActionHelper(loadMenuList);

export const selectMenusList = (state: RootState) => state.menus.list;
export const selectMenusLoading = (state: RootState) => state.menus.loading;
export const selectMenusLoaded = (state: RootState) => state.menus.loaded;
export const selectFilterInactive = (state: RootState) => state.menus.filterInactive;

export const selectSortedMenuList = createSelector(
    [selectMenusList, selectFilterInactive, selectTableSort(MENU_TABLE_KEY)],
    (list, filterInactive, sort) => {
        return list.filter(item => !filterInactive || !!item.status)
            .sort(menuSorter(sort as MenuSortProps));
    });

export const loadMenusAction = (): MenusThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectMenusLoading(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            dispatch({type: loadMenuListPending});
            const list = await getMenuListAPI(site.name);
            dispatch({type: loadMenuListResolved, payload: {list}});
            if (selectAlertListByContext(loadMenuList)(state).length) {
                dispatch(dismissContextAlertAction(loadMenuList));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadMenusAction()", error.message);
                return dispatch({type: loadMenuListRejected, payload: {error, context: loadMenuList}})
            }
            console.error("loadMenusAction()", error);
        }
    }

export const toggleFilterInactiveAction = () => ({type: toggleInactiveMenus});


const listReducer = (state: Menu[] = [], action: MenusAction): Menu[] => {
    const {type, payload} = action;
    switch (type) {
    case loadMenuListResolved:
        if (payload?.list) {
            return [...payload.list.sort((a, b) => a.id > b.id ? 1 : -1)];
        }
        return [];
    case siteSelected:
        return [];
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: MenusAction): boolean => {
    switch (action.type) {
    case loadMenuListPending:
        return true;
    case loadMenuListResolved:
    case loadMenuListRejected:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = false, action: MenusAction): boolean => {
    switch (action.type) {
    case loadMenuListResolved:
        return true;
    case siteSelected:
        return false;
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: MenusAction): boolean => {
    switch (action.type) {
    case toggleInactiveMenus:
        return !state;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filterInactive: filterInactiveReducer,
});
