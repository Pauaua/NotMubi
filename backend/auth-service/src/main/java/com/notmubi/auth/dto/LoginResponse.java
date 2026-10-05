package com.notmubi.auth.dto;

import lombok.*;

// Puedes reutilizar AuthResponse para login.
// De momento este DTO queda disponible si necesitas campos adicionales.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String username;
    private String role;
}