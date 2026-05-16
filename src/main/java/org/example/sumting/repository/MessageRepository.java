package org.example.sumting.repository;

import org.example.sumting.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :a AND m.receiverId = :b) OR " +
           "(m.senderId = :b AND m.receiverId = :a) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("a") Long a, @Param("b") Long b);

    @Query("SELECT m FROM Message m WHERE " +
           "((m.senderId = :a AND m.receiverId = :b) OR " +
           "(m.senderId = :b AND m.receiverId = :a)) " +
           "ORDER BY m.createdAt DESC")
    List<Message> findLastMessage(@Param("a") Long a, @Param("b") Long b, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :receiverId AND m.senderId = :senderId AND (m.isRead = false OR m.isRead IS NULL)")
    long countUnread(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiverId = :receiverId AND m.senderId = :senderId AND (m.isRead = false OR m.isRead IS NULL)")
    void markAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
}
