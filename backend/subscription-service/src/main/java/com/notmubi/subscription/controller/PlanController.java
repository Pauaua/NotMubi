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
}