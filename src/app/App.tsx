import {useEffect} from 'react';
import {useAppDispatch} from "./configureStore.ts";
import {HashRouter, Route, Routes} from 'react-router'
import AppContent from "@/app/AppContent";
import Alert from "react-bootstrap/Alert";
import EditMenuContent from "@/components/menu/EditMenuContent.tsx";
import EditItemContent from "@/components/item/EditItemContent.tsx";
import {loadKeywords} from "@/ducks/keywords";

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadKeywords());
    }, [dispatch])

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
