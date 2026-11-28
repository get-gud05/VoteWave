package com.votewave.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.votewave.backend.model.Vote;
import com.votewave.backend.model.User;
import com.votewave.backend.repository.VoteRepository;
import com.votewave.backend.repository.UserRepository;
import java.util.List;

@Service
public class VoteService {

    private static final long ONE_MINUTE_MS = 60_000;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MLService mlService;

    public void processVote(String userId, int suspicionScore) {
        List<Vote> userVotes = voteRepository.findByUserId(userId);
        
        int totalSuspicion = suspicionScore;
        for (Vote v : userVotes) {
            totalSuspicion += v.getSuspicionScore();
        }
        
        double suspicionPercentage = (double) totalSuspicion / (userVotes.size() + 1);
        
        User user = userRepository.findById(userId).orElseThrow();
        user.setSuspicionPercentage(suspicionPercentage);
        userRepository.save(user);
    }

    public int calculateSuspicionScore(String userId) {
        float votesPerMinute = calculateVotesPerMinute();
        float requestsFromSameIp = calculateRequestsFromSameIp(userId);
        
        return mlService.getSuspicionScore(votesPerMinute, requestsFromSameIp);
    }

    private float calculateVotesPerMinute() {
        long oneMinuteAgo = System.currentTimeMillis() - ONE_MINUTE_MS;
        List<Vote> recentVotes = voteRepository.findByTimestampGreaterThan(oneMinuteAgo);
        return (float) recentVotes.size();
    }

    private float calculateRequestsFromSameIp(String userId) {
        long oneMinuteAgo = System.currentTimeMillis() - ONE_MINUTE_MS;
        List<Vote> userRecentVotes = voteRepository.findByUserIdAndTimestampGreaterThan(userId, oneMinuteAgo);
        return (float) userRecentVotes.size();
    }
}
