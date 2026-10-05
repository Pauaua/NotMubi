package com.notmubi.subscription.repository;

import com.notmubi.subscription.entity.Subscription;
import com.notmubi.subscription.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    List<Subscription> findByUserId(Long userId);

    boolean existsByUserIdAndStatus(Long userId, SubscriptionStatus status);
}