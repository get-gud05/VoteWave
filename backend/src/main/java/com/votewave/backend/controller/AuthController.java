package com.votewave.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.votewave.backend.model.User;
import com.votewave.backend.repository.UserRepository;
import com.votewave.backend.dto.RegisterRequest;
import com.votewave.backend.dto.LoginRequest;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest req) {

        if (userRepo.findByEmail(req.email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(req.name);
        user.setEmail(req.email);
        user.setPassword(req.password);
        user.setRole("voter");
        user.setHasVoted(false);

        return userRepo.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest req) {

        User user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(req.password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}