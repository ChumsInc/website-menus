import {Keyword} from "b2b-types";
import {fetchJSON} from "chums-components";

export const fetchKeywords = async ():Promise<Keyword[]> => {
    try {
        const url = `/api/b2b/keywords`;
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
