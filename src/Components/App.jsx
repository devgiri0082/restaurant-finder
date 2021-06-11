import React, { useState, useEffect, useRef } from 'react'

export default function App() {
    let [currentPage, setCurrentPage] = useState(null);
    let [restaurants, setRestaurants] = useState([]);
    let [allFilters, setAllFilters] = useState([]);
    let [currentFiltered, setCurrentFiltered] = useState([]);
    let [currentGenre, setCurrentGenre] = useState("All");
    let valueRef = useRef("");
    let getData = async () => {
        let url = "http://128.199.195.196:3001/";
        let header = { 'Authorization': 'Bearer iqi509189dxznal;,ggi' }
        let response = await fetch(url, {
            method: "GET",
            headers: header
        })
        let data = await response.json();
        let temp = data;
        temp.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            }
            return 0;
        })
        let genre = [];
        genre.push("All");
        temp.forEach(elem => {
            elem.genre.split(",").forEach((value) => {
                if (!genre.includes(value)) genre.push(value)
            });
        })
        setAllFilters(genre);
        if (temp.length > 10) setCurrentPage(0);
        setRestaurants(temp);
        setCurrentFiltered(temp);
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="container" >
            <div className="search"><input type="text" ref={valueRef} onChange={() => empty()} /> <button className="search" onClick={() => changeSearch()}>🔎</button></div>
            <table>
                <tr>
                    <th>S.N</th>
                    <th>Name</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Phone Number</th>
                    <th>Genre</th>

                </tr>
                {currentFiltered.map((elem, index) => {
                    if (index < currentPage || index > currentPage + 9) return undefined;
                    return (< tr >
                        <td>{index + 1}</td>
                        <td>{elem.name}</td>
                        <td>{elem.state}</td>
                        <td>{elem.city}</td>
                        <td>{elem.telephone}</td>
                        <td>{elem.genre}</td>
                    </tr>)
                })}
            </table>
            { currentPage !== null && <div className="all-button"><button className="page" onClick={() => goBack()}>back</button><button className="page" onClick={() => goNext()}>next</button></div>}
            <div className="title">Filters</div>
            <div className="allFilter">
                {allFilters.map(elem => <button className="filter" onClick={() => changeFilter(elem)}>{elem}</button>)}</div>
        </div >
    )

    function empty() {
        if (valueRef.current.value === "") {
            changeFilter(currentGenre);
            setCurrentPage(0);
            return;
        }
    }
    function changeSearch() {
        if (valueRef.current.value === "") {
            changeFilter(currentGenre);
            setCurrentPage(0);
            return;
        }
        let filtered = [];
        currentFiltered.forEach(elem => {
            if (elem.name.toLowerCase().includes(valueRef.current.value)) {
                filtered.push(elem);
            } else if (elem.city.toLowerCase().includes(valueRef.current.value)) {
                filtered.push(elem);
            } else if (elem.genre.split(",").map(elem => elem.toLowerCase()).includes(valueRef.current.value)) {
                filtered.push(elem);
            }
        })
        setCurrentFiltered(filtered);
        if (filtered.length <= 10) setCurrentPage(null);
        if (filtered.length > 10) setCurrentPage(0);

    }
    function changeFilter(elem) {
        setCurrentGenre(elem);
        let current = [];
        if (elem === "All") {
            setCurrentPage(0);
            setCurrentFiltered(restaurants);
            return;
        }
        restaurants.forEach(value => {

            if (value.genre.split(",").includes(elem)) {
                current.push(value);
            }
        })
        setCurrentFiltered(current);
        console.log(current.length);
        if (current.length <= 10) setCurrentPage(null);
        if (current.length > 10) setCurrentPage(0);
    }
    function goBack() {
        if (currentPage === null || currentPage === 0) return;
        setCurrentPage(currentPage - 10);
    }
    function goNext() {
        if (currentPage + 10 > currentFiltered.length) return;
        setCurrentPage(currentPage + 10);
    }



}
