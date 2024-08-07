import { useEffect, useState } from "react";
import { Graph, Person } from "../types/types"; // Importing types Graph and Person from a types module

// Custom hook to fetch and process graph data based on a Person object
export const useGetGraph = (person: Person | null) => {

    // State to hold the graph data, initially set to null
    const [state, setState] = useState<Graph>(null);

    // useEffect hook to run side effects, specifically fetching graph data when the 'person' dependency changes
    useEffect(() => {
        // Asynchronous function to fetch and process the data
        async function fetchData() {
            // Check if person object is not null
            if (person !== null) {

                // Define the base URLs for fetching films and starships data
                const filmsURL = 'https://sw-api.starnavi.io/films/';
                const starshipsURL = 'https://sw-api.starnavi.io/starships/';

                // Arrays to hold promises for fetching films and starships data
                const fetchPromises_films = [];
                const fetchPromises_starships = [];

                // Create promises for fetching data of all films the person appeared in
                for (let i = 0; i < person.films.length; i++) {
                    const res = await fetch(`${filmsURL}${person.films[i]}`); // Fetch film data
                    const data = await res.json(); // Parse response as JSON
                    fetchPromises_films.push(data); // Add film data to the promises array
                }

                // Wait for all film data promises to resolve
                const filmsData = (await Promise.all(fetchPromises_films));
                // Map the fetched film data to an array of objects containing film names, IDs, and indexes
                const names_f: { name: string, id: number, index: number }[] = filmsData.map((el, index) => {
                    return { name: el.title, id: el.id, index: index + 2 }; // Assign index starting from 2
                });

                // Create promises for fetching data of all starships the person has piloted
                for (let i = 0; i < person.starships.length; i++) {
                    const res = await fetch(`${starshipsURL}${person.starships[i]}`); // Fetch starship data
                    const data = await res.json(); // Parse response as JSON
                    fetchPromises_starships.push(data); // Add starship data to the promises array
                }

                // Wait for all starship data promises to resolve
                const starshipsData = (await Promise.all(fetchPromises_starships));
                // Map the fetched starship data to an array of objects containing starship names and the films they appeared in
                const names_s: { name: string, films: number[] }[] = starshipsData.map(el => {
                    return { name: el.name, films: el.films };
                });

                // Define initial nodes for the graph
                const initialNodes = [
                    // Node for the person
                    {
                        id: '1',
                        position: { x: 0, y: 0 }, // Position of the person node
                        data: { label: person.name } // Label showing the person's name
                    },
                    // Nodes for films
                    ...names_f.map((film, index) => ({
                        id: `${index + 2}`, // Unique ID for the film node
                        position: {
                            x: index * 300 - ((names_f.length - 1) * 150), // Calculating X position to distribute nodes evenly
                            y: 200 // Y position fixed for film nodes
                        },
                        data: { label: film.name }, // Label showing the film name
                    })),
                    // Nodes for starships
                    ...names_s.map((starship, index) => ({
                        id: `${index + names_f.length + 2}`, // Unique ID for the starship node
                        position: {
                            x: index * 500 - ((names_s.length - 1) * 150), // Calculating X position to distribute nodes evenly
                            y: 400 // Y position fixed for starship nodes
                        },
                        data: { label: starship.name }, // Label showing the starship name
                    })),
                ];

                // Define initial edges for the graph
                const initialEdges = names_f.map((_, index) => ({
                    id: `e1-${index + 2}`, // Unique ID for the edge
                    source: '1', // The person node ID
                    target: `${index + 2}`, // The film node ID
                }));

                // Define additional edges connecting starships to the films they appeared in
                const additionalEdges = names_s.reduce((acc: { id: string; source: string; target: string; }[], starship, sIndex) => {
                    // For each starship, create edges to the films it appeared in
                    starship.films.forEach(filmId => {
                        const filmIndex = names_f.findIndex(film => film.id === filmId); // Find the index of the film node
                        if (filmIndex !== -1) {
                            acc.push({
                                id: `e${filmIndex + 2}-${sIndex + names_f.length + 2}`, // Unique ID for the edge
                                source: `${filmIndex + 2}`, // Film node ID
                                target: `${sIndex + names_f.length + 2}`, // Starship node ID
                            });
                        }
                    });
                    return acc; // Return the accumulated edges
                }, []);

                // Update the state with the graph data
                setState({
                    initialNodes,
                    initialEdges: [...initialEdges, ...additionalEdges], // Combine initial and additional edges
                });
            }
        }

        fetchData(); // Call the fetchData function to load the graph data
    }, [person]); // Dependency array to re-run effect when 'person' changes

    return state; // Return the graph data state
}
