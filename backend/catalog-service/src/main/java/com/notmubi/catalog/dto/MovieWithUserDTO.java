package com.notmubi.catalog.dto;

import com.notmubi.catalog.client.UserDTO;
import com.notmubi.catalog.entity.CultLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieWithUserDTO {
    private Long movieId;
    private String title;
    private Integer year;
    private String director;
    private CultLevel cultLevel;
    private UserDTO user;
}