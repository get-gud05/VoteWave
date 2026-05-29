package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.votewave.backend.repository.*;
import com.votewave.backend.model.*;
import com.votewave.backend.dto.VoteRequest;
import com.votewave.backend.service.VoteService;

@RestController
@RequestMapping("/vote")
@CrossOrigin
public class VoteController {

    @Autowired
    private VoteRepository voteRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CandidateRepository candidateRepo;

    @Autowired
    private VoteService voteService;

    @PostMapping
    public String vote(@RequestBody VoteRequest req) {

        if (voteRepo.existsByUserId(req.userId)) {
            throw new RuntimeException("User already voted");
        }

        // Calculate suspicion score
        int suspicionScore = voteService.calculateSuspicionScore(req.userId);

        Vote vote = new Vote();
        vote.setUserId(req.userId);
        vote.setCandidateId(req.candidateId);
        vote.setSuspicionScore(suspicionScore);
        vote.setTimestamp(System.currentTimeMillis());
        voteRepo.save(vote);

        // Update user suspicion percentage
        voteService.processVote(req.userId, suspicionScore);

        // update user
        User user = userRepo.findById(req.userId).orElseThrow();
        user.setHasVoted(true);
        userRepo.save(user);

        // update candidate votes
        Candidate c = candidateRepo.findById(req.candidateId).orElseThrow();
        c.setVotes(c.getVotes() + 1);
        candidateRepo.save(c);

        return "Vote cast successfully";
    }
}