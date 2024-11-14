-- migrate:up
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '제품 고유 ID',
    seller_id BIGINT NOT NULL COMMENT '판매자 ID',
    name VARCHAR(255) NOT NULL COMMENT '제품명',
    price DECIMAL(10,2) NOT NULL COMMENT '제품 가격',
    status ENUM('판매중', '예약중', '완료') DEFAULT '판매중' COMMENT '제품 상태',
    quantity INT DEFAULT 1 COMMENT '제품 수량',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

-- migrate:down
DROP TABLE products;
