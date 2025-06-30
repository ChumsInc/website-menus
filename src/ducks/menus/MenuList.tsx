import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {useSelector} from "react-redux";
import {Menu} from "b2b-types";
import {selectCurrentMenu, setCurrentMenu} from "@/ducks/menu";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {
    selectMenuListLoading,
    selectMenuListShowInactive,
    selectMenuListSort,
    selectSortedMenuList,
    setMenuListSort,
    toggleShowInactive
} from "./index";
import {loadMenuList} from "./actions";
import {SortableTable, SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {SortProps} from "chums-types";
import {Button, FormCheck, ProgressBar} from "react-bootstrap";
import {generatePath, useNavigate, useSearchParams} from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    const showInactive = useAppSelector(selectMenuListShowInactive);
    const list = useAppSelector(selectSortedMenuList);
    const selected = useSelector(selectCurrentMenu);
    const sort = useAppSelector(selectMenuListSort)
    const [page, setPage] = useState<number>(0);
    const rowsPerPage = 25;
    const idShowInactive = useId();
    const [, setSearchParams] = useSearchParams();

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
        navigate(generatePath(':menuId', {menuId: row.id.toString()}))
    }

    const sortChangeHandler = (sort: SortProps<Menu>) => {
        dispatch(setMenuListSort(sort));
    }

    return (
        <div>
            <Row className="row g-3 align-items-baseline mb-1">
                <Col>
                    <FormCheck label={'Show Inactive'} id={idShowInactive} checked={showInactive}
                               onChange={filterInactiveHandler}
                               type={"checkbox"} inline/>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="primary" size="sm" disabled={loading}
                            onClick={reloadHandler}>Reload</Button>
                </Col>
            </Row>
            {loading && <ProgressBar animated striped now={100}/>}
            <SortableTable keyField={'id'} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           rowClassName={rowClassName}
                           onSelectRow={selectHandler} selected={(row) => selected?.id === row.id}/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage} count={list.length}/>
        </div>
    )
}

export default MenuList;
