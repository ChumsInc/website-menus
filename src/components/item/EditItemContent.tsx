import React, {useEffect} from 'react';
import {useParams} from "react-router";
import ItemEditor from "@/ducks/item/ItemEditor";
import {loadMenuItem} from "@/ducks/item/actions";
import {useAppDispatch} from "@/app/hooks";

export default function EditItemContent() {
    const dispatch = useAppDispatch();
    const params = useParams<'menuId'|'itemId'>();

    useEffect(() => {
        if (!params.menuId || !params.itemId) {
            return;
        }
        dispatch(loadMenuItem({parentId: params.menuId, id: params.itemId}))
    }, [params]);

    return (
        <ItemEditor/>
    )
}
