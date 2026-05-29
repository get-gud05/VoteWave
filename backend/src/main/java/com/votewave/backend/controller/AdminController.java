package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;

import com.votewave.backend.model.Candidate;
import com.votewave.backend.model.User;
import com.votewave.backend.repository.CandidateRepository;
import com.votewave.backend.repository.UserRepository;
import com.votewave.backend.repository.VoteRepository;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private CandidateRepository candidateRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private VoteRepository voteRepo;

    @GetMapping("/results")
    public List<Candidate> results() {
        return candidateRepo.findAll();
    }

    @PostMapping("/reset-election")
    public Map<String, String> resetElection() {
        voteRepo.deleteAll();
        candidateRepo.deleteAll();
        
        List<User> users = userRepo.findAll();
        for (User user : users) {
            user.setHasVoted(false);
        }
        userRepo.saveAll(users);
        
        return Map.of("message", "Election reset successfully. All votes cleared and users can vote again.");
    }
}