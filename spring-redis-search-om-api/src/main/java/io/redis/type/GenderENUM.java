package io.redis.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum GenderENUM {

    MALE("Male"),
    FEMALE("Female"),
    UNKNOWN("Unknown");

    private String gender;

    public static GenderENUM fromString(String s) throws IllegalArgumentException {
        return Arrays.stream(GenderENUM.values())
                .filter(v -> v.gender.equalsIgnoreCase(s))
                .findFirst()
                .orElse(GenderENUM.UNKNOWN);
    }
}