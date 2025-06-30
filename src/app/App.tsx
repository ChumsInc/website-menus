import React, {useEffect} from 'react';
import {loadKeywords} from "@/ducks/keywords";
import {useAppDispatch} from "./hooks";
import {HashRouter, Route, Routes} from 'react-router'
import AppContent from "@/app/AppContent";
import Alert from "react-bootstrap/Alert";
import EditMenuContent from "@/app/EditMenuContent";
import EditItemContent from "@/components/item/EditItemContent";

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadKeywords());
    }, [])

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<AppContent/>}>
                    <Route index element={<Alert variant="info">Select a Menu</Alert>}/>
                    <Route path=":menuId" element={<EditMenuContent/>}>
                        <Route index element={<Alert variant="info">Select an Item</Alert>}/>
                        <Route path=":itemId" element={<EditItemContent/>}/>
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    )
}
