import {Keyword} from "b2b-types";
import {fetchJSON} from "chums-ducks";

export const fetchKeywords = async (site:string):Promise<Keyword[]> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/keywords`;
        const {result} = await fetchJSON<{result:Keyword[]}>(url);
        return result;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchKeywords()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchKeywords()", err);
        return Promise.reject(new Error('Error in fetchKeywords()'));
    }
}
