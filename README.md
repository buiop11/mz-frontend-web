# Matz Lab 웹사이트

맛찡랩 웹사이트 프론트엔드 프로젝트입니다.

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)
- [문서](#-문서)

## 프로젝트 개요

웹사이트는 다음과 같은 주요 기능을 제공합니다:

### 주요 섹션

- **사업소개**: 소개
- **콘텐츠**: 판매 콘텐츠 리스트
- **고객지원**: 공지, 자료실, FAQ, 1:1 문의

### 주요 기능

- 반응형 웹 디자인
- 통합 검색 시스템
- 미디어 콘텐츠 관리
- 사용자 인증 시스템

## 기술 스택

### Frontend Framework

- **Next.js 15.2.4** - React 기반 풀스택 프레임워크
- **React 19.1.0** - UI 라이브러리

### UI & Styling

- **Tailwind CSS 4.1.3** - 유틸리티 퍼스트 CSS 프레임워크
- **Shadcn/ui** - 재사용 가능한 UI 컴포넌트 라이브러리
- **Radix UI** - 접근성 중심의 헤드리스 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 상태 관리 & 데이터 페칭

- **Zustand** - 경량 상태 관리
- **SWR** - 데이터 페칭 및 캐싱
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증

### 애니메이션 & 인터랙션

- **GSAP** - 고급 애니메이션
- **Embla Carousel** - 캐러셀 컴포넌트
- **React Zoom Pan Pinch** - 이미지 줌/팬 기능

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Turbopack** - 개발 서버 (Next.js 15)

## 🛠️ 시작하기

### 필수 요구사항

- **Node.js** 18.17 이상
- **npm**, **yarn**, 또는 **pnpm**

### 설치 및 실행

1. **저장소 클론**

```bash
git clone <repository-url>
cd frontend-web
```

2. **의존성 설치**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **환경 변수 설정**

```bash
# .env.development 파일 생성
cp .env.example .env.development
```

4. **개발 서버 실행**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **브라우저에서 확인**
   [http://localhost:4100](http://localhost:4100)에서 결과를 확인하세요.

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 개발 환경 빌드
npm run build_dev

# 프로덕션 환경 빌드
npm run build_prod

# 개발 환경 서버 실행
npm run start_dev

# 프로덕션 환경 서버 실행
npm run start_prod

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

## 📁 프로젝트 구조

```
frontend-web/
├── public/                     # 정적 파일
│   ├── images/                # 이미지 리소스
│   │   ├── icon/             # 아이콘 파일들
│   │   ├── page/             # 페이지별 이미지
│   │   └── ...
│   └── videos/               # 비디오 파일
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (app)/           # 메인 앱 레이아웃 그룹
│   │   │   ├── (home)/      # 홈 페이지
│   │   │   ├── media/       # 콘텐츠 관련 페이지
│   │   │   ├── search/      # 검색 페이지
│   │   │   └── support/     # 고객지원 페이지
│   │   ├── (terms)/         # 약관 페이지 그룹
│   │   └── layout.js        # 루트 레이아웃
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── form/           # 폼 관련 컴포넌트
│   │   ├── dialog/         # 모달/다이얼로그
│   │   └── ...
│   ├── constants/          # 상수 정의
│   ├── hooks/             # 커스텀 훅
│   ├── lib/               # 유틸리티 함수
│   ├── store/             # 상태 관리 (Zustand)
│   ├── styles/            # 글로벌 스타일
│   └── fonts/             # 로컬 폰트 파일
├── deploy/                 # 배포 관련 스크립트
├── docs/                   # 프로젝트 문서
├── components.json         # Shadcn/ui 설정
├── next.config.mjs        # Next.js 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── package.json           # 프로젝트 의존성
```

## 개발 가이드

### 페이지 구조 패턴

각 페이지는 다음과 같은 패턴을 따릅니다 :

```javascript
// page.jsx - 서버 컴포넌트
import PageContents from "./comp";
import { Suspense } from "react";

export const revalidate = 60;

const Page = async () => {
  return (
    <Suspense fallback={<div>로딩</div>}>
      <PageContents />
    </Suspense>
  );
};

export default Page;
```

```javascript
// comp.jsx - 클라이언트 컴포넌트
"use client";

import { useState } from "react";

const PageContents = () => {
  const [state, setState] = useState(null);

  return <div>{/* 컴포넌트 내용 */}</div>;
};

export default PageContents;
```

### 컴포넌트 작성 규칙

- **파일명**: `kebab-case.jsx`
- **컴포넌트명**: `PascalCase`
- **UI 컴포넌트**: `src/components/ui/` 디렉토리에 배치
- **페이지 특화 컴포넌트**: 해당 페이지 디렉토리에 배치

### 스타일링

- **Tailwind CSS** 클래스 사용
- **일관된 클래스 순서**: 레이아웃 → 크기 → 색상 → 효과
- **반응형 디자인**: 모바일 우선 접근법

```javascript
className =
  "flex items-center justify-center w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
```

### 상태 관리

- **로컬 상태**: `useState`, `useReducer`
- **전역 상태**: `Zustand`
- **서버 상태**: `SWR`
- **폼 상태**: `React Hook Form` + `Zod`

## 배포

### 환경 변수

배포 전 다음 환경 변수를 설정해야 합니다:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_PC_DOMAIN=https://example.com
```

### 배포 스크립트

```bash
# 개발 환경 배포
npm run build_dev
npm run start_dev

# 프로덕션 환경 배포
npm run build_prod
npm run start_prod
```

### Docker 배포

```bash
# 개발 환경
docker build -f deploy/docker/Dockerfile.dev -t sff-frontend:dev .

# 프로덕션 환경
docker build -f deploy/docker/Dockerfile.prod -t sff-frontend:prod .
```

## 문서

### 프로젝트 문서

- [프로젝트 구조 및 개발 패턴 가이드](./docs/project-structure-guide.md)
- [페이지 구조 가이드](./docs/page-structure-guide.md)
- [Figma MCP 가이드](./docs/figma-mcp-guide.md)
- [백엔드 API 연동 (홈)](./docs/backend-api-integration.md)

### 주요 기능 문서

- **라우팅**: Next.js App Router 사용
- **스타일링**: Tailwind CSS + Shadcn/ui
- **폼 관리**: React Hook Form + Zod
- **상태 관리**: Zustand
- **데이터 페칭**: SWR

**삼성스마트공장 웹사이트** - 2025
