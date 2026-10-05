package com.notmubi.subscription.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @GetMapping("/auth/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @GetMapping("/auth/users/by-username/{username}")
    UserDTO getUserByUsername(@PathVariable("username") String username);
}