package org.example.sumting.repository;

import org.example.sumting.entity.Likes;
import org.example.sumting.entity.User;
import org.example.sumting.enums.LikeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

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
}