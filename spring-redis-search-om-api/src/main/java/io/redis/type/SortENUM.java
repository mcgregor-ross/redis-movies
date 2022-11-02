package io.redis.type;

import org.springframework.data.domain.Sort;

import java.util.Arrays;

public enum SortENUM {

    ASC(),
    DESC();

    public class Names {
        public static final String ASC = "ASC";
        public static final String DESC = "DESC";
    }

    public static Sort.Direction directionEnum(SortENUM sortENUM){
        return Sort.Direction.fromString(sortENUM.name());
    }

    public static Sort.Direction directionEnum(String sortENUM){
        return Sort.Direction.fromString(sortENUM);
    }

}