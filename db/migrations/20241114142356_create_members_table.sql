-- migrate:up
CREATE TABLE members (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '사용자 고유 ID',
    name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

CREATE TABLE auth_passwords (
    member_id BIGINT PRIMARY KEY COMMENT '사용자 고유 ID',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

CREATE TABLE auth_providers (
    member_id BIGINT PRIMARY KEY COMMENT '사용자 고유 ID',
    provider_id CHAR(36) NULL COMMENT '로그인 제공자 아이디',
    provider ENUM('email', 'kakao', 'naver') NOT NULL COMMENT '로그인 제공자',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '로그인 이메일',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

-- migrate:down
DROP TABLE members;
DROP TABLE auth_passwords;
DROP TABLE auth_providers;
