export type Person = {
    id: number;
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: number;
    films: number[];
    species: number[];
    vehicles: number[];
    starships: number[];
    created: string; // ISO 8601 date string
    edited: string;  // ISO 8601 date string
    url: string;
}

export type Graph = {
    initialNodes: {
        id: string;
        position: {
            x: number;
            y: number;
        };
        data: {
            label: string;
        };
    }[],
    
    initialEdges: {
        id: string;
        source: string;
        target: string;
    }[]
} | null