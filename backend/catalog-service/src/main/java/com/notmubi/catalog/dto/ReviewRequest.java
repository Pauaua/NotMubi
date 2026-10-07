package com.notmubi.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    @NotNull
    private Long movieId;

    @NotNull
    private Long userId;

    @NotBlank
    private String username;

    @NotNull
    @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}
