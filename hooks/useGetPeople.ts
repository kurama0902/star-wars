import { useEffect, useState } from "react"
import { Person } from "../types/types";

export const useGetPeople = (page = 1): {
    peopleInfo: {
        people: Person[] | null;
        qt: number;
    } | null,
    setPeopleInfo: React.Dispatch<React.SetStateAction<{
        people: Person[] | null;
        qt: number;
    } | null>>
} => {
    const [peopleInfo, setPeopleInfo] = useState<{ people: Person[] | null, qt: number } | null>({
        people: null, qt: 0
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`https://sw-api.starnavi.io/people/?page=${page}`);
                const data = await res.json();

                setPeopleInfo({ people: data.results, qt: Math.floor(data.count / 10) })

            } catch (error) {
                console.error('Error while fetching the "people" data', error);
                setPeopleInfo(null);
            }
        }

        fetchData();
    }, [page])

    return { peopleInfo, setPeopleInfo };
}