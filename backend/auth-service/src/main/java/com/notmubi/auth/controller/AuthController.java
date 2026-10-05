package com.notmubi.auth.controller;

import com.notmubi.auth.dto.AuthResponse;
import com.notmubi.auth.dto.RegisterRequest;
import com.notmubi.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        return authService.login(username, password);
    }

    @GetMapping("/validate")
    public Map<String, Object> validate() {
        // Si llega aquí, es porque el filtro de seguridad ya validó el token
        return Map.of("valid", true);
    }
}