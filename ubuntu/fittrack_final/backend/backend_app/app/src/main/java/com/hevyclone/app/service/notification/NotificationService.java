package com.hevyclone.app.service.notification;

import com.hevyclone.app.model.notification.Notification;
import com.hevyclone.app.model.notification.NotificationType;
import com.hevyclone.app.repository.notification.NotificationRepository;
import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository; // Para buscar o usuário ao criar uma notificação

    @Transactional
    public Notification createNotification(Long userId, NotificationType type, String message, String link) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLink(link); // Pode ser nulo
        notification.setCreatedAt(LocalDateTime.now());
        notification.setReadAt(null); // Nova notificação não está lida

        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserId(Long userId, boolean unreadOnly) {
        if (unreadOnly) {
            return notificationRepository.findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(userId);
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Optional<Notification> getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada com o id: " + notificationId));
        
        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
            return notificationRepository.save(notification);
        }
        return notification; // Já estava lida
    }

    @Transactional
    public List<Notification> markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unreadNotifications) {
            notification.setReadAt(now);
        }
        return notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada com o id: " + notificationId));
        notificationRepository.delete(notification);
    }
    
    // Métodos para criar tipos específicos de notificação podem ser adicionados aqui
    // Ex: createWorkoutReminderNotification, createNewPRNotification, etc.
    // Esses métodos encapsulariam a lógica de formatação da mensagem e do link.
}

