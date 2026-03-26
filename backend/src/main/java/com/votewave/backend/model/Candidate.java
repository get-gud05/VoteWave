package com.votewave.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
@Document(collection = "candidates")
public class Candidate {

    @Id
    private String id;

    private String name;
    private String party;
    private int votes;
}