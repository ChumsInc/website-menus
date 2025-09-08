import {useCallback, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import type {MenuItem} from "b2b-types";
import {selectCurrentSort, selectItemsStatus, selectSortedItems} from "@/ducks/items";
import {selectCurrentMenuItemStatus} from "@/ducks/item";
import {useAppDispatch} from "@/app/configureStore";
import {Button, ProgressBar} from "react-bootstrap";
import SortableMenuItems from "@/components/items/SortableMenuItems";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {sortOrderKey} from "@/ducks/items/utils.ts";
import {saveItemSort} from "@/ducks/items/actions.ts";


export default function MenuItemList() {
    const dispatch = useAppDispatch();
    const list = useSelector(selectSortedItems);
    const itemsActionStatus = useSelector(selectItemsStatus);
    const itemActionStatus = useSelector(selectCurrentMenuItemStatus);
    const currentSort = useSelector(selectCurrentSort);
    const [items, setItems] = useState<MenuItem[]>(list);
    const [sorted, setSorted] = useState(currentSort);

    const onSortChange = useCallback((items: MenuItem[]) => {
        setItems(items);
        setSorted(sortOrderKey(items))
    }, [])

    useEffect(() => {
        setItems(list);
        setSorted(sortOrderKey(list))
    }, [list]);


    const onSave = () => {
        dispatch(saveItemSort(items));
    }

    const sortChanged = currentSort !== sorted;

    return (
        <div>
            <Row className="g-3 align-items-baseline mb-3">
                <Col xs="auto">
                    <h3>Items</h3>
                </Col>
                <Col/>
                <Col xs="auto">
                    <Button type="button" size="sm" variant={sortChanged ? 'warning' : "primary"}
                            onClick={onSave}
                            disabled={items.length === 0 || itemActionStatus !== 'idle' || itemsActionStatus !== 'idle'}>
                        Save Current Sort
                    </Button>
                </Col>
            </Row>
            {itemsActionStatus === 'saving-sort' && (<ProgressBar striped animated now={100}/>)}

            <SortableMenuItems list={list} onSortChange={onSortChange}/>
        </div>
    )
}
