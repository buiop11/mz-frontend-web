# 프로젝트 구조 및 개발 패턴 가이드

## 🚀 핵심 기술 스택

### Frontend Framework

- **Next.js 15.2.4** - React 기반 풀스택 프레임워크
- **React 19.1.0** - UI 라이브러리

### UI & Styling

- **Tailwind CSS 4.1.3** - 유틸리티 퍼스트 CSS 프레임워크
- **Shadcn/ui** - 재사용 가능한 UI 컴포넌트 라이브러리


### 상태 관리 & 데이터 페칭

- **Zustand** - 복잡한 전역 상태 관리 효율적으로 관리할 때
- **react context** - 경량 상태 관리(변화가 자주 없고 구조가 단순한 값들)
- **SWR** - 데이터 페칭 및 캐싱
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증

### 애니메이션 & 인터랙션

- **GSAP** - 고급 애니메이션
- **Shadcn Carousel** - 캐러셀 컴포넌트
- **React Zoom Pan Pinch** - 이미지 줌/팬 기능

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Turbopack** - 개발 서버 (Next.js 15)

---

## 📁 디렉토리 구조

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
├── components.json         # Shadcn/ui 설정
├── next.config.mjs        # Next.js 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── package.json           # 프로젝트 의존성
```

---

## 🏗️ 개발 패턴

### 1. Next.js App Router 패턴

#### 라우트 그룹 활용

```javascript
// 라우트 그룹을 사용해 레이아웃을 분리
(app)/                 // 메인 앱 레이아웃 (헤더/푸터 포함)
(terms)/               // 약관 페이지 레이아웃 (단순 레이아웃)
```

#### 페이지 구조

```javascript
// 각 페이지는 page.jsx와 comp.jsx로 분리
page.jsx; // 서버 컴포넌트, 데이터 페칭
comp.jsx; // 클라이언트 컴포넌트, UI 로직
```

### 2. 컴포넌트 분리 패턴

#### 페이지 컴포넌트

```javascript
// src/app/(app)/business/about/page.jsx
import AboutContents from "./comp";
import { Suspense } from "react";

export const revalidate = 60;

const AboutPage = async () => {
  // 서버 사이드 데이터 페칭
  // const data = await fetcher("/api/v1/about");

  return (
    <Suspense fallback={<div>로딩</div>}>
      <AboutContents />
    </Suspense>
  );
};

export default AboutPage;
```

#### 컴포넌트 구현

```javascript
// src/app/(app)/business/about/comp.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const AboutContents = () => {
  const [state, setState] = useState(null);

  return <div>{/* 컴포넌트 내용 */}</div>;
};

export default AboutContents;
```

### 3. 데이터 페칭 패턴

#### SWR 사용

```javascript
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const { data, error, isLoading } = useSWR("/api/v1/data", fetcher);
```

---

## 📝 파일 명명 규칙

### 1. 기본 규칙

- **파일명**: `kebab-case`
- **컴포넌트 파일**: `kebab-case.jsx`
- **유틸리티 파일**: `kebab-case.js`
- **상수 파일**: `kebab-case.js`

### 2. 파일 확장자

- **React 컴포넌트**: `.jsx`
- **일반 JavaScript**: `.js`
- **스타일**: `.css`

### 3. 페이지 구조

```
business/
├── about/
│   ├── page.jsx          # Next.js 페이지 파일
│   └── comp.jsx          # 실제 UI 컴포넌트
├── innovation/
│   ├── page.jsx
│   └── comp.jsx
└── layout.jsx            # 레이아웃 컴포넌트
```

### 4. 컴포넌트 디렉토리

```
components/
├── ui/                   # 기본 UI 컴포넌트
│   ├── button.jsx
│   ├── input.jsx
│   └── dialog.jsx
├── layout/               # 레이아웃 컴포넌트
│   ├── header.jsx
│   ├── footer.jsx
│   └── navigation.jsx
└── form/                 # 폼 관련 컴포넌트
    ├── form-input.jsx
    ├── form-select.jsx
    └── form-textarea.jsx
```

---

## 📊 상태 관리

### 1. Zustand Store 패턴

```javascript
// src/store/dialog.js
import { create } from "zustand";

const useDialogStore = create((set) => ({
  isOpen: false,
  title: "",
  content: "",
  openDialog: (title, content) => set({ isOpen: true, title, content }),
  closeDialog: () => set({ isOpen: false, title: "", content: "" }),
}));

export default useDialogStore;
```

### 2. React Hook Form 패턴

```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
});

const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* 폼 필드들 */}</form>;
};
```

---

## 🎨 스타일링 가이드

### 1. Tailwind CSS 클래스 구성

```javascript
// 일관된 클래스 순서: 레이아웃 → 크기 → 색상 → 효과
className =
  "flex items-center justify-center w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
```

### 2. 반응형 디자인 패턴

```javascript
// 모바일 퍼스트 접근
className = "w-full md:w-1/2 lg:w-1/3 xl:w-1/4";
```

### 3. CSS 변수 활용

```css
/* src/styles/variables.css */
:root {
  --gradient-brand: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color-primary-blue: #1e40af;
}
```

### 4. 커스텀 클래스 정의

```css
/* 프로젝트 특화 클래스 */
.body3 {
  @apply text-lg font-medium;
}
.body4 {
  @apply text-base font-medium;
}
.body5 {
  @apply text-sm font-medium;
}
```

---

## 🌐 API 통신

### 1. Fetcher 유틸리티

```javascript
// src/lib/fetcher.js
export const fetcher = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API 요청 실패");
  }

  return response.json();
};
```

### 2. SWR 사용 패턴

```javascript
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const useApiData = (endpoint) => {
  const { data, error, isLoading, mutate } = useSWR(
    endpoint ? `/api/v1${endpoint}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
```

---

## 📋 개발 체크리스트

### 새 페이지 생성 시

- [ ] `page.jsx` (서버 컴포넌트) 생성
- [ ] `comp.jsx` (클라이언트 컴포넌트) 생성
- [ ] 네비게이션 메뉴에 추가 (`constants/navigation.js`)
- [ ] 메타데이터 설정
- [ ] 반응형 스타일 적용

### 코드 리뷰 시 확인사항

- [ ] 일관된 명명 규칙 준수
- [ ] 컴포넌트 분리 패턴 준수
- [ ] 접근성 고려사항 체크
- [ ] 성능 최적화 고려

---

## 🔗 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [SWR 공식 문서](https://swr.vercel.app/)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)

---

_이 가이드는 프로젝트의 성장과 함께 지속적으로 업데이트됩니다._
