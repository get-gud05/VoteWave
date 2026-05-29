package com.votewave.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@Service
public class MLService {

    private static final String ML_API_URL = "http://localhost:8000/predict";
    private final RestTemplate restTemplate = new RestTemplate();

    public int getSuspicionScore(float votesPerMinute, float requestsFromSameIp) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("votes_per_minute", votesPerMinute);
            request.put("requests_from_same_ip", requestsFromSameIp);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            Map<String, Object> response = restTemplate.postForObject(
                ML_API_URL,
                entity,
                Map.class
            );

            if (response != null && response.containsKey("suspicion_score")) {
                return ((Number) response.get("suspicion_score")).intValue();
            }

            return 0;
        } catch (Exception e) {
            System.err.println("Error calling ML API: " + e.getMessage());
            return 0;
        }
    }
}
