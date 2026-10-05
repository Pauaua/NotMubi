package com.notmubi.catalog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "El año es obligatorio")
    @Column(name = "release_year", nullable = false)
    private Integer year;

    @Column(length = 2000)
    private String synopsis;

    private String director;

    @Enumerated(EnumType.STRING)
    @Column(name = "cult_level", nullable = false)
    private CultLevel cultLevel;

    private Double rating;
}