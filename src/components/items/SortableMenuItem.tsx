import {MenuItem} from "b2b-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {MenuItemRender} from "@/components/items/MenuItemRender";
import React from "react";
import {Button} from "react-bootstrap";
import styled from "@emotion/styled";
import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";

const SortableMenuItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    padding: 0.1rem 0
`

export interface SortableMenuItemProps {
    menuItem: MenuItem;
    active?: boolean;
}

export function SortableMenuItem({menuItem, active}: SortableMenuItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef
    } = useSortable({id: menuItem.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={{...style}} {...attributes}>
            <ThumbedMenuItem setActivatorNodeRef={setActivatorNodeRef} listeners={listeners} menuItem={menuItem} active={active} />
        </div>
    )
}

export interface ThumbedMenuItemProps extends SortableMenuItemProps {
    setActivatorNodeRef?: (element: HTMLElement|null) => void;
    listeners?: SyntheticListenerMap|undefined;
}
export function ThumbedMenuItem({menuItem, active, setActivatorNodeRef, listeners}:ThumbedMenuItemProps) {
    return (
        <SortableMenuItemContainer>
            <Button size="sm" variant="outline-secondary" style={{cursor: 'grab'}} {...listeners} ref={setActivatorNodeRef} >
                <span className="bi-arrow-down-up" aria-label="Drag to sort" />
            </Button>
            <MenuItemRender item={menuItem} active={active}/>
        </SortableMenuItemContainer>
    )

}
