import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {
    defaultMenu,
    loadMenu,
    loadMenuPending,
    loadMenuRejected,
    loadMenuResolved,
    MenuAction,
    menuSelected, MenuThunkAction,
    menuUpdated,
    saveSort,
    saveSortRejected
} from "./actionTypes";
import {selectCurrentMenu, selectCurrentMenuLoading} from "./selectors";
import {currentSiteSelector} from "chums-ducks";
import {getMenuAPI, postMenuAPI} from "../../api/menu";
import {Menu, MenuItem} from "b2b-types";


export const menuUpdatedAction = (props: Partial<Menu>) => ({type: menuUpdated, payload: {props}});

export const loadMenuAction = (id?: number): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            if (!id) {
                dispatch({type: menuSelected, payload: {menu: defaultMenu}});
                return;
            }
            const state = getState();
            if (selectCurrentMenuLoading(state)) {
                return;
            }
            const {name: site} = currentSiteSelector(state);
            dispatch({type: loadMenuPending});
            const menu = await getMenuAPI(site, id);
            dispatch({type: loadMenuResolved, payload: {menu: menu || defaultMenu}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadMenuAction()", error.message);
                return dispatch({type: loadMenuRejected, payload: {error, context: loadMenu}})
            }
            console.error("loadMenuAction()", error);
        }
    }

export const saveMenuAction = (): MenuThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCurrentMenuLoading(state)) {
                return;
            }
            const {name: site} = currentSiteSelector(state);
            const _menu = selectCurrentMenu(state);
            if (!_menu.title) {
                return;
            }
            dispatch({type: loadMenuPending});
            const menu = await postMenuAPI(site, _menu);
            dispatch({type: loadMenuResolved, payload: {menu: menu || defaultMenu}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadMenuAction()", error.message);
                return dispatch({type: loadMenuRejected, payload: {error, context: loadMenu}});
            }
            console.error("loadMenuAction()", error);
        }
    }

export const saveMenuSort = (): MenuThunkAction =>
    async (dispatch, getState) => {
        try {

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("menuSaveSort()", error.message);
                return dispatch({type: saveSortRejected, payload: {error, context: saveSort}})
            }
            console.error("menuSaveSort()", error);
        }
    }

