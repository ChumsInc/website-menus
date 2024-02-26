import React, {useEffect} from 'react';
import AlertList from "../ducks/alerts/AlertList";
import MenuList from "../ducks/menus/MenuList";
import MenuEditor from "../ducks/menu/MenuEditor";
import MenuItemList from "../ducks/items/MenuItemList";
import ItemEditor from "../ducks/item/ItemEditor";
import {loadKeywords} from "../ducks/keywords";
import {useAppDispatch} from "./hooks";

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadKeywords());
    }, [])

    return (
        <div>
            <AlertList/>
            <div className="row">
                <div className="col-4">
                    <MenuList/>
                </div>
                <div className="col-4">
                    <h2>Edit Menu</h2>
                    <MenuEditor/>
                    <MenuItemList/>
                </div>
                <div className="col-4">
                    <h2>Edit Item</h2>
                    <ItemEditor/>
                </div>
            </div>
        </div>
    )
}

export default React.memo(App);
