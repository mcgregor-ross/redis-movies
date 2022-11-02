package io.redis.repository;

import com.redis.om.spring.annotations.Query;
import com.redis.om.spring.repository.RedisDocumentRepository;
import io.redis.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MovieRepository extends RedisDocumentRepository<Movie, String> {

    Page<Movie> search(String searchCriteria, Pageable pageable);

    @Query("@actors:{$actors}")
    Page<Movie> findByActors(@Param("actors") Set<String> actors, Pageable pageable);

    Page<Movie> findByGenres(@Param("genres") Set<String> genres, Pageable pageable);

    @Query("-@genres:{$genres}")
    Page<Movie> findByGenresNot(@Param("genres") Set<String> genres, Pageable pageable);

    Page<Movie> findByReleaseDateUTCBetween(long releaseDateUTCGT, long releaseDateUTCLT, Pageable pageable);

    Page<Movie> findAll(Pageable pageable);

    @Query("@directors:{$directors}")
    Page<Movie> findByDirectors(@Param("directors") String directors, Pageable pageable);


}
