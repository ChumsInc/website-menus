import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {currentSiteSelector, FormCheck, SiteSelect, SortableTable, SpinnerButton, tableAddedAction} from "chums-ducks";
import {
    loadMenusAction,
    MENU_TABLE_KEY, MenuTableField,
    selectFilterInactive,
    selectMenusLoaded,
    selectMenusLoading, selectSortedMenuList,
    toggleFilterInactiveAction
} from "./index";
import {loadMenuAction} from "../menu/actions";
import {Menu} from "b2b-types";
import {selectCurrentMenu} from "../menu/selectors";

const fields:MenuTableField[] = [
    {field: "id", title: 'ID', sortable: true},
    {field: "title", title: 'Title', sortable: true},
    {field: "description", title: 'Description', sortable: true},
]

const rowClassName = (row:Menu) => {
    return {'text-danger': !row.status};
}
const MenuList:React.FC = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectMenusLoading);
    const loaded = useSelector(selectMenusLoaded);
    const filterInactive = useSelector(selectFilterInactive);
    const list = useSelector(selectSortedMenuList);
    const selected = useSelector(selectCurrentMenu);

    useEffect(() => {
        if (!loading) {
            dispatch(loadMenusAction());
        }
        dispatch(tableAddedAction({key: MENU_TABLE_KEY, field: 'id', ascending: true}));
    }, []);

    useEffect(() => {
        if (!loading) {
            dispatch(loadMenusAction());
        }
    }, [loaded])

    const reloadHandler = () => {
        dispatch(loadMenusAction());
    }

    const filterInactiveHandler = () => {
        dispatch(toggleFilterInactiveAction());
    }

    const selectHandler = (row:Menu) => {
        dispatch(loadMenuAction(row.id))
    }

    return (
        <div>
            <div className="row g-3 align-items-baseline mb-1">
                <div className="col-auto">
                    <SiteSelect />
                </div>
                <div className="col">
                    <FormCheck label={'Show Inactive'} checked={!filterInactive} onClick={filterInactiveHandler} type={"checkbox"} inline />
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" color="primary" size="sm" spinning={loading} onClick={reloadHandler}>Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable tableKey={MENU_TABLE_KEY} keyField={'id'} fields={fields} data={list} size="xs"
                           rowClassName={rowClassName}
                           onSelectRow={selectHandler} selected={(row) => selected.id === row.id}/>
        </div>
    )
}

export default MenuList;
