import {combineReducers} from "redux";
import {
    defaultMenuItem,
    EditableMenuItem,
    loadMenuResolved,
    MenuAction,
    menuItemSelected,
    MenuThunkAction,
} from "../menu/actionTypes";
import {RootState} from "../index";
import {MenuItem} from "b2b-types";
import {apiActionHelper} from "../utils";
import {deleteMenuItemAPI, getMenuItemAPI, postMenuItemAPI} from "../../api/menu";
import {currentSiteSelector} from "chums-ducks";
import {useSelector} from "react-redux";
import {selectCurrentMenu} from "../menu/selectors";
import {selectItemList} from "../items";

export const menuItemUpdated = 'menu/itemUpdated';

export const saveMenuItem = 'menu/saveMenuItem';
export const [saveMenuItemPending, saveMenuItemResolved, saveMenuItemRejected] = apiActionHelper(saveMenuItem);

export const loadMenuItem = 'menu/loadMenuItem';
export const [loadMenuItemPending, loadMenuItemResolved, loadMenuItemRejected] = apiActionHelper(loadMenuItem);

export const deleteMenuItem = 'menu/deleteMenuItem';
export const [deleteMenuItemPending, deleteMenuItemResolved, deleteMenuItemRejected] = apiActionHelper(deleteMenuItem);

export const selectCurrentItem = (state: RootState) => state.item.selected;
export const selectCurrentLoading = (state: RootState) => state.item.loading;
export const selectCurrentItemSaving = (state: RootState) => state.item.saving;

export const selectItemAction = (item: MenuItem): MenuAction => ({type: menuItemSelected, payload: {item}});
export const updateItemAction = (props: Partial<MenuItem>): MenuAction => ({type: menuItemUpdated, payload: {props}});

export const loadMenuItemAction = (id: number): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCurrentLoading(state) || selectCurrentItemSaving(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const menu = selectCurrentMenu(state);
            dispatch({type: loadMenuItemPending})
            const item = await getMenuItemAPI(site.name, menu.id, id);
            if (!item) {
                return dispatch({
                    type: loadMenuItemRejected,
                    payload: {error: new Error('Menu item not found'), context: loadMenuItem}
                });
            }
            dispatch({type: loadMenuItemResolved, payload: {item, clearContext: loadMenuItem}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadMenuItemAction()", error.message);
                return dispatch({type: loadMenuItemRejected, payload: {error, context: loadMenuItem}})
            }
            console.error("loadMenuItemAction()", error);
        }
    }

export const saveMenuItemAction = (): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCurrentLoading(state) || selectCurrentItemSaving(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const _item = selectCurrentItem(state);
            const currentMenu = selectCurrentMenu(state);
            if (!_item.title || !currentMenu.id) {
                return;
            }
            _item.parentId = currentMenu.id;
            if (_item.id === 0) {
                const items = selectItemList(state);
                _item.priority = items.reduce((max, item) => item.priority > max ? item.priority : max , 0) + 1;
            }
            dispatch({type: saveMenuItemPending});
            const item = await postMenuItemAPI(site.name, _item);
            if (!item) {
                return dispatch({
                    type: saveMenuItemRejected,
                    payload: {error: new Error('Menu item not found'), context: saveMenuItem}
                });
            }
            dispatch({type: saveMenuItemResolved, payload: {item, clearContext: saveMenuItem}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveMenuItemAction()", error.message);
                return dispatch({type: saveMenuItemRejected, payload: {error, context: saveMenuItem}})
            }
            console.error("saveMenuItemAction()", error);
        }
    }

export const deleteMenuItemAction = (): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCurrentLoading(state) || selectCurrentItemSaving(state)) {
                return;
            }
            dispatch({type: deleteMenuItemPending});
            const site = currentSiteSelector(state);
            const _item = selectCurrentItem(state);
            if (!_item.id) {
                return;
            }
            const items = await deleteMenuItemAPI(site.name, _item);
            dispatch({type: deleteMenuItemResolved, payload: {items, clearContext: deleteMenuItem}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("deleteMenuItemAction()", error.message);
                return dispatch({type: deleteMenuItemRejected, payload: {error, context: deleteMenuItem}});
            }
            console.error("deleteMenuItemAction()", error);
        }
    }

const selectedReducer = (state: EditableMenuItem = defaultMenuItem, action: MenuAction): EditableMenuItem => {
    const {type, payload} = action;
    switch (type) {
    case menuItemSelected:
        if (payload?.item) {
            return {...payload.item};
        }
        return {...defaultMenuItem};
    case loadMenuResolved:
        if (payload?.menu && payload.menu?.items) {
            const [item] = payload.menu?.items?.filter(item => item.id === state.id);
            if (item) {
                return {...item};
            }
            return {...defaultMenuItem, parentId: payload.menu.id};
        }
        return {...defaultMenuItem, parentId: payload?.menu?.id || 0};
    case loadMenuItemResolved:
    case saveMenuItemResolved:
        if (payload?.item) {
            return {...payload.item};
        }
        return {...defaultMenuItem}
    case menuItemUpdated:
        if (payload?.props) {
            return {
                ...state,
                ...payload.props,
                changed: true,
            }
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case loadMenuItemPending:
        return true;
    case loadMenuItemResolved:
    case loadMenuItemRejected:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case saveMenuItemPending:
        return true;
    case saveMenuItemResolved:
    case saveMenuItemRejected:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    selected: selectedReducer,
    loading: loadingReducer,
    saving: savingReducer,
});
