package com.notmubi.subscription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscribeRequest {

    @NotNull
    private Long planId;
}