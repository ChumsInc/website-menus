import React, {useRef} from 'react';
import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';
import {XYCoord} from "dnd-core";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {currentSiteSelector} from "chums-ducks";
// import "./ItemCard.scss";
import {Menu, MenuItem} from "b2b-types";
import {loadMenuItemAction, selectCurrentItem, selectItemAction} from "../item";
import {loadMenuAction} from "../menu/actions";


interface ItemCardProps {
    item: MenuItem,
    index: number,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

const style = {
    cursor: 'move',
}

const ItemCard: React.FC<ItemCardProps> = ({item, index, moveItem}) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const selected = useSelector(selectCurrentItem);
    const site = useSelector(currentSiteSelector);

    const [collectedProps, drop] = useDrop({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: unknown, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = (item as DragItem).index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && (hoverClientX < hoverMiddleX || hoverClientY < hoverMiddleY)) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            (item as DragItem).index = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: 'item',
        item: () => {
            return {item, index};
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const className = {
        dragging: isDragging,
        'text-muted': !item.status,
        'text-warning': item.menu && !item.menu?.status,
        'text-primary': !!item.url && !item.menuId,
        'text-success': !item.url && !!item.menuId,
        'text-dark': !!item.url && !!item.menuId,
    };
    const btnClassName = {
        'btn-light': selected.id === item.id,
        'btn-dark': selected.id !== item.id
    };

    const clickHandler = () => {
        dispatch(loadMenuItemAction(item.id));
    };

    const selectMenuHandler = (id?:number) => dispatch(loadMenuAction(id));

    return (
        <div ref={ref} style={{...style, opacity}}
             className={classNames("sortable-item", className)}>
            <div className="item-title" title={item.url}>
                <span className={classNames("me-3", {'bi-toggle2-off': !item.status, 'bi-toggle2-on': !!item.status} )}/>
                {item.title}
            </div>
            {!!item.menu && <button  type="button" className="btn btn-sm btn-outline-dark" onClick={() => selectMenuHandler(item.menu?.id)}>{item.menu.title}<span className="ms-1 bi-arrow-up-circle" /></button>}
            <button type="button" onClick={clickHandler} className={classNames("btn btn-sm", btnClassName)}>
                Edit Item
            </button>
        </div>
    )
}

export default ItemCard;
