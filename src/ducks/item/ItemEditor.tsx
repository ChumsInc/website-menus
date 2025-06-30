import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {MenuItem} from "b2b-types";
import {selectCurrentMenu} from "@/ducks/menu";
import {defaultMenuItem} from "../utils";
import URLBuilder from "../keywords/URLBuilder";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {selectCurrentMenuItem, selectCurrentMenuItemStatus} from "./index";
import {removeMenuItem, saveMenuItem} from "./actions";
import Alert from 'react-bootstrap/Alert'
import {ProgressBar} from "react-bootstrap";
import isEqual from "react-fast-compare";
import ItemEditorUI from "@/ducks/item/ItemEditorUI";
import {generatePath, useNavigate} from "react-router";

const editableItem = ({...rest}: MenuItem): Omit<MenuItem, 'id' | 'menu'> => {
    return rest;
}

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const parentMenu = useAppSelector(selectCurrentMenu);
    const current = useAppSelector(selectCurrentMenuItem);
    const actionStatus = useSelector(selectCurrentMenuItemStatus);
    const [item, setItem] = useState<MenuItem>(current ?? {...defaultMenuItem});
    const [changed, setChanged] = useState(false);

    const isChanged = useCallback((item: MenuItem) => {
        return !isEqual(editableItem(current ?? defaultMenuItem), editableItem(item));
    }, [current])

    const onChangeURL = (url: string) => {
        const next = {...item, url};
        setChanged(isChanged(next));
    }

    useEffect(() => {
        setChanged(false);
        setItem(current ?? {...defaultMenuItem});
    }, [current]);

    const changeHandler = (item: MenuItem) => {
        setChanged(isChanged(item));
        setItem(item);
    }

    const newItemHandler = () => {
        if (!parentMenu) {
            return;
        }
        navigate(generatePath('/:menuId/:itemId', {menuId: `${parentMenu.id}`, itemId: '0'}));
    }

    const deleteHandler = async () => {
        if (!item) {
            return;
        }
        await dispatch(removeMenuItem(item));
        navigate(generatePath('/:menuId', {menuId: `${parentMenu.id}`}));
    }

    const submitHandler = () => {
        if (!item || !item.parentId) {
            return
        }
        dispatch(saveMenuItem(item));
    }

    if (!item) {
        return null;
    }
    return (
        <div>
            <ItemEditorUI item={item}
                          onChangeItem={changeHandler}
                          onSaveItem={submitHandler}
                          onNewItem={newItemHandler}
                          onDeleteItem={deleteHandler}/>
            {actionStatus !== 'idle' && <ProgressBar animated striped now={100}/>}
            {changed && <Alert variant="warning">Don&#39;t forget to save.</Alert>}
            <URLBuilder url={item.url} onSelectUrl={onChangeURL}/>
        </div>
    )
}

export default ItemEditor;
