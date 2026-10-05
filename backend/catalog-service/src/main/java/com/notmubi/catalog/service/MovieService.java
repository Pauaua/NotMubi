package com.notmubi.catalog.service;

import com.notmubi.catalog.client.AuthClient;
import com.notmubi.catalog.client.UserDTO;
import com.notmubi.catalog.dto.MovieWithUserDTO;
import com.notmubi.catalog.entity.CultLevel;
import com.notmubi.catalog.entity.Movie;
import com.notmubi.catalog.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final AuthClient authClient;   // 👈 NUEVO: cliente Feign al auth-service

    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    public Movie findById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Película no encontrada: " + id));
    }

    public Movie create(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie update(Long id, Movie updated) {
        Movie existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setYear(updated.getYear());
        existing.setSynopsis(updated.getSynopsis());
        existing.setDirector(updated.getDirector());
        existing.setCultLevel(updated.getCultLevel());
        existing.setRating(updated.getRating());
        return movieRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id); // lanza excepción si no existe
        movieRepository.deleteById(id);
    }

    public List<Movie> findByCultLevel(CultLevel level) {
        return movieRepository.findByCultLevel(level);
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * NUEVO: Combina datos de la película (de nuestra BD) con datos del usuario
     * obtenidos del auth-service mediante una llamada HTTP con Feign.
     */
    public MovieWithUserDTO getMovieWithUser(Long movieId, Long userId) {
        Movie movie = findById(movieId);          // De nuestra BD
        UserDTO user = authClient.getUserById(userId);  // 🚀 Llamada HTTP al auth-service

        return MovieWithUserDTO.builder()
                .movieId(movie.getId())
                .title(movie.getTitle())
                .year(movie.getYear())
                .director(movie.getDirector())
                .cultLevel(movie.getCultLevel())
                .user(user)
                .build();
    }
}