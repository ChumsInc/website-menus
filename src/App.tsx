import React, {useEffect} from 'react';
import {AlertList, currentSiteSelector} from "chums-ducks";
import MenuList from "./ducks/menus/MenuList";
import MenuEditor from "./ducks/menu/MenuEditor";
import MenuItemList from "./ducks/items/MenuItemList";
import ItemEditor from "./ducks/item/ItemEditor";
import {useDispatch, useSelector} from "react-redux";
import {loadKeywords, loadKeywordsAction} from "./ducks/keywords";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const site = useSelector(currentSiteSelector);

    useEffect(() => {
        dispatch(loadKeywordsAction(site.name));
    }, [site])

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
                    <ItemEditor />
                </div>
            </div>
        </div>
    )
}

export default React.memo(App);
