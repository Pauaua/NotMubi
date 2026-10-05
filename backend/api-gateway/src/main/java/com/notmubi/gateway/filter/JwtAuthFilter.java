package com.notmubi.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    @Value("${jwt.secret}")
    private String secret;

    /**
     * Rutas que NO requieren token JWT.
     */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/register",
            "/auth/login",
            "/actuator",
            "/api/subscriptions/plans"
    );

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // 1. Dejar pasar peticiones CORS preflight (OPTIONS) sin token
            if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }

            // 2. Dejar pasar rutas públicas sin token
            if (isPublicPath(path)) {
                return chain.filter(exchange);
            }

            // 3. Validar el token JWT
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return unauthorized(exchange, "Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                Long userId = claims.get("userId", Long.class);

                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(r -> r
                                .header("X-User-Username", username)
                                .header("X-User-Role", role)
                                .header("X-User-Id", userId != null ? userId.toString() : ""))
                        .build();

                return chain.filter(mutatedExchange);

            } catch (Exception e) {
                return unauthorized(exchange, "Invalid or expired token: " + e.getMessage());
            }
        };
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"error\":\"Unauthorized\",\"message\":\"%s\"}", message);
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static class Config {
    }
}