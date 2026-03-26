package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.votewave.backend.model.Candidate;
import com.votewave.backend.repository.CandidateRepository;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private CandidateRepository repo;

    @GetMapping("/results")
    public List<Candidate> results() {
        return repo.findAll();
    }
}