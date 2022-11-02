package io.redis.type;

import java.util.Arrays;

public enum FieldENUM {

    ACTORS("actors"),
    GENRE("genres"),
    DIRECTOR("directors"),
    WRITERS("writers"),
    RATING("voteAverage"),
    BUDGET("budget"),
    RUNTIME("runtime"),
    RELEASE_YEAR("year"),
    RELEASE_DATE("releaseDateUTC"),
    POPULARITY("popularity"),
    VOTE_AVERAGE("voteAverage"),
    VOTE_COUNT("voteCount"),
    META_RATING("metascore");

    private String fieldName;

    FieldENUM(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public static FieldENUM fromString(String s) throws IllegalArgumentException {
        return Arrays.stream(FieldENUM.values())
                .filter(v -> v.fieldName.equals(s))
                .findFirst()
                .orElse(null);
    }
}