# 백엔드 API 연동 가이드 (홈/리스트/상세)

프론트엔드는 `NEXT_PUBLIC_API_URL` 환경 변수로 지정한 백엔드 호스트에서 데이터를 가져옵니다. 변수가 비어 있거나 요청이 실패하면, Pencil 시안과 맞춘 폴백 데이터가 사용됩니다.

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API 서버 루트 주소. 끝 `/` 없이 입력 (예: `https://api.matjzing.example`) |

## 엔드포인트

### 1) 홈
- `GET /api/v1/home`
- 사용 파일: `src/lib/api/home.js`
- 반환 데이터: `hero.slides[]`, `categories[]`

### 2) 리스트
- `GET /api/v1/products?category={slug}`
- 사용 파일: `src/lib/api/catalog.js` 의 `getCatalogData(category)`
- 반환 데이터 예시:

```json
{
  "hero": { "title": "FIND YOUR\nDAILY JOYLOG" },
  "products": [
    {
      "badge": "[DAILY JOY]",
      "name": "Socks",
      "slug": "socks",
      "count": 2588,
      "tone": "#7ACCC0",
      "imageUrl": "https://cdn.example.com/products/socks.png",
      "price": 12,
      "description": "..."
    }
  ]
}
```

### 3) 상세
- `GET /api/v1/products/{slug}`
- 사용 파일: `src/lib/api/catalog.js` 의 `getProductDetail(slug)`
- 반환 데이터: 리스트 상품 스키마와 동일 필드(`name`, `price`, `description`, `imageUrl` 등)

## 라우트 매핑

| 프론트 라우트 | 화면 | 데이터 함수 |
| --- | --- | --- |
| `/` | Home Page | `getHomePageData()` |
| `/media` | List Page | `getCatalogData()` |
| `/media/[slug]` | Detail Page | `getProductDetail(slug)` |

## 실패 시 폴백

- API 실패(비정상 status, JSON 파싱 실패, 네트워크 오류) 시 폴백 데이터 렌더링
- 사용자에게 빈 화면 대신 디자인 시안 기반 기본 UI를 유지

## 캐시

- `fetch(..., { next: { revalidate: 60 } })` 사용
- 페이지 단위 `revalidate = 60`으로 ISR 스타일 재검증

# 백엔드 API 연동 가이드 (홈/리스트/상세)

프론트엔드는 `NEXT_PUBLIC_API_URL` 환경 변수로 지정한 백엔드 호스트에서 데이터를 가져옵니다. 변수가 비어 있거나 요청이 실패하면, Pencil 시안과 맞춘 폴백 데이터가 사용됩니다.

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API 서버 루트 주소. 끝 `/` 없이 입력 (예: `https://api.matjzing.example`) |

## 엔드포인트

### 1) 홈
- `GET /api/v1/home`
- 사용 파일: `src/lib/api/home.js`
- 반환 데이터: `hero.slides[]`, `categories[]`

### 2) 리스트
- `GET /api/v1/products?category={slug}`
- 사용 파일: `src/lib/api/catalog.js` 의 `getCatalogData(category)`
- 반환 데이터 예시:

```json
{
  "hero": { "title": "FIND YOUR\nDAILY JOYLOG" },
  "products": [
    {
      "badge": "[DAILY JOY]",
      "name": "Socks",
      "slug": "socks",
      "count": 2588,
      "tone": "#7ACCC0",
      "imageUrl": "https://cdn.example.com/products/socks.png",
      "price": 12,
      "description": "..."
    }
  ]
}
```

### 3) 상세
- `GET /api/v1/products/{slug}`
- 사용 파일: `src/lib/api/catalog.js` 의 `getProductDetail(slug)`
- 반환 데이터: 리스트 상품 스키마와 동일 필드(`name`, `price`, `description`, `imageUrl` 등)

## 라우트 매핑

| 프론트 라우트 | 화면 | 데이터 함수 |
| --- | --- | --- |
| `/` | Home Page | `getHomePageData()` |
| `/media` | List Page | `getCatalogData()` |
| `/media/[slug]` | Detail Page | `getProductDetail(slug)` |

## 실패 시 폴백

- API 실패(비정상 status, JSON 파싱 실패, 네트워크 오류) 시 폴백 데이터 렌더링
- 사용자에게 빈 화면 대신 디자인 시안 기반 기본 UI를 유지

## 캐시

- `fetch(..., { next: { revalidate: 60 } })` 사용
- 페이지 단위 `revalidate = 60`으로 ISR 스타일 재검증

# 백엔드 API 연동 가이드 (홈 페이지)

프론트엔드는 `NEXT_PUBLIC_API_URL` 환경 변수로 지정한 백엔드 호스트에서 홈 데이터를 가져옵니다. 변수가 비어 있거나 요청이 실패하면, Pencil 시안과 맞춘 **로컬 폴백 데이터**가 사용됩니다.

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API 서버 루트. **끝에 `/`를 붙이지 않습니다.** 예: `https://api.matjzing.example` |

개발 시 `.env.development` 또는 `.env.local`에 설정합니다. 샘플은 저장소 루트의 `.env.example`을 참고하세요.

## 엔드포인트

### `GET /api/v1/home`

홈 히어로(슬라이드)와 추천 카테고리 목록을 반환합니다.

#### 요청

- **Method**: `GET`
- **Headers**: `Accept: application/json` (권장)
- **인증**: 현재 화면 구현은 공개 GET만 가정합니다. 향후 JWT·쿠키가 필요하면 `src/lib/api/home.js`와 `src/lib/fetcher.js`에 헤더를 추가합니다.

#### 응답 본문 (JSON)

```json
{
  "hero": {
    "slides": [
      {
        "tag": "✦",
        "title": "SHOP DAILY JOY,\nTHE MATJZING WAY",
        "subtitle": "Handpicked curations for\na happy life log.",
        "ctaLabel": "BROWSE COLLECTION",
        "ctaHref": "/media",
        "imageUrl": "https://cdn.example.com/hero/bear.png"
      }
    ]
  },
  "categories": [
    {
      "badge": "[DAILY JOY]",
      "name": "Socks",
      "slug": "socks",
      "productCount": 2588,
      "imageUrl": "https://cdn.example.com/cat/socks.png"
    }
  ]
}
```

#### 필드 설명

| 경로 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `hero.slides` | `array` | 예 | 최소 1개. 순서대로 캐러셀에 표시됩니다. |
| `hero.slides[].tag` | `string` | 아니오 | 히어로 좌측 상단 장식 텍스트(시안의 `✦`). |
| `hero.slides[].title` | `string` | 예 | 줄바꿈은 `\n`으로 구분합니다. 대문자/줄 구성은 디자인과 맞춥니다. |
| `hero.slides[].subtitle` | `string` | 예 | 부제. 줄바꿈 `\n` 지원. |
| `hero.slides[].ctaLabel` | `string` | 예 | CTA 버튼 라벨. |
| `hero.slides[].ctaHref` | `string` | 예 | CTA 링크(프론트 내 경로 권장: `/media`, `/new` 등). |
| `hero.slides[].imageUrl` | `string` | 예 | 히어로 우측 이미지. HTTPS URL 권장. |
| `categories` | `array` | 예 | 추천 카테고리(시안은 3열). |
| `categories[].badge` | `string` | 예 | 예: `[DAILY JOY]`. |
| `categories[].name` | `string` | 예 | 카드 하단 좌측 이름. |
| `categories[].slug` | `string` | 예 | 목록 페이지 쿼리 등에 사용: `/media?category={slug}`. |
| `categories[].productCount` | `number` | 예 | 우측 숫자(상품 수 등). |
| `categories[].imageUrl` | `string` | 예 | 원형 썸네일 이미지. |

#### 오류·폴백 동작

- HTTP 상태가 2xx가 아니거나 JSON 파싱에 실패하면, 프론트는 **폴백 데이터**로 렌더링합니다(사용자에게 에러 페이지를 보이지 않음).
- 로그/모니터링이 필요하면 서버 컴포넌트의 `getHomePageData`에 `console.error` 또는 APM 연동을 추가할 수 있습니다.

## 이미지 URL과 Next.js

현재 홈 클라이언트 컴포넌트는 백엔드가 반환하는 임의의 `imageUrl`에 대응하기 위해 `next/image`에 `unoptimized`를 사용합니다. CDN 도메인이 고정이라면 `next.config.mjs`의 `images.remotePatterns`에 호스트를 등록하고, 최적화를 쓰도록 바꿀 수 있습니다.

## 캐시

`src/lib/api/home.js`의 `getHomePageData`는 Next의 `fetch(..., { next: { revalidate: 60 } })`를 사용합니다. 홈 페이지 `page.jsx`에도 `export const revalidate = 60`이 있어, **대략 60초 단위**로 ISR 스타일 재검증을 기대할 수 있습니다(배포 환경의 캐시 정책에 따라 달라질 수 있음).

## 백엔드 구현 체크리스트

- [ ] `GET /api/v1/home` 라우트 추가
- [ ] 위 JSON 스키마에 맞는 직렬화
- [ ] CORS: 브라우저에서 직접 호출하지 않고 **Next 서버가 동일 출처로 프록시**하는 현재 구조에서는 CORS 이슈가 없습니다. 클라이언트에서 직접 API를 부를 계획이면 CORS 허용 출처를 설정합니다.
- [ ] `imageUrl`은 HTTPS, 적절한 캐시 헤더를 갖는 스토리지 URL 권장

## 관련 프론트 파일

| 파일 | 역할 |
| --- | --- |
| `src/lib/api/home.js` | `getHomePageData`, 응답 정규화, 폴백 |
| `src/lib/fetcher.js` | 클라이언트/SWR용 JSON fetch 헬퍼 |
| `src/app/(app)/(home)/page.jsx` | 서버에서 데이터 로드 후 `comp.jsx`에 전달 |
| `src/app/(app)/(home)/comp.jsx` | 히어로 캐러셀·카테고리 UI |

## 버전 정책

스키마를 바꿀 때는 이 문서와 `normalizeHomePayload`를 함께 업데이트하고, 하위 호환 필드를 유지하거나 API 버전(`v2`)을 도입하는 것을 권장합니다.
