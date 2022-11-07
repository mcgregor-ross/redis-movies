import { sortCriteria, searchBuilder } from "../../types/staticTypes";

/**
 * Function to build the Redis Search Query
 * @param {*} filterProps
 * @param {*} params
 * @returns
 */
export const buildRedisQueryString = (filterProps, params) => {
    var query = searchBuilder.index;
    var filterCriteria = "";

    // Iterate over Filter Props and build query string
    if (filterProps) {
        var dateBuilder = Boolean(false);
        Object.entries(filterProps).forEach(([key, value]) => {
            switch (key) {
                case "genres":
                    filterCriteria += buildGenreFilterParams(value, filterProps["genreOperator"]) + " ";
                    break;
                case "releaseDateGTE" || "releaseDateLTE":
                    if (!dateBuilder) {
                        filterCriteria +=
                            buildRangeQueryString(filterProps.releaseDateGTE, filterProps.releaseDateLTE, "releaseDateUTC") +
                            " ";
                        dateBuilder = Boolean(true);
                    }
                    break;
                // minimum sliders i.e. X-100
                case "voteAverageGTE":
                case "voteCountGTE":
                case "budgetGTE":
                    filterCriteria += buildRangeQueryString(value, 0, key.slice(0, -3)) + " ";
                    break;
                // maximum sliders i.e. 0-X
                case "runtimeLTE":
                    filterCriteria += buildRangeQueryString(0, value, key.slice(0, -3)) + " ";
                    break;
            }
        });
    }

    // Finally build the query string with the filterprops 
    if (filterCriteria) {
        if (filterProps["query"]) {
            query += '"' + filterProps["query"] + " " + filterCriteria.trim() + '" ';
        } else {
            query += '"' + filterCriteria.trim() + '" ';
        }
    } else if (params.query !== "*") {
        query += "'" + params.query + "' ";
    }

    query += searchBuilder.sort + params.sortBy + " " + params.sortOrder;
    query += " LIMIT " + params.page + " " + params.size;
    return query;
};

const buildGenreFilterParams = (genres, operator) => {
    if (genres.length > 0) {
        return buildTAGString(genres, operator, "genres") + " ";
    }
    return "";
};

// a pretty pants way of generating a Redis Range Query Syntax
const buildRangeQueryString = (gte, lte, field) => {
    if (typeof gte === "undefined" && typeof lte === "undefined") return;
    if (typeof gte === "undefined") gte = 0;
    if (typeof lte === "undefined") lte = 0;
    if (gte <= 0 && lte <= 0) return;

    const range = Boolean(gte > 0 && lte > 0 ? true : false);
    const exact = Boolean(range && gte === lte ? true : false);
    const lessThan = Boolean(lte > 0 && gte === 0 ? true : false);
    const greaterThan = Boolean(gte > 0 && lte === 0 ? true : false);

    // Search for an exact value i.e. "@rating:[(2014]"
    if (exact) return "@" + field + ":[(" + gte + "] ";

    // Search for an EqualToOrLessThan value i.e. @rating:[-inf (5]
    if (lessThan) return "@" + field + ":[-inf (" + lte + "] ";

    // Search for an EqualToOrGreaterThan value i.e. "@rating:[4 inf]"
    if (greaterThan) return "@" + field + ":[" + gte + " inf] ";

    // Search between a range value i.e. @rating:[5 10]
    if (range && !exact) return "@" + field + ":[" + gte + " " + lte + "] ";
};

// Basic TAG syntax builder,
// TODO - Make generic, not genre specific
const buildTAGString = (tags, operator, field) => {
    var tagQuery = "";
    switch (operator) {
        case "AND":
            tags.split(",").forEach((tag) => (tagQuery += "@" + field + ":{" + tag + "} "));
            return tagQuery;
        default:
            return "@" + field + ":{" + tags.split(",").join("|") + "}";
    }
};

const hasOwnProperty = (object, field) => {
    console.log(object + " : " + field);
    if (Object.prototype.hasOwnProperty.call(object, [field])) {
        if (object[field]) {
            return true;
        }
    }
    return false;
};
