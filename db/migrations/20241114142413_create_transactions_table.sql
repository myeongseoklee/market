-- migrate:up
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '거래 고유 ID',
    product_id BIGINT NOT NULL COMMENT '제품 ID',
    buyer_id BIGINT NOT NULL COMMENT '구매자 ID',
    seller_id BIGINT NOT NULL COMMENT '판매자 ID',
    purchase_price DECIMAL(10,2) NOT NULL COMMENT '구매 가격 (소수점 2자리까지 정확한 금액 저장 가능)', 
    status ENUM('구매요청', '판매승인', '구매확정') DEFAULT '구매요청' COMMENT '거래 상태',
    created_at TIMESTAMP DEFAULT NULL COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT NULL COMMENT '수정일시'
);

-- migrate:down
DROP TABLE transactions;
