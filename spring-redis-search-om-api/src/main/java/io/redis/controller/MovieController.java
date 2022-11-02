package io.redis.controller;

import io.redis.model.Movie;
import io.redis.model.MovieQueryFilter;
import io.redis.repository.MovieRepository;
import io.redis.service.MovieService;
import io.redis.type.FieldENUM;
import io.redis.type.OperatorENUM;
import io.redis.type.SortValueENUM;
import io.redis.util.ControllerUtils;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Set;

import static org.springframework.data.domain.Sort.Direction;

@Slf4j
@CrossOrigin(origins = "*")
@RequestMapping("/movie/")
@RestController
public class MovieController {

    @Autowired
    MovieRepository repository;

    @Autowired
    MovieService movieService;

    @Autowired
    ControllerUtils utils;

    /**
     * REST: 'http://localhost:8080/movie/id/278'
     * cURL: curl -X GET "http://localhost:8080/movie/id/278"
     * REDIS: JSON.GET io.redis.model.Movie:<ID>
     */
    @GetMapping("/id/{id}")
    public Movie getMovieById(@PathVariable("id") String id) {
        log.info("Repository Method: {}", "findById(" + id + ")");
        return repository.findById(id).get();
    }

    /**
     * Example Search By Actors
     * REST: http://localhost:8080/movie/actors?actors=Chris Evans,Hugo Weaving&page=0&size=20
     * REST (OR): http://localhost:8080/movie/actors?actors=Chris Evans,Robert Downey Jr&page=0&size=20&operator=OR
     * REST (AND): http://localhost:8080/movie/actors?actors=Chris Evans,Scarlett Johansson&page=0&size=20&operator=AND
     * REDIS : "FT.SEARCH" "io.redis.model.MovieIdx" "@actors:{Chris Evans}" "LIMIT" "0" "20"
     * REDIS (OR): "FT.SEARCH" "io.redis.model.MovieIdx" "@actors:{ Hugo Weaving | Chris Evans}" "LIMIT" "0" "20"
     * REDIS (AND): "FT.SEARCH" "io.redis.model.MovieIdx" "@actors:{Chris Evans} @actors:{Scarlett Johansson}" "LIMIT" "0" "20"
     *
     * @param actors
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/actors")
    public Page<Movie> findByActors(@RequestParam(name = "actors") String actors,
                                    @RequestParam(name = "operator", required = false) String operator,
                                    @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                    @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                    @RequestParam(name = "sortBy", required = false, defaultValue = "voteAverage") String sortByField,
                                    @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) throws Exception {

        OperatorENUM op = OperatorENUM.fromString(operator) == null
                ? OperatorENUM.AND
                : OperatorENUM.fromString(operator);

        Set<String> cast = Set.of(actors.split(","));
        return movieService.getMoviesByCollection(cast, op, FieldENUM.ACTORS, utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

    /**
     * Example Search By Genre
     * REST: http://localhost:8080/movie/genre?genres=Drama&page=0&size=20
     * REST : http://localhost:8080/movie/genre?size=20&sortBy=voteAverage&sortOrder=DESC&genres=Action,Adventure&page=0
     * REST (OR): http://localhost:8080/movie/genre?genres=Acton,Drama&page=0&size=20&operator=OR
     * REST (AND): http://localhost:8080/movie/genre?genres=Action,Adventure&page=0&size=20&operator=AND
     * REST (AND): http://localhost:8080/movie/genre?genres=Action,Adventure&page=0&size=20&operator=NOT
     * REDIS: "FT.SEARCH" "io.redis.model.MovieIdx" "@genre:{ Drama|Acton}" "LIMIT" "0" "20"
     * REDIS (OR): "FT.SEARCH" "io.redis.model.MovieIdx" "@genre:{Action | Adventure}" "LIMIT" "0" "20"
     * REDIS (AND): "FT.SEARCH" "io.redis.model.MovieIdx" "@genre:{Action} @genre:{Adventure} " "LIMIT" "0" "20"
     * REDIS (NOT): "FT.SEARCH" "io.redis.model.MovieIdx" "-@genre:{Action|Adventure} " "LIMIT" "0" "20"
     *
     * @param genres
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/genre")
    public Page<Movie> findByGenre(@RequestParam(name = "genres") String genres,
                                   @RequestParam(name = "operator", required = false) String operator,
                                   @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                   @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                   @RequestParam(name = "sortBy", required = false, defaultValue = "voteAverage") String sortByField,
                                   @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) throws Exception {

        // Create collection of unique elements
        Set<String> genresCollection = Set.of(genres.split(","));

        // Determine operation, default to OR/IN
        OperatorENUM operatorENUM = genresCollection.size() == 1
                ? OperatorENUM.OR
                : OperatorENUM.fromString(operator);

        return movieService.getMoviesByCollection(
                genresCollection,
                operatorENUM,
                FieldENUM.GENRE,
                utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

    /**
     * Example Generic Search
     * REST: http://localhost:8080/movie/search/?page=2&size=20&query=Avengers (Returns 20 results)
     * REST: http://localhost:8080/movie/search/?page=2&size=20&query=The Matrix (Returns 7 results)
     * REST: http://localhost:8080/movie/search/?page=2&size=20&query=Guardians Galaxy (Returns 2 results)
     * REDIS: "FT.SEARCH" "io.redis.model.MovieIdx" "Avengers" "LIMIT" "0" "20"
     * REDIS: "FT.SEARCH" "io.redis.model.MovieIdx" "The Matrix" "LIMIT" "0" "20"
     * REDIS: "FT.SEARCH" "io.redis.model.MovieIdx" "Guardians Galaxy" "LIMIT" "0" "20"
     *
     * @param query
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/search")
    public Page<Movie> search(@RequestParam(name = "query") String query,
                              @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                              @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                              @RequestParam(name = "sortBy", required = false, defaultValue = "popularity") String sortByField,
                              @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) throws UnsupportedEncodingException {

        log.info("Repository Method: {}", "search(" + query + ", pageable)");
        return repository.search(query, utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

    @GetMapping("/top/{sort}")
    public Page<Movie> getSortedMovies(@PathVariable(name = "sort") String sort,
                                       @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                       @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                       @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) throws UnsupportedEncodingException {
        return repository.search("*", utils.buildPageRequest(page, size, SortValueENUM.fromString(sort).getSortValue(), sortOrder));
    }

    /**
     * Example of Delegating request to a service (MovieService)
     * REST : http://localhost:8080/movie/year/2016?page=2&size=20 (Returns 297 results)
     * REDIS: "FT.SEARCH" "io.redis.model.MovieIdx" "@year:[2016 2016]" "LIMIT" "0" "20"
     *
     * @param year
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/year/{year}")
    public Page<Movie> findByYear(@PathVariable(name = "year") int year,
                                  @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                  @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                  @RequestParam(name = "sortBy", required = false, defaultValue = "voteAverage") String sortByField,
                                  @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) {

        // Check int provided is a valid year
        utils.validateYear(year);

        log.info("Repository Method: {}", "findByReleaseDateUTCBetween("
                + utils.getStartOfTheYearUTC(year)
                + ", " + utils.getEndOfTheYearUTC(year) + ")");

        return repository.findByReleaseDateUTCBetween(
                utils.getStartOfTheYearUTC(year),
                utils.getEndOfTheYearUTC(year),
                utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

    /**
     * Example of invoking repository directly
     * REST : http://localhost:8080/movie/years/2000/2004?page=0&size=20 (Returns 986 results)
     * REDIS : "FT.SEARCH" "io.redis.model.MovieIdx" "@year:[2000 2004]" "LIMIT" "0" "20"
     *
     * @param gt
     * @param lt
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/years/{gt}/{lt}")
    public Page<Movie> findByYearBetween(@PathVariable("gt") int gt, @PathVariable("lt") int lt,
                                         @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                         @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                         @RequestParam(name = "sortBy", required = false, defaultValue = "voteAverage") String sortByField,
                                         @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) {

        // Check int provided is a valid year
        utils.validateYear(gt);
        utils.validateYear(lt);

        log.info("Repository Method: {}", "findByReleaseDateUTCBetween("
                + utils.getStartOfTheYearUTC(gt)
                + ", " + utils.getEndOfTheYearUTC(lt) + ")");

        // Return a paged response Sorted by VoteAverage
        return repository.findByReleaseDateUTCBetween(
                utils.getStartOfTheYearUTC(gt),
                utils.getEndOfTheYearUTC(lt),
                utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

    /**
     * REST : http://localhost:8080/movie/advanced/search?page=0&size=20' \
     * --data-raw '{
     * "actorOperator": "AND",
     * "actors": "Chris Evans,Scarlett Johansson",
     * "budgetGTE": 50000000,
     * "genres": "Action",
     * "query": "Avengers",
     * "releaseDateGTE": 1104541200,
     * "runtimeGTE": 100,
     * "runtimeLTE": 300,
     * "voteAverageGTE": 7.0,
     * "voteCountGTE": 1000
     * }'
     * (Returns 6 results)
     * REDIS : "FT.SEARCH" "io.redis.model.MovieIdx" "Avengers @actors:{Chris Evans} @actors:{Scarlett Johansson}
     *      @genres:{Action} @voteAverage:[7.0 inf] @voteCount:[1000 inf] @budget:[50000000 inf] @runtime:[100 300]
     *      @releaseDateUTC:[1104541200 inf]" "SORTBY" "popularity" "DESC" "LIMIT" "0" "20"
     *
     * @param movieQueryFilter
     * @param page
     * @param size
     * @return
     * @genre:{Action|Sci\\-Fi} @rating:[7 9] @year:[2005 inf]" "LIMIT" "0" "20"
     */
    @PostMapping("/advanced/search")
    public Page<Movie> advancedSearch(@RequestBody MovieQueryFilter movieQueryFilter,
                                      @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                      @RequestParam(name = "size", required = false, defaultValue = "20") int size,
                                      @RequestParam(name = "sortBy", required = false, defaultValue = "popularity") String sortByField,
                                      @RequestParam(name = "sortOrder", required = false, defaultValue = "DESC") Direction sortOrder) {
        return movieService.getMoviesByAdvancedSearch(movieQueryFilter, utils.buildPageRequest(page, size, sortByField, sortOrder));
    }

}
