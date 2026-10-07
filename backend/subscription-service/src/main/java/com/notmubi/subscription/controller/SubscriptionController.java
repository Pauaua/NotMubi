package com.notmubi.subscription.controller;

import com.notmubi.subscription.dto.SubscribeRequest;
import com.notmubi.subscription.dto.SubscriptionDTO;
import com.notmubi.subscription.dto.SubscriptionWithUserDTO;
import com.notmubi.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * Suscribirse a un plan.
     * El usuario se identifica con el header X-User-Id (lo añade el Gateway tras validar JWT).
     */
    @PostMapping("/subscribe")
    public SubscriptionWithUserDTO subscribe(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid SubscribeRequest request) {
        return subscriptionService.subscribe(userId, request);
    }

    /**
     * Ver la suscripción activa del usuario autenticado.
     */
    @GetMapping("/me")
    public SubscriptionWithUserDTO getMySubscription(
            @RequestHeader("X-User-Id") Long userId) {
        return subscriptionService.getActiveByUserId(userId);
    }

    /**
     * Cancelar la suscripción activa del usuario autenticado.
     */
    @PostMapping("/me/cancel")
    public SubscriptionDTO cancelMySubscription(
            @RequestHeader("X-User-Id") Long userId) {
        return subscriptionService.cancel(userId);
    }

    @GetMapping("/all")
    public List<SubscriptionWithUserDTO> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> adminCancelSubscription(@PathVariable Long id) {
        subscriptionService.adminCancel(id);
        return ResponseEntity.noContent().build();
    }
}