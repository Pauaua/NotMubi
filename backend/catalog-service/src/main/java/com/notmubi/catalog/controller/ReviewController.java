package com.notmubi.catalog.controller;

import com.notmubi.catalog.dto.ReviewDTO;
import com.notmubi.catalog.dto.ReviewRequest;
import com.notmubi.catalog.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/reviews")
    public List<ReviewDTO> getAll() {
        return reviewService.findAll();
    }

    @GetMapping("/api/movies/{movieId}/reviews")
    public List<ReviewDTO> getByMovie(@PathVariable Long movieId) {
        return reviewService.findByMovie(movieId);
    }

    @PostMapping("/api/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDTO create(@RequestBody @Valid ReviewRequest req) {
        return reviewService.create(req);
    }

    @PutMapping("/api/reviews/{id}")
    public ReviewDTO update(@PathVariable Long id, @RequestBody @Valid ReviewRequest req) {
        return reviewService.update(id, req);
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
