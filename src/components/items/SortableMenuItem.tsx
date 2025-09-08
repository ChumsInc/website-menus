import type {MenuItem} from "b2b-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {MenuItemRender} from "@/components/items/MenuItemRender";
import {Button} from "react-bootstrap";
import styled from "@emotion/styled";
import type {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import classNames from "classnames";

const SortableMenuItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    padding: 0 0;
    margin: 0.25rem 0;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.25rem;
    background-color: var(--bs-body-bg);
    &.active {
        border-color: var(--bs-primary);
    }
    &:hover {
        border-color: var(--bs-primary);
    }
    &:focus-within {}
    & > .btn.drag-thumb {
        border-left: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-right: 1px solid var(--bs-border-color);
        cursor: grab;
    }
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
        <SortableMenuItemContainer className={classNames('sortable-item', {active: active ? 'active' : ''})}>
            <Button size="sm" variant="outline-secondary" className="drag-thumb" {...listeners} ref={setActivatorNodeRef} >
                <span className="bi-arrow-down-up" aria-label="Drag to sort" />
            </Button>
            <MenuItemRender item={menuItem} active={active}/>
        </SortableMenuItemContainer>
    )

}
