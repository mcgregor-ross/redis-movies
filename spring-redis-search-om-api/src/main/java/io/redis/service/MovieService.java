package io.redis.service;

import io.redis.model.Movie;

import io.redis.model.MovieQueryFilter;
import io.redis.repository.MovieRepository;
import io.redis.type.FieldENUM;
import io.redis.type.OperatorENUM;
import io.redis.util.SearchUtil;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Set;


@Slf4j
@Service
public class MovieService {

    @Autowired
    MovieRepository repository;

    @Autowired
    SearchUtil searchUtils;

    /**
     * Search for Movies which exclusively has multiple genres|actors etc.. e.g.
     * OR: @genre:{action|adventure}
     * AND: @genre:{action} $genre:{adventure}
     * NOT: -@genre:{action|adventure}
     *
     * @param tags
     * @param operator
     * @param field
     * @param pageable
     * @return
     * @throws Exception
     */
    public Page<Movie> getMoviesByCollection(Set<String> tags, OperatorENUM operator, FieldENUM field, Pageable pageable) throws Exception {
        log.info("SearchByCollection: Tags '{}', Operator: '{}', Field: '{}'", tags, field.getFieldName(), operator);

        String queryString = searchUtils.buildArrayQuery(tags, field.getFieldName(), operator);

        if (StringUtils.isBlank(queryString)) {
            throw new Exception("Unable to build query string, please check values... ");
        }

        log.info("SearchByCollection: generated Query: '{}'", queryString);
        return repository.search(queryString, pageable);
    }

    /**
     * Utilising multiple filters in a single query, composes RediSearch query string based off MovieQueryFilter params
     *
     * @param filterQuery
     * @param pageable
     * @return
     */
    public Page<Movie> getMoviesByAdvancedSearch(MovieQueryFilter filterQuery, Pageable pageable) {

        // Build the query string
        String query = searchUtils.advancedMovieQueryBuilder(filterQuery);
        log.info("SearchByAdvancedQuery: generated Query: '{}'", query);
        return repository.search(query, pageable);
    }
}