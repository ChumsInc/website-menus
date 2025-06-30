import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Menu} from "b2b-types";
import {loadMenu, removeMenu, saveMenu} from "@/ducks/menu/actions";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import Alert from "react-bootstrap/Alert";
import {ProgressBar} from "react-bootstrap";
import {generatePath, useNavigate, useParams} from "react-router";
import {isMenuPayload, selectCurrentMenu, selectCurrentMenuStatus} from "@/ducks/menu";
import isEqual from "react-fast-compare";
import MenuEditorUI from "@/components/MenuEditorUI";
import {defaultMenu} from "@/ducks/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editableMenu = ({id, items, parents, ...rest}: Menu) => {
    // discard id, items, parents attributes
    return rest;
}

export default function MenuEditor() {
    const dispatch = useAppDispatch();
    const params = useParams<'menuId'>();
    const navigate = useNavigate();
    const current = useSelector(selectCurrentMenu);
    const status = useAppSelector(selectCurrentMenuStatus);
    const [menu, setMenu] = useState<Menu>(current);
    const [changed, setChanged] = useState(false);

    const isChanged = useCallback((menu: Menu) => {
        return !isEqual(editableMenu(menu), editableMenu(current));
    }, [current])

    useEffect(() => {
        setMenu(current);
        setChanged(false);
    }, [current]);


    const changeHandler = (menu: Menu) => {
        setChanged(isChanged(menu));
        setMenu(menu);
    }

    const submitHandler = async () => {
        if (!menu) {
            return;
        }
        const action = await dispatch(saveMenu(menu));
        if (menu.id === 0 && isMenuPayload(action.payload)) {
            navigate(generatePath("/:menuId", {menuId: action.payload.id.toString()}));
        }
    }

    const newMenuHandler = () => {
        if (params.menuId === '0') {
            setMenu({...defaultMenu});
        }
        navigate(generatePath("/:menuId", {menuId: '0'}));
    }

    const deleteMenuHandler = async () => {
        await dispatch(removeMenu(menu.id));
        navigate('/');
    }

    const reloadHandler = () => {
        dispatch(loadMenu(menu.id))
    }

    if (!menu) {
        return null;
    }

    return (
        <div className="mb-1">
            <MenuEditorUI menu={menu} status={status}
                          onChangeMenu={changeHandler} onSave={submitHandler} onReload={reloadHandler}
                          onNewMenu={newMenuHandler} onDeleteMenu={deleteMenuHandler}/>
            {changed && <Alert variant="warning">Don&apos;t forget to save your changes</Alert>}
            {status !== 'idle' && <ProgressBar animated striped now={100}/>}
        </div>
    )
}
