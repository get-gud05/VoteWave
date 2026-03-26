package com.votewave.backend.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb+srv://akshatdangwal07_db_user:akshatmongodb@votewave.pvok6ur.mongodb.net/votingdb?retryWrites=true&w=majority");
    }
}