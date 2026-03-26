package com.votewave.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.votewave.backend.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}