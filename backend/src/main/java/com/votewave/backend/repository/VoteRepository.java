package com.votewave.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.votewave.backend.model.Vote;
import java.util.List;

public interface VoteRepository extends MongoRepository<Vote, String> {
    boolean existsByUserId(String userId);
    List<Vote> findByUserId(String userId);
    List<Vote> findByTimestampGreaterThan(long timestamp);
    List<Vote> findByUserIdAndTimestampGreaterThan(String userId, long timestamp);
}