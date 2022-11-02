package io.redis.util;

import com.google.gson.Gson;
import io.redis.model.Field;
import io.redis.model.Movie;
import io.redis.model.MovieQueryFilter;
import io.redis.type.FieldENUM;
import io.redis.type.FieldTypeENUM;
import io.redis.type.OperatorENUM;
import io.redisearch.SearchResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Component
public class SearchUtil {

    private static final Pattern COMMA = Pattern.compile(",");

    @Autowired
    Gson gson;

    /**
     * Add escape symbols for 'Special Characters' in Strings
     * NOTE: This is built into Jedis 4.x so should be removed soon..
     *
     * @param inputString
     * @return
     */
    public String escapeMetaCharacters(String inputString) {
        final String[] metaCharacters = {"\\", "^", "$", "{", "}", "[", "]", "(", ")", ".", "*", "+", "?", "|", "<", ">", "-", "&", "%"};

        for (int i = 0; i < metaCharacters.length; i++) {
            if (inputString.contains(metaCharacters[i])) {
                inputString = inputString.replace(metaCharacters[i], "\\" + metaCharacters[i]);
            }
        }
        return inputString;
    }

    /**
     * Manage Query Building
     *
     * @param collection
     * @param field
     * @param joiner
     * @return
     */
    public StringJoiner addToQuery(String collection, Field field, StringJoiner joiner) {
        if (StringUtils.isBlank(collection)) {
            return joiner;
        } else {
            return joiner.add(this.buildQuery(collection, field).trim());
        }
    }

    public StringJoiner addRangeToQuery(Number gte, Number lte, FieldENUM field, StringJoiner joiner) {

        // Null check
        gte = getNumberValue(gte);
        lte = getNumberValue(lte);

        // no query to be made
        if (gte.longValue() <= 0 && lte.longValue() <= 0){
            return joiner;
        }

        log.debug("Field: {} :: GTE Val: {} , LTE: {}", field.getFieldName(), gte.longValue(), lte.longValue());

        // Range matrix
        boolean range = gte.longValue() > 0 && lte.longValue() > 0 ? true : false;
        boolean exact = range && (gte.equals(lte)) ? true : false;
        boolean lessThan = lte.longValue() > 0 && gte.longValue() <= 0 ? true : false;
        boolean greaterThan = gte.longValue() > 0 && lte.longValue() <= 0 ? true : false;

        log.debug("field: {}, {}, {}, {}, {}", field.getFieldName(), range, exact, lessThan, greaterThan);

        // Search for an exact value i.e. "@rating:[(2014]"
        if (exact) return joiner.add("@" + field.getFieldName() + ":[(" + gte + "]");

        // Search for an exact value i.e. @rating:[-inf (5]
        if (lessThan) return joiner.add("@" + field.getFieldName() + ":[-inf (" + lte + "]");

        // "@rating:[4 inf]"
        if (greaterThan) return joiner.add("@" + field.getFieldName() + ":[" + gte + " inf]");

        // Search between a range value i.e. @rating:[-inf (5]
        if (range && !exact) return joiner.add("@" + field.getFieldName() + ":[" + gte + " " + lte + "]");

        return joiner;
    }

    private Number getNumberValue(Number val){
        return Optional.ofNullable(val).orElse(0);
    }

    /**
     * TODO: Build Fluent Query builder
     * Iterates over an array of fields to help build the query
     *
     * @param collection
     * @param fieldName
     * @return
     */
    public String buildArrayQuery(Set<String> collection, String fieldName, OperatorENUM operator) {

        // Build Query String i.e. "@actors:{Chris Evans} @actors:{Scarlett Johansson} "
        StringBuilder sb = new StringBuilder();
        switch (operator) {
            case OR:
                sb.append("@" + fieldName + ":{");
                sb.append(collection.stream().collect(Collectors.joining("|")));
                sb.append("} ");
                break;
            case AND:
                collection.stream().forEach(c -> {
                    sb.append("@" + fieldName + ":{").append(c.trim()).append("} ");
                });
                break;
            case NOT:
                sb.append("-@" + fieldName + ":{");
                sb.append(collection.stream().collect(Collectors.joining("|")));
                sb.append("} ");
                break;
        }

            log.debug("Returning query string '{}' , for field '{}' ", sb, fieldName);
            return sb.toString();
   }

    /**
     * Builds query for TEXT,TAG & NUMERIC fields using AND,OR operators
     *
     * @param collection
     * @param field
     * @return
     */
    public String buildQuery(String collection, Field field) {

        // Build Query String
        StringBuilder sb = new StringBuilder();

        // Example:  "@actors:{Chris Evans} @actors:{Scarlett Johansson} "
        if (field.getFilter().equals(OperatorENUM.AND)) {
            COMMA.splitAsStream(collection).forEach(c -> {
                sb.append("@" + field.getName().getFieldName() + ":");
                sb.append(field.getType().getDelimiterStart());
                sb.append(c.trim()).append(field.getType().getDelimiterEnd()).append(" ");
            });
        }

        // Example: "@actors:{Chris Evans|Scarlett Johansson} "
        if (field.getFilter().equals(OperatorENUM.OR)) {
            sb.append("@" + field.getName().getFieldName() + ":");
            sb.append(field.getType().getDelimiterStart());
            sb.append(COMMA.splitAsStream(collection)
                    .map(String::trim).map(this::escapeMetaCharacters)
                    .collect(Collectors.joining("|")));
            sb.append(field.getType().getDelimiterEnd()).append(" ");
        }

        log.debug("Returning query string '{}' , for field '{}' ", sb, field.getName().getFieldName());
        return sb.toString();
    }

    /**
     * Basic util to convert search results to Spring Pageable object
     *
     * @param searchResult
     * @return
     */
    public List<Movie> convertToPageableObject(SearchResult searchResult) {
        List<Movie> movies = new ArrayList<>();
        searchResult.docs.stream().forEach(d -> {
            d.getProperties().forEach(e -> {
                if (e.getValue().toString().substring(0,1).equals("{")){
                    movies.add(gson.fromJson(e.getValue().toString(), Movie.class));
                }
            });
        });
        return movies;
    }

    /**
     * Really Basic Redis Search Query Builder
     * Where field filters are not null, the query filter is appended to the query
     * TODO: Make one thats doesnt suck.
     *
     * @param filterQuery
     * @return
     */
    public String advancedMovieQueryBuilder(MovieQueryFilter filterQuery) {

        log.info("Using Movie Filter: {}", filterQuery);
        StringJoiner joiner = new StringJoiner(" ");

        // Add Generic Search Criteria
        if (StringUtils.isNotBlank(filterQuery.getQuery())) {
            joiner.add(filterQuery.getQuery());
        }

        // Add Actors Criteria
        this.addToQuery(filterQuery.getActors(), new Field(FieldENUM.ACTORS, FieldTypeENUM.TAG,
                OperatorENUM.fromString(filterQuery.getActorOperator())), joiner);

        // Add Directors Criteria
        this.addToQuery(filterQuery.getDirectors(), new Field(FieldENUM.DIRECTOR, FieldTypeENUM.TAG,
                OperatorENUM.fromString(filterQuery.getDirectorOperator())), joiner);

        // Add Genre Criteria
        this.addToQuery(filterQuery.getGenres(), new Field(FieldENUM.GENRE, FieldTypeENUM.TAG,
                OperatorENUM.fromString(filterQuery.getGenreOperator())), joiner);

        // Add Writer Criteria
        this.addToQuery(filterQuery.getWriters(), new Field(FieldENUM.WRITERS, FieldTypeENUM.TAG,
                OperatorENUM.fromString(filterQuery.getWriterOperator())), joiner);

        // Add Rating / Vote Average (GTE) Criteria
        this.addRangeToQuery(filterQuery.getVoteAverageGTE(), 0.0, FieldENUM.RATING, joiner);

        // Add Vote Count (GTE)
        this.addRangeToQuery(filterQuery.getVoteCountGTE(), 0l, FieldENUM.VOTE_COUNT, joiner);

        // Add Budget Criteria
        this.addRangeToQuery(filterQuery.getBudgetGTE(), 0l, FieldENUM.BUDGET, joiner);

        // Add Runtime Length Criteria
        this.addRangeToQuery(filterQuery.getRuntimeGTE(), filterQuery.getRuntimeLTE(), FieldENUM.RUNTIME, joiner);

        // Add Runtime Release Year Criteria
        this.addRangeToQuery(filterQuery.getReleaseDateGTE(), filterQuery.getReleaseDateLTE(), FieldENUM.RELEASE_DATE, joiner);

        // Add Runtime Meta Rating Criteria
        this.addRangeToQuery(filterQuery.getPopularityGTE(), filterQuery.getPopularityLTE(), FieldENUM.POPULARITY, joiner);

        return joiner.toString();
    }
}
