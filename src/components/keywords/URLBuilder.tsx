import React, {type ChangeEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {keywordTitleSorter, selectKeywordsList} from "@/ducks/keywords";
import FormColumn from "@/components/common/FormColumn.tsx";
import type {Keyword} from "b2b-types";
import InactiveKeywordAlert from "@/components/keywords/InactiveKeywordAlert.tsx";

export interface URLBuilderProps {
    url: string,
    onSelectUrl: (url: string) => void,
}

const singleURL = /\/([a-z\d-]+)/i;
const doubleURL = /\/([a-z\d-]+)\/([a-z\d-]+)/i;

const URLBuilder: React.FC<URLBuilderProps> = ({url, onSelectUrl}) => {
    const keywords = useSelector(selectKeywordsList);
    const [category, setCategory] = useState<Keyword | null>(null);
    const [product, setProduct] = useState<Keyword | null>(null);
    const [page, setPage] = useState<Keyword | null>(null);
    const [genURL, setGenURL] = useState(url);

    useEffect(() => {
        setGenURL(url);
        if (/:*\/\//.test(url)) {
            setCategory(null);
            setProduct(null);
            setPage(null);
            return;
        } else if (doubleURL.test(url)) {
            const [, cat, prod] = doubleURL.exec(url) || [];
            const [catKeyword] = keywords.filter(kw => kw.pagetype === 'category').filter(kw => kw.keyword === cat);
            setCategory(catKeyword || null);
            const [prodKeyword] = keywords.filter(kw => kw.pagetype === 'product').filter(kw => kw.keyword === prod);
            setProduct(prodKeyword || null);
        } else if (singleURL.test(url)) {
            const [, key] = singleURL.exec(url) || [];
            const [catKeyword] = keywords.filter(kw => kw.pagetype === 'category').filter(kw => kw.keyword === key);
            setCategory(catKeyword || null);
            const [prodKeyword] = keywords.filter(kw => kw.pagetype === 'product').filter(kw => kw.keyword === key);
            setProduct(prodKeyword || null);
            const [pageKeyword] = keywords.filter(kw => kw.pagetype === 'page').filter(kw => kw.keyword === key);
            setProduct(pageKeyword || null);
        }
    }, [keywords, url]);

    useEffect(() => {
        if (category && product) {
            setGenURL(`/${category.keyword}/${product.keyword}`)
        } else if (!category && !product && !page) {
            setGenURL('');
        } else {
            setGenURL(`/${(category || product || page)?.keyword}`)
        }
    }, [category, product, page]);

    const categoryChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [keyword] = keywords.filter(kw => kw.pagetype === 'category' && kw.keyword === ev.target.value);
        setCategory(keyword || null);
    }

    const productChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [keyword] = keywords.filter(kw => kw.pagetype === 'product' && kw.keyword === ev.target.value);
        setProduct(keyword || null);
    }

    const pageChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [keyword] = keywords.filter(kw => kw.pagetype === 'page' && kw.keyword === ev.target.value);
        setPage(keyword || null);
    }

    return (
        <div className="mt-3">
            <h3>Build URL</h3>
            <FormColumn label="Category" width={4}>
                <select className="form-select form-select-sm" value={category?.keyword || ''}
                        onChange={categoryChangeHandler}>
                    <option value=""></option>
                    {keywords.filter(kw => kw.pagetype === 'category')
                        .sort(keywordTitleSorter)
                        .map(kw => <option key={kw.keyword} value={kw.keyword}>{kw.title}</option>)
                    }
                </select>
                <InactiveKeywordAlert keyword={category}/>
            </FormColumn>
            <FormColumn label="Product" width={4}>
                <select className="form-select form-select-sm" value={product?.keyword || ''}
                        onChange={productChangeHandler}>
                    <option value=""></option>
                    {keywords.filter(kw => kw.pagetype === 'product')
                        .sort(keywordTitleSorter)
                        .map(kw => <option key={kw.keyword} value={kw.keyword}>{kw.title}</option>)
                    }
                </select>
                <InactiveKeywordAlert keyword={product}/>
            </FormColumn>
            <FormColumn label="Page" width={4}>
                <select className="form-select form-select-sm" value={page?.keyword || ''} onChange={pageChangeHandler}>
                    <option value=""></option>
                    {keywords.filter(kw => kw.pagetype === 'page')
                        .sort(keywordTitleSorter)
                        .map(kw => <option key={kw.keyword} value={kw.keyword}>{kw.title}</option>)
                    }
                </select>
                <InactiveKeywordAlert keyword={page}/>
            </FormColumn>
            <FormColumn label="URL" width={4}>
                <div className="input-group input-group-sm">
                    <input type="text" value={genURL} readOnly className="form-control form-control-sm"/>
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            onClick={() => onSelectUrl(genURL)}>
                        Apply URL
                    </button>
                </div>
            </FormColumn>
        </div>
    )
}

export default URLBuilder;

