package io.redis.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MovieQueryFilter {
    String query;
    String actors;
    String actorOperator;
    String directors;
    String directorOperator;
    String writers;
    String writerOperator;
    String genres;
    String genreOperator;
    Double voteAverageGTE;
    Long voteCountGTE;
    Long budgetGTE;
    Long releaseDateGTE;
    Long releaseDateLTE;
    Long popularityGTE;
    Long popularityLTE;
    Long runtimeGTE;
    Long runtimeLTE;
}