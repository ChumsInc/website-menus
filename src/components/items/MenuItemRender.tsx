import {useCallback} from 'react';
import styled from "@emotion/styled";
import type {MenuItem} from "b2b-types";
import {Button} from "react-bootstrap";
import type {Variant} from "react-bootstrap/types";
import {generatePath, useNavigate, useParams} from "react-router";

export const MenuItemContainer = styled.div`
    flex: 1 1 auto;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bs-body-bg);
    
    & > .btn:last-child {
        border-right: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-left: 1px solid var(--bs-border-color);
    }
`

export const MenuItemTitle = styled('div')`
    padding-left: 1rem;
    text-align: left;
    flex: 1 1 auto;
`

export interface MenuItemProps {
    active?: boolean;
    item: MenuItem;
}

export function MenuItemRender({
                                   active,
                                   item,
                               }: MenuItemProps) {
    const navigate = useNavigate();
    const params = useParams<'menuId'>();
    const btnVariant: Variant = active ? 'secondary' : 'outline-secondary';

    const selectMenuHandler = useCallback(() => {
        if (item.menu?.id) {
            navigate(generatePath('/:menuId', {menuId: item.menu.id.toString()}))
        }
    }, [item.menu, navigate]);

    const clickHandler = useCallback(() => {
        if (!params.menuId || params.menuId === '0') {
            return;
        }
        navigate(generatePath('/:menuId/:itemId', {menuId: params.menuId!, itemId: item.id.toString()},))
    }, [item.id, navigate, params.menuId]);


    return (
        <MenuItemContainer>
            <span className="text-secondary text-end" style={{flex: '0 0 3rem'}}>[{item.id}]</span>
            {!!item.menu && (
                <MenuItemTitle>
                    <Button type="button" size="sm" variant="link"
                            onClick={selectMenuHandler}>
                        {item.title}
                        <span className="bi-box-arrow-in-down ms-3" aria-label="Edit Item"/>
                    </Button>
                </MenuItemTitle>
            )}
            {!item.menu && (
                <MenuItemTitle title={item.url}>
                    {item.title} <span className="bi-link-45deg" aria-label="External Link"/>
                </MenuItemTitle>
            )}
            {!item.status && <span className="bi-lightbulb-off text-danger" aria-label="Item Disabled"/>}
            {item.status && !!item.menu && !item.menu.status &&
                <span className="bi-lightbulb-off text-warning" aria-label="Sub-Item Disabled"/>}
            <Button type="button" onClick={clickHandler} size="sm" variant={btnVariant}>
                Edit Item
            </Button>
        </MenuItemContainer>
    )

}
