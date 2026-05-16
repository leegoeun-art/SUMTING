package org.example.sumting.repository;

import org.example.sumting.entity.Likes;
import org.example.sumting.entity.User;
import org.example.sumting.enums.LikeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes, Long> {

    // 특정 보낸 사람과 받은 사람 사이의 상호작용이 있는지 확인
    Optional<Likes> findBySenderAndReceiver(User sender, User receiver);

    // 맞팔(매칭) 확인을 위해 반대 방향의 데이터가 PENDING 상태인지 확인
    Optional<Likes> findBySenderAndReceiverAndStatus(User sender, User receiver, LikeStatus status);

    //받은 하트핑
    List<Likes> findAllByReceiver(User receiver);

    //보낸 하트핑
    List<Likes> findAllBySender(User sender);

    // 두 유저가 MATCHED 상태인지 확인 (방향 무관)
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Likes l " +
           "WHERE l.status = :status AND " +
           "((l.sender.id = :a AND l.receiver.id = :b) OR (l.sender.id = :b AND l.receiver.id = :a))")
    boolean existsMatchBetween(@Param("a") Long a, @Param("b") Long b, @Param("status") LikeStatus status);

    // 특정 유저의 모든 매칭 목록 조회
    @Query("SELECT l FROM Likes l WHERE l.status = :status AND (l.sender.id = :userId OR l.receiver.id = :userId)")
    List<Likes> findAllMatchedByUserId(@Param("userId") Long userId, @Param("status") LikeStatus status);

    // 두 유저 사이의 likes 상태를 일괄 변경 (방향 무관)
    @Modifying
    @Query("UPDATE Likes l SET l.status = :newStatus WHERE l.status = :oldStatus AND " +
           "((l.sender.id = :a AND l.receiver.id = :b) OR (l.sender.id = :b AND l.receiver.id = :a))")
    int updateStatusBetween(@Param("a") Long a, @Param("b") Long b,
                            @Param("oldStatus") LikeStatus oldStatus,
                            @Param("newStatus") LikeStatus newStatus);
}