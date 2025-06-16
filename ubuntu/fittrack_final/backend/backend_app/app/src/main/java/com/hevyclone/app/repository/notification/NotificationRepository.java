package com.hevyclone.app.repository.notification;

import com.hevyclone.app.model.notification.Notification;
import com.hevyclone.app.model.notification.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, NotificationType type);
}

