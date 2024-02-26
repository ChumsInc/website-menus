import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {MenuItem} from "b2b-types";
import {SpinnerButton} from "chums-components";
import {prioritySort, saveItemSort, selectCurrentSort, selectItemList, selectItemsStatus, sortOrderKey} from "./index";
import ItemCard from "./ItemCard";
import {useAppDispatch} from "../../app/hooks";
import {selectCurrentMenuItemStatus} from "../item/selectors";


const MenuItemList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectItemList);
    const itemsActionStatus = useSelector(selectItemsStatus);
    const itemActionStatus = useSelector(selectCurrentMenuItemStatus);
    const currentSort = useSelector(selectCurrentSort);
    const [items, setItems] = useState<MenuItem[]>(list);
    const [sortChanged, setSortChanged] = useState(false);

    useEffect(() => {
        setItems([...list].sort(prioritySort))
        setSortChanged(false);
    }, [list]);

    useEffect(() => {
        if (itemsActionStatus === 'idle' && itemActionStatus === 'idle') {
            // populate state after loading or saving
            setItems([...list].sort(prioritySort));
            setSortChanged(false);
        }
    }, [itemsActionStatus, itemActionStatus])

    const onMoveItem = (dragIndex: number, hoverIndex: number) => {
        const _sorted = [...items];
        const movingItem = _sorted[dragIndex];
        _sorted.splice(dragIndex, 1);
        _sorted.splice(hoverIndex, 0, movingItem);
        const sorted = _sorted.map((item, index) => ({...item, priority: index})).sort(prioritySort)
        setItems(sorted);
        setSortChanged(sortOrderKey(sorted) !== currentSort);
    }

    const onSave = () => dispatch(saveItemSort(items));

    return (
        <>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <h3>Items</h3>
                </div>
                <div className="col" />
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" color={sortChanged ? 'warning' : "primary"}
                                   onClick={onSave}
                                   spinning={itemsActionStatus === 'saving-sort'}
                                   disabled={items.length === 0 || itemActionStatus !== 'idle' || itemsActionStatus !== 'idle'}>
                        Save Current Sort
                    </SpinnerButton>
                </div>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="sortable-item-list">
                    {items.map((item, index) => (
                        <ItemCard key={item.id} item={item} index={index} moveItem={onMoveItem}/>
                    ))}
                </div>
            </DndProvider>
        </>
    )
}

export default MenuItemList;
