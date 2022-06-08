import {combineReducers} from "redux";
import {Keyword} from "b2b-types";
import {
    ActionInterface,
    ActionPayload,
    dismissContextAlertAction,
    selectAlertListByContext,
    siteSelected, SorterProps
} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {apiActionHelper} from "../utils";
import {fetchKeywords} from "../../api/keywords";


export interface KeywordsPayload extends ActionPayload {
    list?: Keyword[],
}

export interface KeywordsAction extends ActionInterface {
    payload?: KeywordsPayload,
}

interface KeywordsThunkAction extends ThunkAction<any, RootState, unknown, KeywordsAction> {
}

export const loadKeywords = 'keywords/load';
export const [loadKeywordsPending, loadKeywordsResolved, loadKeywordsRejected] = apiActionHelper(loadKeywords);

export const keywordTitleSorter = (a:Keyword, b:Keyword) => a.title.toLowerCase() === b.title.toLowerCase()
    ? (a.keyword > b.keyword ? 1 : -1)
    : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);

export const selectKeywordsList = (state: RootState) => state.keywords.list;
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;
export const selectKeywordsLoaded = (state: RootState) => state.keywords.loaded;

export const loadKeywordsAction = (site: string): KeywordsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectKeywordsLoading(state)) {
                return;
            }
            dispatch({type: loadKeywordsPending});
            const list = await fetchKeywords(site);
            dispatch({type: loadKeywordsResolved, payload: {list}});
            if (selectAlertListByContext(loadKeywords).length) {
                dispatch(dismissContextAlertAction(loadKeywords));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadMenusAction()", error.message);
                return dispatch({type: loadKeywordsRejected, payload: {error, context: loadKeywords}})
            }
            console.error("loadMenusAction()", error);
        }
    }

const listReducer = (state: Keyword[] = [], action: KeywordsAction): Keyword[] => {
    const {type, payload} = action;
    switch (type) {
    case loadKeywordsResolved:
        if (payload?.list) {
            return [...payload.list.sort((a, b) => a.keyword > b.keyword ? 1 : -1)];
        }
        return [];
    case siteSelected:
        return [];
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: KeywordsAction): boolean => {
    switch (action.type) {
    case loadKeywordsPending:
        return true;
    case loadKeywordsResolved:
    case loadKeywordsRejected:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = false, action: KeywordsAction): boolean => {
    switch (action.type) {
    case loadKeywordsResolved:
        return true;
    case siteSelected:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
})

