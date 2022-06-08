import {combineReducers} from "redux";
import {
    loadMenuPending,
    loadMenuRejected,
    loadMenuResolved,
    MenuAction, menuSelected,
    MenuThunkAction,
    saveMenuPending,
    saveMenuRejected,
    saveMenuResolved,
    saveSort,
    saveSortPending,
    saveSortRejected,
    saveSortResolved
} from "../menu/actionTypes";
import {MenuItem} from "b2b-types";
import {RootState} from "../index";
import {saveItemSort} from "../../api/menu";
import {currentSiteSelector} from "chums-ducks";
import {selectCurrentMenu} from "../menu/selectors";
import {deleteMenuItemResolved, saveMenuItemResolved} from "../item";

export const prioritySort = (a: MenuItem, b: MenuItem) => a.priority - b.priority;

export const sortOrder = (list: MenuItem[]) => list.sort(prioritySort).map(i => i.id).join(':');

export const selectItemList = (state: RootState) => state.items.list;
export const selectItemsLoading = (state: RootState) => state.items.loading;
export const selectItemsSaving = (state: RootState) => state.items.savingSort;
export const selectCurrentSort = (state: RootState) => sortOrder(state.items.list);

export const saveItemSortAction = (items: MenuItem[]): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectItemsLoading(state) || selectItemsSaving(state)) {
                return;
            }
            dispatch({type: saveSortPending});
            const site = currentSiteSelector(state);
            const currentMenu = selectCurrentMenu(state);
            const list = selectItemList(state).map(i => i.id);
            const items = await saveItemSort(site.name, currentMenu.id, list);
            dispatch({type: saveSortResolved, payload: {clearContext: saveSort, items}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveItemSortAction()", error.message);
                return dispatch({type: saveSortRejected, payload: {error, context: saveSort}})
            }
            console.error("saveItemSortAction()", error);
        }
    }

const listReducer = (state: MenuItem[] = [], action: MenuAction): MenuItem[] => {
    const {type, payload} = action;
    switch (type) {
    case saveMenuResolved:
    case loadMenuResolved:
    case menuSelected:
        if (payload?.menu) {
            return [...(payload.menu.items || [])].sort(prioritySort);
        }
        return [];
    case deleteMenuItemResolved:
        if (payload?.items) {
            return [...payload.items].sort(prioritySort);
        }
        return state;

    case saveMenuItemResolved:
        if (payload?.item) {
            return [
                ...state.filter(i => i.id !== payload.item?.id),
                {...payload.item}
            ].sort(prioritySort);
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case loadMenuPending:
    case saveMenuPending:
        return true;
    case loadMenuResolved:
    case loadMenuRejected:
    case saveMenuResolved:
    case saveMenuRejected:
        return false;
    default:
        return state;
    }
}

const savingSortReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case saveSortPending:
        return true;
    case saveSortResolved:
    case saveSortRejected:
        return false;
    default:
        return state;
    }
}


export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    savingSort: savingSortReducer,
});
