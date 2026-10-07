package com.notmubi.subscription.controller;

import com.notmubi.subscription.dto.PlanDTO;
import com.notmubi.subscription.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public List<PlanDTO> getAllPlans() {
        return planService.findAllPlans();
    }

    @GetMapping("/{id}")
    public PlanDTO getPlanById(@PathVariable Long id) {
        return planService.findPlanById(id);
    }

    @PostMapping
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public PlanDTO createPlan(@RequestBody @jakarta.validation.Valid PlanDTO dto) {
        return planService.create(dto);
    }

    @PutMapping("/{id}")
    public PlanDTO updatePlan(@PathVariable Long id, @RequestBody @jakarta.validation.Valid PlanDTO dto) {
        return planService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.delete(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}