# ByungSyung.github.io

https://kimbseong0814.github.io/ByungSyung.github.io/

---

## 설치 방법
1. 저장소 클론
```   
git clone https://github.com/kimbseong0814/ByungSyung.github.io.git
cd ByungSyung.github.io
```
2. Node.js 모듈 설치
```
npm install
```
또는 개별 설치:

```
hnpm install mariadb
```

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

**1. ERD 구조:**

<img width="395" height="705" alt="스크린샷 2026-01-14 161026" src="https://github.com/user-attachments/assets/d56e7b76-9998-4842-8ca1-9f64e2582d04" />


### **1.1 상단 영역 (예매 시스템)**

**user (회원)**

- user 테이블이 중심에 있습니다
- PK: id (기본키)
- 속성: name, email, password

**user와 연결된 2개의 예매 테이블**

1. **match_bookings (경기 예매)** - 1:N 관계
    - FK: user_id (user 테이블 참조)
    - FK: match_id (matches 테이블 참조)
2. **concert_bookings (공연 예매)** - 1:N 관계
    - FK: user_id (user 테이블 참조)
    - FK: concert_id (concerts 테이블 참조)

**예매 대상**

- **matches** (축구 경기) - match_bookings와 1:N 관계
- **concerts** (공연) - concert_bookings와 1:N 관계

**의미:** 한 명의 user는 여러 경기와 여러 공연을 예매할 수 있습니다.

---

### 1.2 **하단 영역 (주문 시스템)**

**poster**

- 포스터 이미지 정보 저장

**poster → show**

- 한 개의 포스터는 여러 공연(show)에 사용될 수 있습니다

**user → order**

- 한 명의 user는 여러 개의 주문(order)을 할 수 있습니다

**order → order_detail**

- 한 개의 주문은 여러 개의 주문 상세를 가질 수 있습니다

**show → order_detail**

- 한 개의 공연(show)은 여러 주문 상세에 포함될 수 있습니다

---

## 2. DDL (테이블 생성)

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

**현재 파일 구조:**
```
ByungSyung.github.io/
├── code/                      # 서버 코드
│   ├── index.js              # 메인 진입점
│   ├── Server.js             # HTTP 서버
│   ├── router.js             # 라우팅 처리
│   ├── requestHandler.js     # 요청 핸들러
│   ├── matches.html          # 축구 경기 페이지
│   ├── concerts.html         # 공연 예매 페이지
│   ├── login.html            # 로그인 페이지
│   ├── signup.html           # 회원가입 페이지
│   └── match_bookinglist.html # 예매 내역 페이지
├── Database/
│   └── connect/
│       └── mariadb.js        # 데이터베이스 연결
├── img/                       # 이미지 파일
├── index.html                # 메인 페이지
└── README.md                 # 프로젝트 설명서
```
