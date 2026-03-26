package com.votewave.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.votewave.backend.model.Candidate;

public interface CandidateRepository extends MongoRepository<Candidate, String> {}