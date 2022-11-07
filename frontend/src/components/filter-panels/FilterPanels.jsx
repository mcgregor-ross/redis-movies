import React, { useState } from "react";

import { Accordion, Card, Form, Row, Col } from "react-bootstrap";

import { genres, sortCriteria } from "../../types/staticTypes";
import RangeSlider from "react-bootstrap-range-slider";
import DatePicker from "react-datepicker";

import "./filter-panels.scss";
import { OutlineButton } from "../button/Button";

const FilterPanels = (props) => {
    const localProps = {
        runtime: 0,
        rating: 0,
        votes: 0,
        budget: 0,
        genreOperator: "OR",
        yearLT: null,
        yearGT: null,
    };

    // 2 variables to manage local values and API call values
    const [localFilterVars, setLocalFilterVars] = useState(localProps);
    const [filters, setFilters] = useState();
    let newGenreList = [];

    // Maintains object of active filters
    const updateFilters = (field, value) => {
        if (value && (field === "genres" || field === "genreOperator" || value > 0)) {
            setFilters((filters) => {
                return {
                    ...filters,
                    [field]: value,
                };
            });
        }
    };

    // Maintains list of active Genres
    const handleGenreButton = (genreId) => {
        newGenreList = genres.map((genre) => {
            if (genre.id !== genreId) return genre;
            genre.selected = !genre.selected;
            return genre;
        });

        updateFilters(
            "genres",
            newGenreList.filter((genre) => {
                return genre.selected === true;
            })
        );
    };

    // List of all Sort Criteria
    const sortItems = sortCriteria.map((d) => (
        <option key={d.key} value={d.key}>
            {d.value}
        </option>
    ));

    const updateLocalFiltersVars = (field, value) => {
        setLocalFilterVars((filters) => {
            return {
                ...filters,
                [field]: value,
            };
        });
    };

    // Find all on or after specified date
    const handleDateGTChange = (date) => {
        updateLocalFiltersVars("yearGT", date);
        updateFilters("releaseDateGTE", Math.floor(date.getTime() / 1000));
    };

    // Find all on or before specified date
    const handleDateLTChange = (date) => {
        updateLocalFiltersVars("yearLT", date);
        updateFilters("releaseDateLTE", Math.floor(date.getTime() / 1000));
    };

    const handleDateClear = () => {
        updateLocalFiltersVars("yearLT", null);
        updateLocalFiltersVars("yearGT", null);
        delete filters["releaseDateLTE"];
        delete filters["releaseDateGTE"];
        props.clearFiltering(filters);
    };

    // Clear/Reset all filter vars
    const clearFilters = (filters) => {
        // reset local params
        setLocalFilterVars(localProps);
        if (filters) {
            Object.keys(filters).forEach((key) => delete filters[key]);
        }

        // reset selected genre list
        newGenreList = genres.map((genre) => {
            genre.selected = false;
            return genre;
        });

        // update the browsers
        props.clearFiltering(filters);
    };

    // Apply Filtering execution
    const handleFiltering = (filters) => {
        if (filters.genres && filters.genres.length > 0) {
            filters.genreOperator = localFilterVars.genreOperator;
        } else {
            // remove if no genres selected
            if (filters.genreOperator) {
                delete filters["genreOperator"];
            }
        }
        setFilters(filters)
        props.handleFiltering(filters);
    };

    return (
        <>
            <div className="filter-panel">
                <Accordion defaultActiveKey={["0"]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Sort</Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Sort By</Card.Title>
                                    <Form.Select onChange={(e) => props.handleSort(e.target.value)}>
                                        {sortItems}
                                    </Form.Select>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <div className="filter-panel">
                <Accordion defaultActiveKey={["1"]}>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Filters</Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Search Dates</Card.Title>
                                    <Row className="align-items-center">
                                        {/* <Col xs={3}>
                                            <div className="text-center">from</div>
                                        </Col> */}
                                        <Col>
                                            <DatePicker
                                                placeholderText="Select Date: From or After"
                                                selected={localFilterVars.yearGT}
                                                minDate={new Date("1920/01/01")}
                                                maxDate={localFilterVars.yearLT}
                                                onChange={(date) => handleDateGTChange(date)}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="align-items-center">
                                        {/* <Col xs={3}>
                                            <div className="text-center">to</div>
                                        </Col> */}
                                        <Col>
                                            <DatePicker
                                                placeholderText="Select Date: Until or Before"
                                                selected={localFilterVars.yearLT}
                                                minDate={localFilterVars.yearGT}
                                                maxDate={new Date()}
                                                onChange={(date) => handleDateLTChange(date)}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="apply-filter" style={{ marginTop: 5 }}>
                                            <OutlineButton onClick={() => handleDateClear()}>Clear Dates</OutlineButton>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card className="card-panel">
                                <Card.Body>
                                    <Card.Title>Genres</Card.Title>
                                    <div className="multi_select">
                                        <ul>
                                            {genres.map((genre, index) => (
                                                <li key={index}>
                                                    <OutlineButton
                                                        key={genre.id}
                                                        onClick={() => handleGenreButton(genre.id)}
                                                        className={genre.selected ? "active " : " "}>
                                                        {genre.value}
                                                    </OutlineButton>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <hr />
                                    <Card.Title>Genre Sort Filter</Card.Title>
                                    <div className="multi_select">
                                        <ul style={{ marginBottom: 0 }}>
                                            <li>
                                                <OutlineButton
                                                    onClick={() => updateLocalFiltersVars("genreOperator", "AND")}
                                                    className={
                                                        localFilterVars.genreOperator === "AND" ? "active " : " "
                                                    }>
                                                    and
                                                </OutlineButton>
                                            </li>
                                            <li>
                                                <OutlineButton
                                                    onClick={() => updateLocalFiltersVars("genreOperator", "OR")}
                                                    className={
                                                        localFilterVars.genreOperator === "OR" ? "active " : " "
                                                    }>
                                                    or
                                                </OutlineButton>
                                            </li>
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className="card-panel">
                                <Card.Body>
                                    <Card.Title>Minimum User Scores Avg</Card.Title>
                                    <RangeSlider
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        value={localFilterVars.rating}
                                        tooltipLabel={(currentValue) => `${currentValue} / 10`}
                                        tooltip="auto"
                                        variant="danger"
                                        onChange={(changeEvent) =>
                                            updateLocalFiltersVars("rating", changeEvent.target.value)
                                        }
                                        onAfterChange={(e) => updateFilters("voteAverageGTE", e.target.value)}
                                    />
                                </Card.Body>
                            </Card>
                            <Card className="card-panel">
                                <Card.Body>
                                    <Card.Title>Minimum User Votes</Card.Title>
                                    <RangeSlider
                                        min={0}
                                        max={10000}
                                        value={localFilterVars.votes}
                                        tooltipLabel={(currentValue) => `${currentValue} votes`}
                                        tooltip="auto"
                                        variant="danger"
                                        onChange={(changeEvent) =>
                                            updateLocalFiltersVars("votes", changeEvent.target.value)
                                        }
                                        onAfterChange={(e) => updateFilters("voteCountGTE", e.target.value)}
                                    />
                                </Card.Body>
                            </Card>
                            <Card className="card-panel">
                                <Card.Body>
                                    <Card.Title>Maximum Runtime</Card.Title>
                                    <RangeSlider
                                        min={0}
                                        max={500}
                                        value={localFilterVars.runtime}
                                        tooltipLabel={(currentValue) => `${currentValue} mins`}
                                        tooltip="auto"
                                        variant="danger"
                                        onChange={(changeEvent) =>
                                            updateLocalFiltersVars("runtime", changeEvent.target.value)
                                        }
                                        onAfterChange={(e) => updateFilters("runtimeLTE", e.target.value)}
                                    />
                                </Card.Body>
                            </Card>
                            <Card className="card-panel">
                                <Card.Body>
                                    <Card.Title>Minimum Budget</Card.Title>
                                    <RangeSlider
                                        min={0}
                                        max={100}
                                        value={localFilterVars.budget}
                                        tooltipLabel={(currentValue) => `$${currentValue} million`}
                                        tooltip="auto"
                                        variant="danger"
                                        onChange={(changeEvent) =>
                                            updateLocalFiltersVars("budget", changeEvent.target.value)
                                        }
                                        onAfterChange={(e) => updateFilters("budgetGTE", e.target.value * 1000000)}
                                    />
                                </Card.Body>
                            </Card>

                            <div className="card-panel">
                                <div className="apply-filter">
                                    <OutlineButton onClick={() => handleFiltering(filters)}>
                                        Apply Filters
                                    </OutlineButton>
                                    <div style={{ marginTop: 5 }}>
                                        <OutlineButton onClick={() => clearFilters(filters)}>
                                            Clear Filters
                                        </OutlineButton>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </>
    );
};

export default FilterPanels;
