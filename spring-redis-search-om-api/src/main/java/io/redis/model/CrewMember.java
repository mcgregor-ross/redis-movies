package io.redis.model;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.redis.om.spring.annotations.Document;
import com.redis.om.spring.annotations.Searchable;
import io.redis.serialisation.GenderDeserialiser;
import io.redis.type.GenderENUM;
import lombok.Data;

@Data
public class CrewMember {

    String id;
    String job;

    @Searchable(weight = 3.0)
    String name;

    @JsonAdapter(GenderDeserialiser.class)
    GenderENUM gender;

    @SerializedName(value = "profileImage", alternate = "profile_path")
    String profileImage;

    public void setGender(String gender) {
        this.gender = GenderENUM.fromString(gender);
    }
}
