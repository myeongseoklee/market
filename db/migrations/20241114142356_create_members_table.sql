-- migrate:up
CREATE TABLE members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '사용자 고유 ID',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '사용자 이메일 (로그인 아이디)',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호',
    name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

-- migrate:down
DROP TABLE members;
