package com.notmubi.catalog.service;

import com.notmubi.catalog.dto.ReviewDTO;
import com.notmubi.catalog.dto.ReviewRequest;
import com.notmubi.catalog.entity.Movie;
import com.notmubi.catalog.entity.Review;
import com.notmubi.catalog.repository.MovieRepository;
import com.notmubi.catalog.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;

    public List<ReviewDTO> findAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ReviewDTO> findByMovie(Long movieId) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public ReviewDTO create(ReviewRequest req) {
        Review review = Review.builder()
                .movieId(req.getMovieId())
                .userId(req.getUserId())
                .username(req.getUsername())
                .rating(req.getRating())
                .comment(req.getComment())
                .build();
        return toDTO(reviewRepository.save(review));
    }

    public ReviewDTO update(Long id, ReviewRequest req) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review no encontrada: " + id));
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        return toDTO(reviewRepository.save(review));
    }

    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review no encontrada: " + id);
        }
        reviewRepository.deleteById(id);
    }

    private ReviewDTO toDTO(Review r) {
        String movieTitle = movieRepository.findById(r.getMovieId())
                .map(Movie::getTitle)
                .orElse("Película desconocida");
        return ReviewDTO.builder()
                .id(r.getId())
                .movieId(r.getMovieId())
                .movieTitle(movieTitle)
                .userId(r.getUserId())
                .username(r.getUsername())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
