package com.notmubi.subscription.dto;

import com.notmubi.subscription.entity.SubscriptionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDTO {
    private Long id;
    private Long userId;
    private PlanDTO plan;
    private SubscriptionStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
}