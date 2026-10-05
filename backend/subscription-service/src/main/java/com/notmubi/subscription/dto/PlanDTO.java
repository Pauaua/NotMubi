package com.notmubi.subscription.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private Integer maxMovies;
    private String cultLevelAccess;
}