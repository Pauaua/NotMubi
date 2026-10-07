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
     * Rutas realmente públicas (no requieren NINGÚN token).
     */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/users",
            "/actuator"
    );

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();
            HttpMethod method = exchange.getRequest().getMethod();

            if (method == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }

            // Rutas admin: /auth/admin/** SIEMPRE requieren token ADMIN
            if (path.startsWith("/auth/admin")) {
                return handleAdminRequest(exchange, chain);
            }

            // Catálogo: GET público para landing page, escritura requiere ADMIN
            if (path.startsWith("/api/movies") && HttpMethod.GET.equals(method)) {
                return chain.filter(exchange);
            }

            // Planes: GET es público, POST/PUT/DELETE requiere ADMIN
            if (path.startsWith("/api/subscriptions/plans")) {
                if (HttpMethod.GET.equals(method)) {
                    return chain.filter(exchange);
                }
                return handleAdminRequest(exchange, chain);
            }

            if (isPublicPath(path)) {
                return chain.filter(exchange);
            }

            // Resto: requiere token válido
            return handleAuthenticatedRequest(exchange, chain);
        };
    }

    private Mono<Void> handleAdminRequest(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
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

            String role = claims.get("role", String.class);
            if (!"ADMIN".equals(role)) {
                return forbidden(exchange, "Se requiere rol ADMIN para esta acción");
            }

            String username = claims.getSubject();
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
    }

    private Mono<Void> handleAuthenticatedRequest(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
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

            if (requiresAdmin(path, exchange.getRequest().getMethod()) && !"ADMIN".equals(role)) {
                return forbidden(exchange, "Se requiere rol ADMIN para esta acción");
            }

            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(r -> r
                            .header("X-User-Username", username)
                            .header("X-User-Role", role != null ? role : "")
                            .header("X-User-Id", userId != null ? userId.toString() : ""))
                    .build();

            return chain.filter(mutatedExchange);
        } catch (Exception e) {
            return unauthorized(exchange, "Invalid or expired token: " + e.getMessage());
        }
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private boolean requiresAdmin(String path, HttpMethod method) {
        if (method == null) return false;
        // Movies CRUD
        if (HttpMethod.POST.equals(method) && path.equals("/api/movies")) return true;
        if ((HttpMethod.PUT.equals(method) || HttpMethod.DELETE.equals(method)) && path.startsWith("/api/movies/")) return true;
        // Reviews admin
        if (HttpMethod.POST.equals(method) && path.equals("/api/reviews")) return true;
        if ((HttpMethod.PUT.equals(method) || HttpMethod.DELETE.equals(method)) && path.startsWith("/api/reviews/")) return true;
        if (HttpMethod.GET.equals(method) && path.equals("/api/reviews")) return true;
        // Subscriptions admin
        if (path.equals("/api/subscriptions/all")) return true;
        if (HttpMethod.DELETE.equals(method) && path.matches("/api/subscriptions/\\d+")) return true;
        return false;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        return writeError(exchange, HttpStatus.UNAUTHORIZED, "Unauthorized", message);
    }

    private Mono<Void> forbidden(ServerWebExchange exchange, String message) {
        return writeError(exchange, HttpStatus.FORBIDDEN, "Forbidden", message);
    }

    private Mono<Void> writeError(ServerWebExchange exchange, HttpStatus status, String error, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String body = String.format("{\"error\":\"%s\",\"message\":\"%s\"}", error, message);
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