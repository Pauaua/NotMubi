package com.notmubi.catalog.repository;

import com.notmubi.catalog.entity.CultLevel;
import com.notmubi.catalog.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByCultLevel(CultLevel cultLevel);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByYearGreaterThanEqual(Integer year);
}