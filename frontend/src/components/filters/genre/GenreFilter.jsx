import React, { useState } from "react";
import Select, { NonceProvider } from "react-select";

import { genres } from "../../../types/staticTypes"

import "../filters.scss";

const GenreFilter = (props) => {

    const selectStyles = {
        option: (provided) => ({
            ...provided,
            borderBottom: "1px dotted pink",
            color: "red",
            padding: 20,
            zIndex: 98,
        }),
        control: (styles) => ({
            ...styles,
            backgroundColor: "black",
            color: "white",
            fontWeight: 600,
            border: "2px solid white",
            boxShadow: "white",
            "&:hover": {
                border: "2px solid white",
            },
        }),
        menuList: (provided, state) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            boxShadow: state.isFocused ? "red" : "white",
        }),
        menu: (base) => ({
            ...base,
            marginTop: 0,
            fontFamily: "Montserrat",
            fontWeight: 600,
            backgroundColor: "white",
            borderRadius: 0,
            color: "red",
            zIndex: 98,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white",
        }),
        multiValue: (styles, { data }) => {
            return {
                ...styles,
                backgroundColor: "white",
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: "red",
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: "red",
            ":hover": {
                backgroundColor: "red",
                color: "white",
            },
        }),
    };

    return (
        <Select
            value={props.activeGenres}
            isMulti="true"
            styles={selectStyles}
            options={genres}
            placeholder="Select Genres..."
            onChange={(val) => props.handleChange(val)}
        />
    );
};

export default GenreFilter;
