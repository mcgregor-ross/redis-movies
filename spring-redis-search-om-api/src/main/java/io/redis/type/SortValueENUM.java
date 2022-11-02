package io.redis.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum SortValueENUM {

    RATED("voteAverage"),
    RATING("voteAverage"),
    POPULAR("popularity"),
    POPULARITY("popularity"),
    COUNT("voteCount"),
    BUDGET("budget"),
    RUNTIME("runtime"),
    REVENUE("revenue"),
    DATE("releaseDateUTC");

    private String sortValue;

    public static SortValueENUM fromString(String s) throws IllegalArgumentException {

        return Arrays.stream(SortValueENUM.values())
                .filter(v ->  v.name().equalsIgnoreCase(s))
                .findFirst()
                .orElse(SortValueENUM.RATED);
    }
}