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

    // ---------- NUEVOS CAMPOS PARA VIDEO ----------

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "video_provider")
    private VideoProvider videoProvider;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;
}