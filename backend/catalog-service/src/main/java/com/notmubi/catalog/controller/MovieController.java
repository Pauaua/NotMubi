package com.notmubi.catalog.controller;

import com.notmubi.catalog.entity.CultLevel;
import com.notmubi.catalog.entity.Movie;
import com.notmubi.catalog.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public List<Movie> getAll() {
        return movieService.findAll();
    }

    @GetMapping("/{id}")
    public Movie getById(@PathVariable Long id) {
        return movieService.findById(id);
    }

    @GetMapping("/cult/{level}")
    public List<Movie> getByCultLevel(@PathVariable CultLevel level) {
        return movieService.findByCultLevel(level);
    }

    @GetMapping("/search")
    public List<Movie> search(@RequestParam String title) {
        return movieService.searchByTitle(title);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Movie create(@RequestBody @Valid Movie movie) {
        return movieService.create(movie);
    }

    @PutMapping("/{id}")
    public Movie update(@PathVariable Long id, @RequestBody @Valid Movie movie) {
        return movieService.update(id, movie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}