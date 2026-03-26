package com.votewave.backend.dto;

import lombok.Data;

@Data
public class VoteRequest {
    public String userId;
    public String candidateId;
}