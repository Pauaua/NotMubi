package com.notmubi.auth.controller;

import com.notmubi.auth.dto.UserDTO;
import com.notmubi.auth.entity.User;
import com.notmubi.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // ---------- Endpoints públicos / internos (usados vía Feign) ----------

    @GetMapping("/auth/users/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        return toDTO(user);
    }

    @GetMapping("/auth/users/by-username/{username}")
    public UserDTO getUserByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        return toDTO(user);
    }

    // ---------- Endpoints ADMIN ----------

    @GetMapping("/auth/admin/users")
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @PutMapping("/auth/admin/users/{id}/role")
    public UserDTO updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole == null || (!newRole.equals("USER") && !newRole.equals("ADMIN"))) {
            throw new RuntimeException("Rol inválido. Debe ser USER o ADMIN");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));

        user.setRole(newRole);
        userRepository.save(user);
        return toDTO(user);
    }

    @PutMapping("/auth/admin/users/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        if (body.containsKey("username") && !body.get("username").isBlank()) {
            user.setUsername(body.get("username"));
        }
        if (body.containsKey("email") && !body.get("email").isBlank()) {
            user.setEmail(body.get("email"));
        }
        if (body.containsKey("role") && (body.get("role").equals("USER") || body.get("role").equals("ADMIN"))) {
            user.setRole(body.get("role"));
        }
        userRepository.save(user);
        return toDTO(user);
    }

    @DeleteMapping("/auth/admin/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado: " + id);
        }
        userRepository.deleteById(id);
    }

    // ---------- Helper ----------

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}