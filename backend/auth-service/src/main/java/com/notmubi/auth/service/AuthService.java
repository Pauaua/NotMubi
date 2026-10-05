package com.notmubi.auth.service;

import com.notmubi.auth.dto.AuthResponse;
import com.notmubi.auth.dto.RegisterRequest;
import com.notmubi.auth.entity.User;
import com.notmubi.auth.repository.UserRepository;
import com.notmubi.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role("USER")
                .build();

        userRepository.save(user);

        // 👈 ahora pasamos también el userId
        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .message("Usuario registrado correctamente")
                .build();
    }

    public AuthResponse login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 👈 ahora pasamos también el userId
        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .message("Login correcto")
                .build();
    }
}