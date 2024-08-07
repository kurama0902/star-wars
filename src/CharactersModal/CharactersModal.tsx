import { useRef, useState } from "react"; // Importing hooks useRef and useState from React
import { Swiper, SwiperSlide } from "swiper/react"; // Importing Swiper and SwiperSlide components from Swiper library
import { Swiper as SwiperType } from "swiper/types"; // Importing Swiper type definition for TypeScript
import { CloseCross } from "../SVG/CloseCross"; // Importing a CloseCross component for a close button
import { Person } from "../../types/types"; // Importing Person type for TypeScript
import { Preloader } from "../Preloader"; // Importing Preloader component for loading indication
import { useGetPeople } from "../../hooks/useGetPeople"; // Importing custom hook for fetching people data

import Pagination from "@mui/material/Pagination"; // Importing Pagination component from Material UI

import "swiper/css"; // Importing Swiper CSS styles
import "swiper/css/navigation"; // Importing Swiper navigation CSS styles

import s from "./modal.module.css"; // Importing CSS module for styling
import { CharacterGraph } from "../CharacterGraph/CharacterGraph"; // Importing CharacterGraph component to display a graph of the selected character
import { useGetGraph } from "../../hooks/useGetGraph"; // Importing custom hook for fetching graph data based on selected person

// Functional component for displaying character modal
export const CharactersModal = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    // State to keep track of the current page in pagination
    const [selectedPage, setSelectedPage] = useState<number>(1);
    // Custom hook for fetching people data based on the current page
    const { peopleInfo, setPeopleInfo } = useGetPeople(selectedPage);

    // State to keep track of the currently selected person
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    // Custom hook for fetching graph data based on the selected person
    const gr = useGetGraph(selectedPerson);

    // Ref to keep a reference to the Swiper instance
    const swiperRef = useRef<SwiperType | null>(null);

    // Function to move to the next slide
    const goNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext(); // Call slideNext method on Swiper instance
        }
    };

    // Function to move to the previous slide
    const goPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev(); // Call slidePrev method on Swiper instance
        }
    }

    // Handler function for pagination page change
    const handlePaginationPage = (e: React.ChangeEvent<unknown>, page: number) => {
        if (page !== selectedPage && peopleInfo) {
            setPeopleInfo({ people: null, qt: peopleInfo.qt }); // Clear current data before loading new page
            setSelectedPage(page); // Update selected page number
        }
    };

    // Handler function for selecting a person
    const handleSelectedPerson = (person: Person) => {
        if (selectedPerson?.name === person.name) {
            setSelectedPerson(null); // Deselect person if already selected
        } else {
            setSelectedPerson(person); // Set the new person as selected
        }
    }

    return (
        <div className={s.charactersModalWrap}> {/* Wrapper div for modal with CSS styling */}
            <Swiper
                // Swiper instance is set here for programmatic access
                onSwiper={(swiper) => {
                    swiperRef.current = swiper; // Save Swiper instance to ref
                }}
                className={s.mySwiper}  // Apply CSS class for Swiper container styling
                allowTouchMove={false}  // Disable touch swipe navigation
            >
                <SwiperSlide className={`${s.slide} ${s.slide1}`}> {/* Slide for character list */}
                    <div className={s.modalWrap}> {/* Wrapper div for slide content */}
                        <button onClick={() => setIsOpen(false)} className={s.closeBtn}> {/* Button to close the modal */}
                            <CloseCross /> {/* Close icon component */}
                        </button>
                        <div className={s.paginationWrap}> {/* Wrapper div for pagination */}
                            <Pagination
                                onChange={handlePaginationPage} // Handler for pagination page changes
                                count={peopleInfo?.qt || 0} // Number of pagination pages
                                color="primary"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "white", // Text color for pagination items
                                    },
                                    "& .Mui-selected": {
                                        color: "white", // Text color for the selected pagination item
                                        backgroundColor: "#1976d2", // Background color for the selected pagination item
                                    },
                                }}
                            />
                        </div>
                        {peopleInfo?.people === null ? (
                            <Preloader /> // Show loader while data is being fetched
                        ) : (
                            peopleInfo?.people.map((el) => {
                                return (
                                    <button onClick={() => {
                                        handleSelectedPerson(el); // Handle person selection
                                        if (selectedPerson?.name !== el.name) {
                                            goNext(); // Move to next slide if a new person is selected
                                        }
                                    }} className={s.character} key={el.id}>
                                        <img
                                            className={s.characterImg}
                                            src={`https://starwars-visualguide.com/assets/img/characters/${el.id}.jpg`} // Image URL for the character
                                            alt="" // Alt text for accessibility
                                        />
                                        <p className={s.characterName}>{el.name}</p> {/* Display character name */}
                                        {selectedPerson?.name === el.name && <p className={s.selected}>selected</p>} {/* Show 'selected' text if this person is selected */}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </SwiperSlide>
                <SwiperSlide className={`${s.slide} ${s.slide2}`}> {/* Slide for character graph */}
                    <button onClick={goPrev} className={s.goBack}> {/* Button to go back to the previous slide */}
                        <svg height="30px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="30px" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " /> {/* SVG arrow icon */}
                        </svg>
                    </button>
                    <CharacterGraph gr={gr} /> {/* Component to display the graph of the selected character */}
                </SwiperSlide>
            </Swiper>
        </div>
    );
};