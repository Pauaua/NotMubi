package com.notmubi.subscription.service;

import com.notmubi.subscription.client.AuthClient;
import com.notmubi.subscription.client.UserDTO;
import com.notmubi.subscription.dto.PlanDTO;
import com.notmubi.subscription.dto.SubscribeRequest;
import com.notmubi.subscription.dto.SubscriptionDTO;
import com.notmubi.subscription.dto.SubscriptionWithUserDTO;
import com.notmubi.subscription.entity.Plan;
import com.notmubi.subscription.entity.Subscription;
import com.notmubi.subscription.entity.SubscriptionStatus;
import com.notmubi.subscription.repository.PlanRepository;
import com.notmubi.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final PlanService planService;
    private final AuthClient authClient;

    /**
     * Suscribe a un usuario a un plan.
     * 1. Valida que el usuario existe (Feign → auth-service)
     * 2. Valida que el plan existe
     * 3. Comprueba que el usuario no esté ya suscrito
     * 4. Crea la suscripción
     */
    public SubscriptionWithUserDTO subscribe(Long userId, SubscribeRequest request) {
        // 1. Validar usuario (Feign)
        UserDTO user = authClient.getUserById(userId);

        // 2. Validar plan
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado: " + request.getPlanId()));

        // 3. ¿Ya está suscrito?
        if (subscriptionRepository.existsByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)) {
            throw new RuntimeException("El usuario ya tiene una suscripción activa");
        }

        // 4. Crear suscripción
        Subscription subscription = Subscription.builder()
                .userId(userId)
                .plan(plan)
                .status(SubscriptionStatus.ACTIVE)
                .startedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMonths(1))   // 1 mes
                .build();

        Subscription saved = subscriptionRepository.save(subscription);

        return SubscriptionWithUserDTO.builder()
                .subscription(toDTO(saved))
                .user(user)
                .build();
    }

    /**
     * Obtiene la suscripción activa de un usuario, con datos del plan y del usuario (Feign).
     */
    public SubscriptionWithUserDTO getActiveByUserId(Long userId) {
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene suscripción activa"));

        UserDTO user = authClient.getUserById(userId);

        return SubscriptionWithUserDTO.builder()
                .subscription(toDTO(subscription))
                .user(user)
                .build();
    }

    /**
     * Cancela la suscripción activa de un usuario.
     */
    public SubscriptionDTO cancel(Long userId) {
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene suscripción activa"));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        Subscription saved = subscriptionRepository.save(subscription);

        return toDTO(saved);
    }

    public List<SubscriptionWithUserDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(s -> {
                    UserDTO user;
                    try {
                        user = authClient.getUserById(s.getUserId());
                    } catch (Exception e) {
                        user = UserDTO.builder().id(s.getUserId()).username("Usuario #" + s.getUserId()).build();
                    }
                    return SubscriptionWithUserDTO.builder()
                            .subscription(toDTO(s))
                            .user(user)
                            .build();
                })
                .toList();
    }

    public SubscriptionDTO adminCancel(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada: " + subscriptionId));
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        return toDTO(subscriptionRepository.save(subscription));
    }

    // ---------- helpers ----------

    public SubscriptionDTO toDTO(Subscription subscription) {
        PlanDTO planDTO = planService.toDTO(subscription.getPlan());

        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .userId(subscription.getUserId())
                .plan(planDTO)
                .status(subscription.getStatus())
                .startedAt(subscription.getStartedAt())
                .expiresAt(subscription.getExpiresAt())
                .build();
    }
}