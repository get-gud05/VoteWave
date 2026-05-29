package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

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

    @GetMapping("/users-suspicion")
    public List<Map<String, Object>> getUsersSuspicion() {
        return userRepo.findAll().stream()
            .map(user -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("name", user.getName());
                map.put("email", user.getEmail());
                map.put("suspicionPercentage", String.format("%.2f", user.getSuspicionPercentage()));
                map.put("hasVoted", user.isHasVoted());
                return map;
            })
            .sorted((a, b) -> Double.compare(
                Double.parseDouble((String) b.get("suspicionPercentage")),
                Double.parseDouble((String) a.get("suspicionPercentage"))
            ))
            .collect(Collectors.toList());
    }

    @PostMapping("/reset-election")
    public Map<String, String> resetElection() {
        voteRepo.deleteAll();
        candidateRepo.deleteAll();
        
        List<User> users = userRepo.findAll();
        for (User user : users) {
            user.setHasVoted(false);
            user.setSuspicionPercentage(0);
        }
        userRepo.saveAll(users);
        
        return Map.of("message", "Election reset successfully. All votes cleared and users can vote again.");
    }
}