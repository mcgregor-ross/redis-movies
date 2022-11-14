package io.redis.model;

import com.google.gson.annotations.SerializedName;
import com.redis.om.spring.annotations.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Movie {

    @Id
    private long id;

    @TagIndexed
    @SerializedName(value = "imdbId", alternate = "imdb_id")
    private String imdbId;

    @TagIndexed
    @SerializedName(value = "language", alternate = "original_language")
    private String language;

    @Searchable(weight = 3.0, sortable = true)
    private String title;

    @Searchable(weight = 1.0)
    private String overview;

    @TagIndexed
    private String status;

    @Searchable(weight = 1.0)
    private String tagline;

    @NumericIndexed(sortable = true)
    private double popularity;

    @NumericIndexed(sortable = true)
    @SerializedName(value = "voteAverage", alternate = "vote_average")
    private double voteAverage;

    @NumericIndexed(sortable = true, fieldName = "voteCount")
    @SerializedName(value = "voteCount", alternate = "vote_count")
    private long voteCount;

    @NumericIndexed(sortable = true)
    private long budget;

    @NumericIndexed(sortable = true)
    private int runtime;

    @NumericIndexed(sortable = true)
    private long revenue;

    @SerializedName(value = "posterImage", alternate = "poster_path")
    private String posterImage;

    @NumericIndexed(sortable = true)
    private long releaseDateUTC;

    @NumericIndexed(sortable = true)
    private long year;

    @TagIndexed
    private List<String> genres;

    @TagIndexed
    private List<String> actors;

    @Indexed
    @TagIndexed
    private List<String> directors;

    @TagIndexed
    private List<String> writers;

    //  TODO: Add Nested List<Object> Search when available in RediSearch &/or RedisOM
    @SerializedName(value = "castList", alternate = "cast")
    private List<CastMember> castList;

    @Indexed
    @SerializedName(value = "directorList", alternate = "director")
    private List<CrewMember> directorList;

    @SerializedName(value = "writerList", alternate = "writer")
    private List<CrewMember> writerList;

}