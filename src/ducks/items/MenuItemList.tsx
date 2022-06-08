import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {MenuItem} from "b2b-types";
import {SpinnerButton} from "chums-ducks";
import {
    prioritySort,
    saveItemSortAction,
    selectCurrentSort,
    selectItemList,
    selectItemsLoading,
    selectItemsSaving, sortOrder
} from "./index";
import {selectCurrentItemSaving} from "../item";
import {selectCurrentMenuSaving} from "../menu/selectors";
import ItemCard from "./ItemCard";



const MenuItemList: React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(selectItemList);
    const loading = useSelector(selectItemsLoading);
    const savingItem = useSelector(selectCurrentItemSaving);
    const savingMenu = useSelector(selectCurrentMenuSaving);
    const savingSort = useSelector(selectItemsSaving);
    const currentSort = useSelector(selectCurrentSort);
    const [items, setItems] = useState<MenuItem[]>(list);
    const [sortChanged, setSortChanged] = useState(false);

    useEffect(() => {
        setItems(list.sort(prioritySort))
        setSortChanged(false);
    }, [list]);

    useEffect(() => {
        if (!loading && !savingSort) {
            // populate state after loading or saving
            setItems(list.sort(prioritySort));
            setSortChanged(false);
        }
    }, [loading, savingSort])

    const onMoveItem = (dragIndex: number, hoverIndex: number) => {
        const sorted = [...items];
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        let priority = 0;
        sorted.forEach(item => {
            item.priority = priority;
            priority += 1;
        });
        setItems(sorted.sort(prioritySort));
        setSortChanged(sortOrder(sorted) !== currentSort);
    }

    const onSave = () => dispatch(saveItemSortAction(items));

    return (
        <>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" color={sortChanged ? 'warning' : "primary"}
                                   spinning={savingSort}
                                   disabled={loading || savingMenu || savingItem || savingSort}>
                        Save Current Sort
                    </SpinnerButton>
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="sortable-item-list">
                    {items.map((item, index) => (
                        <ItemCard key={item.id} item={item} index={index} moveItem={onMoveItem} />
                    ))}
                </div>
            </DndProvider>
        </>
    )
}

export default MenuItemList;
