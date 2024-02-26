import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {
    FormCheck,
    SortableTable,
    SortableTableField,
    SortProps,
    SpinnerButton,
    TablePagination
} from "chums-components";
import {Menu} from "b2b-types";
import {selectCurrentMenu} from "../menu/selectors";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectMenuListLoaded,
    selectMenuListLoading,
    selectMenuListShowInactive,
    selectMenuListSort,
    selectSortedMenuList
} from "./selectors";
import {loadMenuList, setMenuListSort, toggleShowInactive} from "./actions";
import {loadMenu} from "../menu/actions";

const fields: SortableTableField<Menu>[] = [
    {field: "id", title: 'ID', sortable: true},
    {field: "title", title: 'Title', sortable: true},
    {field: "description", title: 'Description', sortable: true},
]

const rowClassName = (row: Menu) => {
    return {'text-danger': !row.status};
}
const MenuList = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectMenuListLoading);
    const loaded = useAppSelector(selectMenuListLoaded);
    const showInactive = useAppSelector(selectMenuListShowInactive);
    const list = useAppSelector(selectSortedMenuList);
    const selected = useSelector(selectCurrentMenu);
    const sort = useAppSelector(selectMenuListSort)
    const [page, setPage] = useState<number>(0);
    const rowsPerPage = 25;

    useEffect(() => {
        dispatch(loadMenuList());
    }, []);

    useEffect(() => {
        setPage(0);
    }, [list]);

    const reloadHandler = () => {
        dispatch(loadMenuList());
    }

    const filterInactiveHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked));
    }

    const selectHandler = (row: Menu) => {
        dispatch(loadMenu(row.id))
    }

    const sortChangeHandler = (sort: SortProps<Menu>) => {
        dispatch(setMenuListSort(sort));
    }

    return (
        <div>
            <div className="row g-3 align-items-baseline mb-1">
                <div className="col">
                    <FormCheck label={'Show Inactive'} checked={showInactive} onChange={filterInactiveHandler}
                               type={"checkbox"} inline/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" color="primary" size="sm" spinning={loading}
                                   onClick={reloadHandler}>Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable keyField={'id'} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} size="xs"
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           rowClassName={rowClassName}
                           onSelectRow={selectHandler} selected={(row) => selected?.id === row.id}/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={list.length} />
        </div>
    )
}

export default MenuList;
