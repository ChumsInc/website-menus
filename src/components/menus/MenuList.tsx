import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import type {Menu} from "b2b-types";
import {selectCurrentMenu} from "@/ducks/menu";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectMenuListLoading, selectMenuListSort, selectSortedMenuList, setMenuListSort} from "@/ducks/menus";
import {loadMenuList} from "@/ducks/menus/actions.ts";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import type {SortProps} from "chums-types";
import {ProgressBar} from "react-bootstrap";
import {generatePath, useNavigate} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import errorBoundaryFallback from "@/app/errorBoundayFallback.tsx";

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
    const navigate = useNavigate();
    const loading = useAppSelector(selectMenuListLoading);
    const list = useAppSelector(selectSortedMenuList);
    const selected = useSelector(selectCurrentMenu);
    const sort = useAppSelector(selectMenuListSort)
    const [page, setPage] = useState<number>(0);
    const rowsPerPage = 25;

    useEffect(() => {
        dispatch(loadMenuList());
    }, [dispatch]);

    useEffect(() => {
        setPage(0);
    }, [list]);

    const selectHandler = (row: Menu) => {
        navigate(generatePath(':menuId', {menuId: row.id.toString()}))
    }

    const sortChangeHandler = (sort: SortProps<Menu>) => {
        dispatch(setMenuListSort(sort));
    }

    return (
        <ErrorBoundary fallbackRender={errorBoundaryFallback}>
            <div>
                {loading && <ProgressBar animated striped now={100}/>}
                <SortableTable keyField={'id'} fields={fields}
                               data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                               currentSort={sort}
                               onChangeSort={sortChangeHandler}
                               rowClassName={rowClassName}
                               onSelectRow={selectHandler} selected={(row) => selected?.id === row.id}/>
                <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={list.length}/>
            </div>
        </ErrorBoundary>
    )
}

export default MenuList;
