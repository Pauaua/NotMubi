package com.notmubi.subscription.service;

import com.notmubi.subscription.dto.PlanDTO;
import com.notmubi.subscription.entity.Plan;
import com.notmubi.subscription.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanDTO> findAllPlans() {
        return planRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public PlanDTO findPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado: " + id));
        return toDTO(plan);
    }

    public PlanDTO create(PlanDTO dto) {
        Plan plan = Plan.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .maxMovies(dto.getMaxMovies())
                .cultLevelAccess(dto.getCultLevelAccess())
                .build();
        return toDTO(planRepository.save(plan));
    }

    public PlanDTO update(Long id, PlanDTO dto) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado: " + id));
        plan.setName(dto.getName());
        plan.setPrice(dto.getPrice());
        plan.setDescription(dto.getDescription());
        plan.setMaxMovies(dto.getMaxMovies());
        plan.setCultLevelAccess(dto.getCultLevelAccess());
        return toDTO(planRepository.save(plan));
    }

    public void delete(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan no encontrado: " + id);
        }
        planRepository.deleteById(id);
    }

    public PlanDTO toDTO(Plan plan) {
        return PlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .price(plan.getPrice())
                .description(plan.getDescription())
                .maxMovies(plan.getMaxMovies())
                .cultLevelAccess(plan.getCultLevelAccess())
                .build();
    }
}