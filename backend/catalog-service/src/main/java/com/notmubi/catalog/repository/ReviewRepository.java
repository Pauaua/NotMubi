package com.notmubi.catalog.repository;

import com.notmubi.catalog.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovieIdOrderByCreatedAtDesc(Long movieId);
    List<Review> findAllByOrderByCreatedAtDesc();
}
