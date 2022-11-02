package io.redis.serialisation;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.redis.type.GenderENUM;

import java.lang.reflect.Type;
import java.time.LocalDate;

public class JsonMovieSerialiser implements JsonSerializer {

    @Override
    public JsonElement serialize(Object o, Type type, JsonSerializationContext jsonSerializationContext) {
        if (o instanceof GenderENUM) {
            return new JsonPrimitive(((GenderENUM) o).getGender());
        }

        if (o instanceof LocalDate) {
            return new JsonPrimitive(((LocalDate) o).toString());
        }
        return null;
    }
}
