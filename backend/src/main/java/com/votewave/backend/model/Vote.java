package com.votewave.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
@Document(collection = "votes")
public class Vote {

    @Id
    private String id;

    private String userId;
    private String candidateId;
}