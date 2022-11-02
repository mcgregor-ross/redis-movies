package io.redis.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneOffset;

@Slf4j
@Component
public class ControllerUtils {

    public PageRequest buildPageRequest(int page, int size, String sortByField, Sort.Direction sortOrder) {
        PageRequest pageRequest = PageRequest.of(page, size);
        if (StringUtils.isNotEmpty(sortByField) && sortOrder != null) {
            pageRequest = pageRequest.withSort(Sort.by(sortOrder, sortByField));
        }
        return pageRequest;
    }

    public void validateYear(int year) {
        // Check int provided is a valid year
        if (year < 1900 || year > LocalDate.now().getYear()) {
            log.error("Please provide a year between 1900 & {}", LocalDate.now().getYear());
            throw new RuntimeException(year + " is an invalid year. Please provide a year between 1900 & "
                    + LocalDate.now().getYear());
        }
    }

    public long getStartOfTheYearUTC(int year) {
        return LocalDate.of(year, Month.JANUARY, 1)
                .atStartOfDay().toEpochSecond(ZoneOffset.UTC);
    }

    public long getEndOfTheYearUTC(int year) {
        return LocalDate.of(year, Month.DECEMBER, 31)
                .atTime(23, 59, 59).toEpochSecond(ZoneOffset.UTC);
    }
}
