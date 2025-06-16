package com.hevyclone.app.controller.notification;

import com.hevyclone.app.model.notification.Notification;
import com.hevyclone.app.service.notification.NotificationService;
import com.hevyclone.app.auth.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    // Endpoint para o usuário listar suas notificações (todas ou apenas não lidas)
    @GetMapping
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<List<Notification>> getMyNotifications(@RequestParam(defaultValue = "false") boolean unreadOnly) {
        Long userId = getCurrentUserId();
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId, unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    // Endpoint para o usuário buscar uma notificação específica pelo ID
    @GetMapping("/{notificationId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<Notification> getMyNotificationById(@PathVariable Long notificationId) {
        Long userId = getCurrentUserId();
        Optional<Notification> notificationOpt = notificationService.getNotificationById(notificationId);
        if (notificationOpt.isPresent() && notificationOpt.get().getUser().getId().equals(userId)) {
            return ResponseEntity.ok(notificationOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint para o usuário marcar uma notificação como lida
    @PostMapping("/{notificationId}/read")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        Long userId = getCurrentUserId();
        try {
            Optional<Notification> notificationOpt = notificationService.getNotificationById(notificationId);
            if (notificationOpt.isEmpty() || !notificationOpt.get().getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).build(); // Forbidden or NotFound
            }
            Notification readNotification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(readNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para o usuário marcar todas as suas notificações como lidas
    @PostMapping("/read-all")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<List<Notification>> markAllMyNotificationsAsRead() {
        Long userId = getCurrentUserId();
        List<Notification> readNotifications = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(readNotifications);
    }
    
    // A criação de notificações geralmente é feita pelo sistema (ex: novo PR, lembrete de treino).
    // Não haverá um endpoint para o usuário criar notificações diretamente.
    // A exclusão de notificações também pode ser gerenciada pelo sistema (ex: após um tempo) ou não ser permitida ao usuário.
    // Se a exclusão pelo usuário for necessária, um endpoint DELETE pode ser adicionado.
}

