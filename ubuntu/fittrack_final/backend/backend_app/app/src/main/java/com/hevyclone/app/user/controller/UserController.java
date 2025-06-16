package com.hevyclone.app.user.controller;

import com.hevyclone.app.user.dto.UserProfileResponseDTO;
import com.hevyclone.app.user.dto.UserUpdateRequestDTO;
import com.hevyclone.app.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hevyclone.app.auth.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponseDTO> getProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl principal) {

        if (!id.equals(principal.getId())) {
            return ResponseEntity.status(403).build();
        }

        UserProfileResponseDTO profile = userService.getProfile(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateAuthenticatedProfile(
            @Valid @RequestBody UserUpdateRequestDTO dto) {
    
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
    
        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
    
        userService.updateProfile(principal.getId(), dto);
        return ResponseEntity.noContent().build();
    }    
    
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> getAuthenticatedUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        UserProfileResponseDTO profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(profile);
    }

    

}
