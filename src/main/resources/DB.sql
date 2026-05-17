CREATE TABLE users (
                       id BIGINT PRIMARY KEY COMMENT '카카오 고유 식별번호',
                       uuid CHAR(36) NOT NULL UNIQUE COMMENT '내부 공개용 식별자 (UUID)',
                       heart INT DEFAULT 5 COMMENT '보유한 하트 개수',
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '가입 일시'
);
-- 신규 유저 삽입 시 uuid는 애플리케이션에서 생성하여 저장해야 합니다.

-- 2. 유저 프로필 및 키워드 테이블
-- 1:1 관계를 통합하여 조회 성능 최적화
CREATE TABLE user_profiles (
                               user_id BIGINT PRIMARY KEY,
    -- 초기 단계에서는 NULL일 수 있으므로 허용하되,
    -- 실제 매칭 시에는 서버에서 필수값 체크를 수행합니다.
                               nickname VARCHAR(30) NULL,
                               gender ENUM('M', 'F') NULL,
                               department VARCHAR(50) NULL,
                               age TINYINT UNSIGNED NULL,
                               height SMALLINT UNSIGNED NULL,
                               my_kw1 VARCHAR(30) NULL,
                               my_kw2 VARCHAR(30) NULL,
                               my_kw3 VARCHAR(30) NULL,
                               your_kw1 VARCHAR(30) NULL,
                               your_kw2 VARCHAR(30) NULL,
                               your_kw3 VARCHAR(30) NULL,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 매칭 및 호감 표시 테이블 (Likes)
-- 유저 간의 상호작용 기록
CREATE TABLE likes (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       sender_id BIGINT NOT NULL COMMENT '호감을 보낸 유저',
                       receiver_id BIGINT NOT NULL COMMENT '호감을 받은 유저',
                       status ENUM('PENDING', 'MATCHED', 'REJECTED', 'EXITED') DEFAULT 'PENDING' COMMENT '매칭 상태',
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                       FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    -- 동일한 상대에게 중복 투표 방지
                       UNIQUE KEY unique_interaction (sender_id, receiver_id)
);

-- 4. 신고 테이블
CREATE TABLE reports (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         reporter_id BIGINT NOT NULL COMMENT '신고한 유저',
                         reported_id BIGINT NOT NULL COMMENT '신고 당한 유저',
                         reason VARCHAR(100) NOT NULL COMMENT '신고 사유',
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
);

-- A가 B에게 호감을 표시했을 때, B도 이미 A에게 표시했는지 확인 (맞팔 확인)
/*
SELECT id FROM likes
WHERE sender_id = [상대방_ID]
  AND receiver_id = [내_ID]
  AND status = 'PENDING';

-- 위 쿼리 결과가 존재한다면 양방향 매칭이므로 두 row의 status를 'MATCHED'로 업데이트
UPDATE likes
SET status = 'MATCHED'
WHERE (sender_id = [내_ID] AND receiver_id = [상대방_ID])
   OR (sender_id = [상대방_ID] AND receiver_id = [내_ID]);
*/