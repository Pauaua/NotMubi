package com.notmubi.catalog.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long userId;
    private String username;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
