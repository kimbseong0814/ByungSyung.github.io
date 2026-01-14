# ByungSyung.github.io

https://kimbseong0814.github.io/ByungSyung.github.io/

---

## 축구 예매 시스템 데이터베이스 설계 

## 프로젝트 개요

- **프로젝트명**: 축구 예매 시스템 
- **개발자**: 김병성
- **목적**: 축구 티켓 예매 및 회원 관리를 위한 데이터베이스 설계

---

## 사용 기술

- **Backend**: Node.js
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MariaDB

---

## 프로젝트 기능

- 축구 정보 관리
- 축구 티켓 예매
- 회원 관리
- 주문 및 결제 내역 관리
- 공연 예매
- 공연 주문 및 결제는 추후에 설정하겠습니다

---

## 데이터베이스 구조

### 총 테이블 수: 9개

| 테이블명 | 설명 |
|--------|------|
| users | 회원 정보 |
| matches | 축구 경기 정보 |
| match_bookings | 경기 예매 내역 |
| concerts | 공연 정보 |
| concert_bookings | 공연 예매 내역 |
| poster | 포스터 이미지 정보 |
| show | 공연 상세 정보 |
| order | 주문 정보 |
| order_detail | 주문 상세 내역 |


---

## 비고

- 본 프로젝트는 데이터베이스 설계 학습을 목적으로 진행되었습니다.
- 실제 결제 기능은 포함되어 있지 않습니다.

---

## 1. DDL (테이블 생성)

```html
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200),
    match_date DATE,
    venue VARCHAR(200),
    price INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE match_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    match_id INT,
    quantity INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

```
## 2. DML (데이터 조작)
-- INSERT 예시

```
INSERT INTO users (name, email, password) VALUES ('김병성', 'test@test.com', '1234');
INSERT INTO matches (name, match_date, venue, price) VALUES ('맨유 vs 리버풀', '2026-03-15', '올드 트래포드', 150000);
```

-- SELECT 예시
```
SELECT * FROM matches;
SELECT * FROM match_bookings WHERE user_id = 1;
```

-- UPDATE 예시

```
UPDATE users SET name = '김철수' WHERE id = 1;
UPDATE matches SET price = 160000 WHERE id = 1;
```

-- DELETE 예시 (선택)

```
DELETE FROM match_bookings WHERE id = 1;
```


**ERD 구조:**
```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   users     │         │  match_bookings  │         │   matches   │
├─────────────┤         ├──────────────────┤         ├─────────────┤
│ id (PK)     │◄─────── ┤ user_id (FK)     │         │ id (PK)     │
│ name        │         │ match_id (FK)    ├────────►│ name        │
│ email       │         │ quantity         │         │ match_date  │
│ password    │         │ booking_date     │         │ venue       │
└─────────────┘         └──────────────────┘         │ price       │
                                                     └─────────────┘
```

**관계 설명 작성 예시:**
- users (1) : match_bookings (N) → 한 명의 사용자는 여러 개의 예매를 할 수 있다
- matches (1) : match_bookings (N) → 하나의 경기에는 여러 개의 예매가 있을 수 있다



**현재 파일 구조:**
```
project/
├── index.html (main.html을 복사)
├── matches.html
├── concerts.html
├── login.html
├── signup.html
├── img/
│   ├── soccer.jpg
│   ├── concert.jpg
│   ├── match1.jpg
│   └── ...
└── README.md
