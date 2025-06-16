package com.hevyclone.app.user.service;

import com.hevyclone.app.user.dto.UserProfileResponseDTO;
import com.hevyclone.app.user.dto.UserUpdateRequestDTO;
import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponseDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        UserProfileResponseDTO profile = new UserProfileResponseDTO();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setBio(user.getBio());
        profile.setHeight(user.getHeight());
        profile.setWeight(user.getWeight());
        profile.setAge(user.getAge());
        profile.setFitnessGoal(user.getFitnessGoal());

        return profile;
    }

    public void updateProfile(Long userId, UserUpdateRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setUsername(dto.getName());
        user.setBio(dto.getBio());
        user.setHeight(dto.getHeight());
        user.setWeight(dto.getWeight());
        user.setAge(dto.getAge());
        user.setFitnessGoal(dto.getFitnessGoal());

        userRepository.save(user);
    }
}
