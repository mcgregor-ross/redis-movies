package io.redis.serialisation;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import io.redis.type.GenderENUM;

import java.lang.reflect.Type;

public class GenderDeserialiser implements JsonDeserializer<GenderENUM> {

    @Override
    public GenderENUM deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        return GenderENUM.fromString(jsonElement.getAsString());
    }
}
