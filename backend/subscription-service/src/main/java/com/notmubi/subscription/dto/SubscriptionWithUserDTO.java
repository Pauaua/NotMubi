package com.notmubi.subscription.dto;

import com.notmubi.subscription.client.UserDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionWithUserDTO {
    private SubscriptionDTO subscription;
    private UserDTO user;
}