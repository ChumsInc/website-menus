import React, {useEffect} from 'react';
import {closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {MenuItem} from "b2b-types";
import {useAppSelector} from "@/app/hooks";
import {selectCurrentMenuItem} from "@/ducks/item";
import {SortableMenuItem, ThumbedMenuItem} from "@/components/items/SortableMenuItem";

export interface SortableMenuItemsProps {
    list: MenuItem[];
    onSortChange: (items: MenuItem[]) => void;
}

export default function SortableMenuItems({list, onSortChange}: SortableMenuItemsProps) {
    const currentItem = useAppSelector(selectCurrentMenuItem);
    const [items, setItems] = React.useState<MenuItem[]>(list);
    const [draggingItem, setDraggingItem] = React.useState<MenuItem | null>(null);

    useEffect(() => {
        setItems(list);
    }, [list]);

    useEffect(() => {
        onSortChange(items);
    }, [items]);


    const handleDragStart = (ev: DragStartEvent) => {
        const [item] = list.filter(item => item.id === ev.active.id)
        setDraggingItem(item ?? null);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        // console.log(event);
        const {active, over} = event;
        if (!over) {
            return;
        }
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((el) => el.id === active.id);
                const newIndex = items.findIndex((el) => el.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            })
        }
        setDraggingItem(null);
    }

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} collisionDetection={closestCenter}>
            <SortableContext items={items}>
                {items.map(item => <SortableMenuItem key={item.id} menuItem={item}
                                                     active={item.id === currentItem?.id}/>)}
            </SortableContext>
            <DragOverlay>
                {draggingItem &&
                    <ThumbedMenuItem menuItem={draggingItem} active={draggingItem.id === currentItem?.id}/>}
            </DragOverlay>
        </DndContext>
    )
}

