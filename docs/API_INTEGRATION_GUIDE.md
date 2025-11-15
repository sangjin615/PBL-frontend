# 🚀 DashboardView API 연결 가이드

## 📋 개요

DashboardView.vue가 Spring Boot Lecture API와 성공적으로 연결되었습니다. 이 문서는 구현된 기능과 사용법을 설명합니다.

## 🔧 구현된 기능

### 1. **API 서비스 레이어** (`src/services/lectureApi.ts`)

- Spring Boot API와 통신하는 클라이언트
- 모든 CRUD 작업 지원
- 에러 처리 및 타입 안전성 보장

### 2. **Pinia Store** (`src/stores/lectures.ts`)

- 강의 데이터 상태 관리
- API 호출 로직 캡슐화
- 로딩 상태 및 에러 처리

### 3. **TypeScript 타입 정의** (`src/types/lecture.ts`)

- Spring Boot API 응답에 맞춘 인터페이스
- 타입 안전성 보장

### 4. **리팩토링된 DashboardView**

- 하드코딩된 데이터를 API 호출로 대체
- 로딩 상태 및 에러 처리 UI 추가
- 기존 localStorage 데이터와 API 데이터 통합

## 🛠️ 설정 방법

### 1. **환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Spring Boot API 서버 URL
VITE_API_URL=http://localhost:8080/api

# Judge0 API URL (기존)
VITE_JUDGE0_URL=http://localhost:2358
```

### 2. **Spring Boot 서버 실행**

API가 정상 작동하려면 Spring Boot 서버가 실행되어야 합니다:

```bash
# Spring Boot 서버 실행 (포트: 8080)
./gradlew bootRun
# 또는
mvn spring-boot:run
```

### 3. **프론트엔드 실행**

```bash
npm run dev
# 또는
yarn dev
```

## 🧪 API 연결 테스트

### 1. **브라우저에서 테스트**

1. DashboardView 페이지로 이동
2. 우상단의 "API 테스트" 버튼 클릭
3. 브라우저 개발자 도구 콘솔에서 결과 확인

### 2. **예상 결과**

```
=== API 테스트 결과 ===
📡 API 연결 테스트 시작...
✅ 강의 목록 조회 성공: X개 강의
✅ 통계 조회 성공: {...}
✅ 검색 기능 성공: X개 결과
🎉 모든 API 테스트 통과!
```

### 3. **연결 실패 시**

```
❌ API 테스트 실패: fetch failed
💡 Spring Boot 서버가 실행되고 있는지 확인해주세요.
💡 서버 주소: http://localhost:8080
```

## 📊 데이터 통합 방식

### 현재 구조:

- **API 데이터**: Spring Boot에서 가져온 실제 강의 데이터
- **localStorage 데이터**: 기존 임시 저장된 강의 데이터
- **하드코딩 커리큘럼**: 임시로 유지 (향후 커리큘럼 API 연결 예정)

### 탭별 데이터 소스:

- **전체**: API + localStorage + 하드코딩 커리큘럼
- **커리큘럼**: 하드코딩 데이터 (임시)
- **강의물**: API + localStorage (중복 제거)

## 🔄 API 엔드포인트 매핑

| 프론트엔드 기능 | API 엔드포인트              | 설명           |
| --------------- | --------------------------- | -------------- |
| 강의 목록 조회  | `GET /api/lectures`         | 모든 강의 조회 |
| 강의 검색       | `GET /api/lectures/search`  | 조건별 검색    |
| 강의 생성       | `POST /api/lectures`        | 새 강의 생성   |
| 강의 수정       | `PUT /api/lectures/{id}`    | 강의 정보 수정 |
| 강의 삭제       | `DELETE /api/lectures/{id}` | 강의 삭제      |
| 통계 조회       | `GET /api/lectures/stats`   | 강의 통계      |

## 🚨 주의사항

### 1. **CORS 설정**

Spring Boot 서버에서 CORS가 허용되어야 합니다:

```java
@CrossOrigin(origins = "*") // 개발용
```

### 2. **포트 충돌**

- Spring Boot: 8080 포트
- Vue.js 개발 서버: 5173 포트 (기본)
- Judge0: 2358 포트

### 3. **타입 안전성**

모든 API 응답은 TypeScript 인터페이스로 타입이 정의되어 있습니다.

## 🔮 향후 개선 계획

### 1. **커리큘럼 API 연결**

- 현재 하드코딩된 커리큘럼 데이터를 API로 대체
- 커리큘럼-강의 관계 설정

### 2. **인증 시스템**

- JWT 토큰 기반 인증
- 사용자별 강의 관리

### 3. **실시간 업데이트**

- WebSocket을 통한 실시간 데이터 동기화
- 강의 상태 변경 알림

### 4. **캐싱 전략**

- API 응답 캐싱
- 오프라인 지원

## 🐛 문제 해결

### 1. **API 연결 실패**

```bash
# 서버 상태 확인
curl http://localhost:8080/api/lectures

# 네트워크 확인
ping localhost
```

### 2. **CORS 에러**

Spring Boot 설정에서 CORS 허용 확인:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

### 3. **타입 에러**

```bash
# 타입 체크
npm run type-check

# 린트 확인
npm run lint
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. Spring Boot 서버 실행 상태
2. 네트워크 연결
3. 브라우저 개발자 도구 콘솔
4. API 테스트 버튼 결과

---

**✅ DashboardView API 연결 완료!**  
이제 실제 백엔드 데이터로 강의 관리가 가능합니다.
