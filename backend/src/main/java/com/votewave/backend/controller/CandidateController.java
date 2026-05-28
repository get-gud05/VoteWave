package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;


import com.votewave.backend.model.Candidate;   
import com.votewave.backend.repository.CandidateRepository; 

@RestController
@RequestMapping("/candidates")
@CrossOrigin
public class CandidateController {

    @Autowired
    private CandidateRepository repo;

    @GetMapping
    public List<Candidate> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        candidate.setVotes(0);
        return repo.save(candidate);
    }

    @DeleteMapping("/{id}")
    public java.util.Map<String, String> deleteCandidate(@PathVariable String id) {
        repo.deleteById(id);
        return java.util.Map.of("message", "Candidate deleted successfully");
    }
}