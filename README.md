# 원티드 프리온보딩 챌린지 백엔드 26 사전과제

### 설명

지난 스프린트에서 사용자간에 물건을 거래할 수 있는 Wanted Market API를 개발했습니다. <br>
이번 스프린트에서는 결제 플랫폼, 포트원(구 아임포트)을 사용해서 결제 프로세스를 구현하려합니다. <br>
[포트원개발자센터](https://developers.portone.io/opi/ko/readme?v=v1)의 결제연동 문서를 확인하여 기본적인 결제 프로세스를 구축해주세요.

<details>
<summary style="display: inline-block;cursor: pointer;">
    <h3>▶ 요구사항</h3>
</summary>

### 요구사항

0. 시간적 여유가 된다면 지난 과제를 진행해주세요. => [지난과제 바로가기](https://github.com/kst6294/wanted-preonboarding-challenge-backend-20) <br>
   0-1. 지난 과제를 진행했다면, 용품을 구매할 때 결제가 진행되도록 해주세요. <br>
   0-2. 지난 과제를 진행하지 않았다면, 바로 결제를 위한 기능을 구현해주세요.
1. v1, v2 모두 사용가능하지만 우선은 v1을 기준으로 진행해주세요.
2. 사용자간 거래에서 결제플랫폼을 통해 결제를 진행합니다.
3. 결제진행, 가상계좌, 결제취소 기능을 개발해주세요. (변경: 계좌이체 -> 가상계좌) <br>
   3-1. 이 과정에서 결제 대행사는 임의로 설정하셔도 괜찮습니다. <br>
4. 결제연동문서를 자세히 보고 단순 기능 추가가 아닌 실제 결제가 진행된다는 관점에서 기능을 구현해주세요.
5. 다른 참여자분들의 PR을 읽어보면서 의견을 주고 받아주세요.
6. 개발 과정에서 어려웠던 부분이 있었다면, 기록을 남겨주세요.

#### 참고사항

- 포트원 회원가입을 하지 않아도 됩니다.
- 실제 결제가 진행되지 않아도 됩니다.
- 결제, 취소, 계좌이체를 진행할 때 고려해야할 요소가 무엇이 있을지 고민해보시면 좋겠습니다.
- 정답은 없습니다.

<br>

### 제출방법

- 이 Repository 를 fork 해주세요.
- feature/{name} 으로 브랜치를 생성해주세요. 예: feature/suntae-kim
- 과제를 진행해주세요.
- 소스코드를 Push 하고 PR을 올려주세요.
- 요구사항에 대해서 궁금한 점이나 이해가 안되는 부분이 있다면 이슈를 남겨주시거나, 편하게 연락주세요 - kst6294@gmail.com

</details>

<br>
<br>

# 원티드 프리온보딩 챌린지 백엔드 20 사전과제

### 설명

사용자간 거래가 가능한 Wanted Market API를 생성해야합니다. 요구사항에 맞춰 진행해주세요.
요구사항은 **공통**과 **1단계(필수)**, **2단계(선택)** 로 나누어져 있습니다.

공통과 1단계는 필수로 진행해주시고, 2단계는 1단계를 마무리한 이후에 순차적으로 진행하시는 것을 추천합니다.
스프린트를 진행하면서 기능이 어떻게 발전해나가는지 사전 과제를 통해서 체험해보시면 좋겠습니다.

<br>

### API 명세

### [포스트맨](https://documenter.getpostman.com/view/24100977/2sAYBUDXui)

<br>

### 주요 고려사항 및 해결방안

#### 1. 상품 상태 관리

- 문제: 동일 상품에 대해 재고가 매우 적게 남았을 때 여러 구매자가 동시에 구매 시도하는 경우 동시에 재고수량에 접근하므로 재고 수량 이상의 제품 구매 거래가 발생 할 위험 존재(write skew, 데이터 일관성 문제). 특히 인기 상품이나 선착순 이벤트 상품, 한정판 상품의 경우 더욱 높은 확률로 발생.
- Write Skew의 정의: 여러 트랜잭션이 동시에 어떤 조건을 확인하고 그 조건을 기반으로 각각 다른 데이터를 수정할 때 각각의 수정은 성공하지만 전체적인 불변식(invariant)이 깨지는 현상
- 해결: 비관적 락(배타락) 사용.

  - 재고는 정확성이 매우 중요한 비즈니스 로직
  - 초과 판매 시 비즈니스 영향도가 큼
  - 동시성 문제 발생 가능성이 높음
  - 재고 차감은 빠른 연산으로 락 유지 시간이 짧음
  - 따라서 배타락 사용.

  ```mermaid
  sequenceDiagram
    participant 구매자A
    participant 구매자B
    participant API서버
    participant DB

    구매자A->>+API서버: 구매 요청 (상품ID: 1)
    구매자B->>+API서버: 구매 요청 (상품ID: 1)

    API서버->>DB: 재고 조회 (A)
    Note right of DB: 재고: 1개
    DB-->>API서버: 재고 있음

    API서버->>DB: 재고 조회 (B)
    Note right of DB: 재고: 1개
    DB-->>API서버: 재고 있음

    API서버->>DB: 거래 생성 & 재고 감소 (A)
    API서버->>DB: 거래 생성 & 재고 감소 (B)
    Note right of DB: 동시성 문제 발생!<br/>재고가 -1이 됨

    API서버-->>구매자A: 구매 성공
    API서버-->>구매자B: 구매 성공
  ```

  <br>

  - 거래 요청 시 상품 재고관리에서 동시성 문제 해결을 위해 배타락 사용

  ```mermaid
  sequenceDiagram
    participant 구매자A
    participant 구매자B
    participant API서버
    participant DB

    구매자A->>+API서버: 구매 요청 (상품ID: 1)
    구매자B->>+API서버: 구매 요청 (상품ID: 1)

    API서버->>DB: SELECT FOR UPDATE (비관적 락)
    Note right of DB: 재고: 1개<br/>락 획득 (구매자A)
    DB-->>API서버: 재고 있음

    API서버->>DB: 거래 생성 & 재고 감소
    Note right of DB: 재고: 0개

    API서버-->>구매자A: 구매 성공

    API서버->>DB: SELECT FOR UPDATE (비관적 락)
    Note right of DB: 재고: 0개<br/>락 획득 (구매자B)
    DB-->>API서버: 재고 없음

    API서버-->>구매자B: 재고 부족 오류
  ```

    <br>

  - 재고가 얼마 남지 않은 여러개의 상품을 동시에 구매(장바구니)할 경우 배타락 설정 시 데드락 발생 가능하지만, 현 요구사항 수준에서는 가능성이 낮음

  ```mermaid
  sequenceDiagram
  participant 트랜잭션A
  participant 상품1
  participant 상품2
  participant 트랜잭션B

  Note over 트랜잭션A,트랜잭션B: 데드락 시나리오

  트랜잭션A->>상품1: SELECT FOR UPDATE (상품1 락 획득)
  트랜잭션B->>상품2: SELECT FOR UPDATE (상품2 락 획득)

  트랜잭션A->>상품2: SELECT FOR UPDATE 시도
  Note right of 상품2: 대기 (상품2는 트랜잭션B가 락 보유중)

  트랜잭션B->>상품1: SELECT FOR UPDATE 시도
  Note left of 상품1: 대기 (상품1은 트랜잭션A가 락 보유중)

  Note over 트랜잭션A,트랜잭션B: 데드락 발생!<br/>양쪽 다 서로가 가진 락을 기다림

  Note over 트랜잭션A: 데드락 감지
  트랜잭션A-->>상품1: 롤백 (락 해제)
  Note over 트랜잭션A: 트랜잭션A 실패

  트랜잭션B->>상품1: SELECT FOR UPDATE 성공
  Note over 트랜잭션B: 트랜잭션B 계속 진행
  ```

<br>

#### 2. 거래 상태 관리

- 문제: 동일 제품에 대해 여러 거래가 존재하는 경우, 마지막 남은 구매자가 거의 동시에 구매확정을 하는 경우 상품 상태가 완료되지 않는 동시성 문제 발생 가능(write skew, 데이터 일관성 문제)
- 해결:

  - 대부분의 구매자는 각자 다른 시점에 구매확정을 할 가능성이 높음
  - 따라서 마지막 구매확정이 동시에 일어날 확률은 매우 낮고
  - 재시도로 인한 지연이 사용자 경험에 큰 영향을 미치지 않을 것으로 판단.
  - 낙관적 락 사용, retry 로직 추가
  - 구매확정 시퀀스

    ```mermaid
    sequenceDiagram
        participant 구매자
        participant 판매자
        participant TransactionService
        participant Transaction
        participant Product
        participant DB

        구매자->>TransactionService: 구매확정 요청

        TransactionService->>DB: 트랜잭션 시작
        Note right of DB: 낙관적 락 사용<br/>(version 컬럼)

        TransactionService->>Transaction: 거래 조회
        Transaction-->>TransactionService: transaction

        TransactionService->>Transaction: confirmPurchase()
        Note right of Transaction: 상태 검증<br/>SALE_APPROVAL -> PURCHASE_CONFIRMATION

        TransactionService->>Product: 상품 상태 확인
        Product-->>TransactionService: product

        alt 예약중 상태인 경우
            TransactionService->>DB: 구매확정된 거래 수 조회
            DB-->>TransactionService: confirmedTransactions

            opt 모든 거래가 구매확정된 경우
                TransactionService->>Product: markAsCompleted()
                Note right of Product: RESERVING -> COMPLETED
            end
        end

        TransactionService->>DB: 트랜잭션 커밋

        TransactionService-->>구매자: 응답
    ```

    <br>

  - 동시성 문제 발생

  ```mermaid
  sequenceDiagram
    participant 구매자A
    participant 구매자B
    participant TransactionService
    participant Product
    participant DB

    Note over DB: 상품: 예약중 상태<br/>총 수량: 2개<br/>구매확정 필요: 2건

    구매자A->>+TransactionService: 구매확정 요청
    구매자B->>+TransactionService: 구매확정 요청

    par 구매자 A의 트랜잭션
        TransactionService->>DB: 거래A 조회
        DB-->>TransactionService: transaction A

        TransactionService->>DB: 구매확정된 거래 수 조회
        Note right of DB: 현재 0건 확정
        DB-->>TransactionService: confirmedTransactions (0건)

        TransactionService->>DB: 거래A 구매확정으로 변경
        Note right of DB: 1건 확정
    and 구매자 B의 트랜잭션
        TransactionService->>DB: 거래B 조회
        DB-->>TransactionService: transaction B

        TransactionService->>DB: 구매확정된 거래 수 조회
        Note right of DB: 현재 0건 확정
        DB-->>TransactionService: confirmedTransactions (0건)

        TransactionService->>DB: 거래B 구매확정으로 변경
        Note right of DB: 1건 확정
    end

    Note over DB: 문제 발생!<br/>두 건 모두 구매확정되었지만<br/>상품 상태는 여전히 '예약중'

    TransactionService-->>구매자A: 성공
    TransactionService-->>구매자B: 성공
  ```

<br>

- 해결방안

  ```mermaid
  sequenceDiagram
  participant 구매자A
  participant 구매자B
  participant TransactionService
  participant Transaction
  participant Product
  participant DB

  Note over DB: 상품: 예약중 상태<br/>총 수량: 2개<br/>구매확정 필요: 2건

  구매자A->>+TransactionService: 구매확정 요청
  구매자B->>+TransactionService: 구매확정 요청

  par 구매자 A의 트랜잭션
      TransactionService->>DB: 거래A 조회 (version=1)
      DB-->>TransactionService: transaction A

      TransactionService->>Transaction: confirmPurchase()
      Note right of Transaction: 상태 검증

      TransactionService->>DB: 거래A 업데이트 (version=2)
      Note right of DB: 성공

      TransactionService->>DB: 구매확정된 거래 수 조회
      DB-->>TransactionService: confirmedTransactions (1건)
  and 구매자 B의 트랜잭션
      TransactionService->>DB: 거래B 조회 (version=1)
      DB-->>TransactionService: transaction B

      TransactionService->>Transaction: confirmPurchase()
      Note right of Transaction: 상태 검증

      TransactionService->>DB: 거래B 업데이트 시도 (version 충돌)
      Note right of DB: 실패

      TransactionService->>TransactionService: 재시도
      Note over TransactionService: RetryUtil.executeWithRetry()
  end

  TransactionService-->>구매자A: 성공

  TransactionService->>DB: 거래B 재조회 (version=2)
  DB-->>TransactionService: transaction B

  TransactionService->>Transaction: confirmPurchase()
  TransactionService->>DB: 거래B 업데이트 (version=3)
  Note right of DB: 성공

  TransactionService->>DB: 구매확정된 거래 수 조회
  DB-->>TransactionService: confirmedTransactions (2건)

  TransactionService->>Product: markAsCompleted()
  Note right of Product: 모든 거래 확정됨<br/>RESERVING -> COMPLETED

  TransactionService-->>구매자B: 성공
  ```

#### 3. 아키텍처 설계 관련

- 문제: 각 레이어간 의존성 관리 및 도메인 로직의 분리
- 해결:
  - Port/Adapter 패턴 적용
  - 인터페이스와 구현체를 분리하여 의존성 역전 원칙(DIP) 적용
    - 모듈 내 의존성 방향
      - interface <-> service -> port(interface) <-> infrastructure
      - interface는 service 구현에 의존하고 service는 dto에 의존
      - service는 infrastructure 구현에 의존하지 않고 port(interface)에 의존. infra는 service가 의존하는 port에 의존
    - 모듈 간 구현에 직접 의존하지 않고 interface에 의존.
      - ex) authService -> IMemberService(interface) <-> MemberService
    - 상태변경 등 도메인 로직은 도메인 객체로 캡슐화

<br>

#### 4. 인증/인가 처리

- 문제: 보안과 비즈니스 로직의 분리
- 해결:
  - JWT 기반 인증 (Access Token + Refresh Token)
  - Guard와 Strategy(전략패턴)를 통한 인증/인가 처리
  - 소셜 로그인 인증 지원 (카카오, 네이버 실제 연동 x)

#### 5. 테스트 코드

- 문제: 테스터블한 코드 작성
- 해결:
  - 상태변경 등 주요 도메인 로직은 도메인 객체 내부로 캡슐화하여 테스터블한 코드 작성

<br>

<details>
<summary style="display: inline-block;cursor: pointer;">
    <h3>▶ 요구사항</h3>
</summary>

##### 1단계 (필수)

- [x] 1. 제품 등록과 구매는 회원만 가능합니다.
- [x] 2. 비회원은 등록된 제품의 목록조회와 상세조회만 가능합니다.
- [x] 3. 등록된 제품에는 "제품명", "가격", "예약상태"가 포함되어야하고, 목록조회와 상세조회시에 예약상태를 포함해야합니다.
- [x] 4. 제품의 상태는 "판매중", "예약중", "완료" 세가지가 존재합니다.
- [x] 5. 구매자가 제품의 상세페이지에서 구매하기 버튼을 누르면 거래가 시작됩니다.
- [x] 6. 판매자와 구매자는 제품의 상세정보를 조회하면 당사자간의 거래내역을 확인할 수 있습니다.
  - 상품정보 조회 -> 거래내역 조회
- [x] 7. 모든 사용자는 내가 "구매한 용품(내가 구매자)"과 "예약중인 용품(내가 구매자/판매자 모두)"의 목록을 확인할 수 있습니다.
- [x] 8. 판매자는 거래진행중인 구매자에 대해 '판매승인'을 하는 경우 거래가 완료됩니다.

##### 2단계 (선택)

- [x] 9. 제품에 수량이 추가됩니다. 제품정보에 "제품명", "가격", "예약상태", "수량"이 포함되어야합니다.
- [x] 10. 다수의 구매자가 한 제품에 대해 구매하기가 가능합니다. (단, 한 명이 구매할 수 있는 수량은 1개뿐입니다.)
- [x] 11. 구매확정의 단계가 추가됩니다. 구매자는 판매자가 판매승인한 제품에 대해 구매확정을 할 수 있습니다.
- [x] 12. 거래가 시작되는 경우 수량에 따라 제품의 상태가 변경됩니다.
  - 추가 판매가 가능한 수량이 남아있는 경우 - 판매중
  - 추가 판매가 불가능하고 현재 구매확정을 대기하고 있는 경우 - 예약중
  - 모든 수량에 대해 모든 구매자가 모두 구매확정한 경우 - 완료
- [x] 13. "구매한 용품"과 "예약중인 용품" 목록의 정보에서 구매하기 당시의 가격 정보가 나타나야합니다.
  - 예) 구매자 A가 구매하기 요청한 당시의 제품 B의 가격이 3000원이었고 이후에 4000원으로 바뀌었다 하더라도 목록에서는 3000원으로 나타나야합니다.

##### 공통

0. Python이나 Java 기반의 프레임워크를 사용하시길 권장합니다.
1. 구매취소는 고려하지 않습니다.
2. 요구사항에 모호한 부분이 많은게 맞습니다. 같은 요구사항에 대해 다양한 시각을 보여주세요.
3. 검증이 필요한 부분에 대해 테스트코드를 작성해주세요.
4. 작성한 API에 대한 명세를 작성해주세요.
5. 개발과정에서 어려웠던 부분이나 예기치 못한 케이스가 있었다면 기록을 남겨주세요.
6. 다른분들의 PR을 보면서 리뷰를 해보세요. 궁금한점을 자유롭게 남기면서 서로의 의견을 주고 받아주세요!
7. 요구사항을 잘 진행해주신 분들 중에서 추첨하여 선물을 드리겠습니다 :)

<br>

### 제출방법

1. 이 repository 를 clone 해주세요.
2. feature/{name} 으로 브랜치를 생성해주세요. 예: feature/suntae-kim
3. 과제를 진행해주세요.
4. 소스코드를 Push 하고 PR을 올려주세요.
5. 요구사항에 대해서 궁금한 점이나 이해가 안되는 부분이 있다면 이슈를 남겨주시거나, 편하게 연락주세요 - kst6294@gmail.com
</details>
