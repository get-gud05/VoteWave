package com.votewave.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.votewave.backend.model.Vote;

public interface VoteRepository extends MongoRepository<Vote, String> {
    boolean existsByUserId(String userId);
}