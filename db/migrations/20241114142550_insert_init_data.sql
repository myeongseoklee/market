-- migrate:up
-- 유저 데이터 10개
INSERT INTO members (email, password, name) VALUES
('user1@test.com', 'password123', '김철수'),
('user2@test.com', 'password123', '이영희'),
('user3@test.com', 'password123', '박민수'),
('user4@test.com', 'password123', '정지원'),
('user5@test.com', 'password123', '강다혜'),
('user6@test.com', 'password123', '조현우'),
('user7@test.com', 'password123', '윤서연'),
('user8@test.com', 'password123', '임재현'),
('user9@test.com', 'password123', '한미영'),
('user10@test.com', 'password123', '송태호');

-- 제품 데이터 50개
INSERT INTO products (seller_id, name, price, quantity) VALUES
(1, '아이폰 14', 890000, 1),
(2, '갤럭시 S23', 950000, 2),
(3, '맥북 프로 M1', 1590000, 1),
(4, '애플워치 8', 450000, 3),
(5, '아이패드 프로', 980000, 2),
(1, '에어팟 프로 2', 290000, 5),
(2, '갤럭시 버즈 2', 150000, 3),
(3, '삼성 TV 65인치', 1200000, 1),
(4, '다이슨 청소기', 890000, 2),
(5, '샤오미 로봇청소기', 340000, 1),
(6, '닌텐도 스위치', 320000, 4),
(7, 'PS5', 620000, 1),
(8, '게이밍 모니터', 480000, 2),
(9, '기계식 키보드', 150000, 3),
(10, '게이밍 마우스', 89000, 5),
(1, '스타벅스 기프티콘', 30000, 10),
(2, '교보문고 상품권', 50000, 5),
(3, '나이키 운동화', 129000, 2),
(4, '아디다스 트레이닝복', 89000, 3),
(5, '언더아머 티셔츠', 45000, 4),
(6, '노스페이스 패딩', 280000, 1),
(7, '뉴발란스 운동화', 109000, 2),
(8, '샤넬 향수', 180000, 1),
(9, '구찌 지갑', 590000, 1),
(10, '프라다 가방', 1800000, 1),
(1, '캠핑 텐트', 230000, 2),
(2, '침낭', 89000, 3),
(3, '등산 배낭', 150000, 2),
(4, '캠핑 의자', 40000, 4),
(5, '휴대용 가스렌지', 35000, 3),
(6, '전기밥솥', 110000, 2),
(7, '에어프라이어', 89000, 2),
(8, '전자레인지', 140000, 1),
(9, '토스터기', 45000, 3),
(10, '커피머신', 280000, 1),
(1, '양문형 냉장고', 1800000, 1),
(2, '드럼 세탁기', 890000, 1),
(3, '공기청정기', 390000, 2),
(4, '제습기', 280000, 2),
(5, '선풍기', 45000, 3),
(6, '스탠드 조명', 89000, 2),
(7, '블루투스 스피커', 150000, 3),
(8, '빔프로젝터', 890000, 1),
(9, '카메라', 780000, 1),
(10, '삼각대', 45000, 2),
(1, '자전거', 450000, 1),
(2, '킥보드', 290000, 2),
(3, '요가 매트', 35000, 5),
(4, '아령 세트', 89000, 3),
(5, '러닝머신', 1500000, 1); 

-- 거래 데이터 20개 
INSERT INTO transactions (product_id, buyer_id, seller_id, purchase_price, status) VALUES
(1, 2, 1, 890000, '구매요청'),      -- 아이폰 14 (판매자:1 김철수, 구매자:2 이영희)
(2, 3, 2, 950000, '판매승인'),      -- 갤럭시 S23 (판매자:2 이영희, 구매자:3 박민수)
(3, 4, 3, 1590000, '구매확정'),     -- 맥북 프로 M1 (판매자:3 박민수, 구매자:4 정지원)
(4, 5, 4, 450000, '구매요청'),      -- 애플워치 8 (판매자:4 정지원, 구매자:5 강다혜)
(5, 6, 5, 980000, '판매승인'),      -- 아이패드 프로 (판매자:5 강다혜, 구매자:6 조현우)
(6, 7, 1, 290000, '구매확정'),      -- 에어팟 프로 2 (판매자:1 김철수, 구매자:7 윤서연)
(7, 8, 2, 150000, '구매요청'),      -- 갤럭시 버즈 2 (판매자:2 이영희, 구매자:8 임재현)
(8, 9, 3, 1200000, '판매승인'),     -- 삼성 TV 65인치 (판매자:3 박민수, 구매자:9 한미영)
(9, 10, 4, 890000, '구매확정'),     -- 다이슨 청소기 (판매자:4 정지원, 구매자:10 송태호)
(10, 1, 5, 340000, '구매요청'),     -- 샤오미 로봇청소기 (판매자:5 강다혜, 구매자:1 김철수)
(11, 2, 6, 320000, '판매승인'),     -- 닌텐도 스위치 (판매자:6 조현우, 구매자:2 이영희)
(12, 3, 7, 620000, '구매확정'),     -- PS5 (판매자:7 윤서연, 구매자:3 박민수)
(13, 4, 8, 480000, '구매요청'),     -- 게이밍 모니터 (판매자:8 임재현, 구매자:4 정지원)
(14, 5, 9, 150000, '판매승인'),     -- 기계식 키보드 (판매자:9 한미영, 구매자:5 강다혜)
(15, 6, 10, 89000, '구매확정'),     -- 게이밍 마우스 (판매자:10 송태호, 구매자:6 조현우)
(16, 7, 1, 30000, '구매요청'),      -- 스타벅스 기프티콘 (판매자:1 김철수, 구매자:7 윤서연)
(17, 8, 2, 50000, '판매승인'),      -- 교보문고 상품권 (판매자:2 이영희, 구매자:8 임재현)
(18, 9, 3, 129000, '구매확정'),     -- 나이키 운동화 (판매자:3 박민수, 구매자:9 한미영)
(19, 10, 4, 89000, '구매요청'),     -- 아디다스 트레이닝복 (판매자:4 정지원, 구매자:10 송태호)
(20, 1, 5, 45000, '판매승인');      -- 언더아머 티셔츠 (판매자:5 강다혜, 구매자:1 김철수)






-- migrate:down
DELETE FROM members;
DELETE FROM products;
