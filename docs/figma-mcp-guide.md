# Figma Context MCP Server 사용 가이드

## 개요

Figma Context MCP Server는 Figma 디자인을 기반으로 React 컴포넌트를 효율적으로 개발할 수 있도록 도와주는 도구입니다.
이 가이드는 프로젝트의 기존 컴포넌트와 스타일 시스템을 활용하여 일관성 있는 개발을 진행하는 방법을 제시합니다.

## 기본 원칙

### 1. 컴포넌트 재사용

기존 UI 컴포넌트를 최대한 활용하여 개발 효율성을 높이고 일관성을 유지합니다.

```jsx
// 기본 컴포넌트 활용 예시
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
```

### 2. 타이포그래피 시스템

`globals.css`의 utilities 클래스를 사용하여 일관된 텍스트 스타일을 적용합니다.

```jsx
// 반응형 타이포그래피 클래스 사용
<h1 className="display">메인 제목</h1>
<h2 className="heading1">섹션 제목</h2>
<h3 className="heading2">서브 제목</h3>
<p className="body1">본문 텍스트</p>
<span className="body3">작은 텍스트</span>
```

#### Figma 텍스트 스타일 매핑 가이드

Figma에서 텍스트 스타일을 분석할 때 다음 규칙에 따라 프로젝트의 타이포그래피 클래스로 매핑합니다:

**폰트 크기별 매핑 규칙:**

| Figma 폰트 크기 | 용도         | 매핑 클래스 | 설명                       |
| --------------- | ------------ | ----------- | -------------------------- |
| 60px            | 메인 타이틀  | `display`   | 랜딩 페이지 대형 제목      |
| 52px            | 페이지 제목  | `heading1`  | 페이지 최상위 제목         |
| 40px            | 섹션 제목    | `heading2`  | 주요 섹션 제목             |
| 36px            | 서브 섹션    | `heading3`  | 서브 섹션 제목             |
| 24px            | 큰 본문      | `body1`     | 중요한 본문, 인트로 텍스트 |
| 20px            | 기본 본문    | `body2`     | 일반적인 본문 텍스트       |
| 18px            | 작은 본문    | `body3`     | 부가 설명, 보조 텍스트     |
| 16px            | 폼/UI 텍스트 | `body4`     | 버튼, 입력 필드, 레이블    |
| 14px            | 세부 정보    | `body5`     | 날짜, 카테고리, 메타 정보  |
| 12px            | 캡션/라벨    | `caption`   | 작은 라벨, 도움말 텍스트   |

**매핑 예시:**

```jsx
// Figma에서 fontSize: 16인 텍스트
// → body4 클래스 사용
<span className="body4">배송비는 어떻게 되나요?</span>

// Figma에서 fontSize: 12
// → caption 클래스 사용
<span className="caption">스마트공장 지원사업</span>

// Figma에서 fontSize: 24, fontWeight: 700인 제목
// → body1 클래스 + font-bold 사용
<h2 className="body1 font-bold">섹션 제목</h2>
```

**폰트 굵기(fontWeight) 매핑:**

| Figma fontWeight | Tailwind 클래스 | 용도                 |
| ---------------- | --------------- | -------------------- |
| 700              | `font-bold`     | 제목, 강조 텍스트    |
| 600              | `font-semibold` | 서브 제목, 라벨      |
| 500              | `font-medium`   | 일반 텍스트 (기본값) |
| 400              | `font-normal`   | 본문 텍스트          |

**색상 매핑:**

| Figma 색상 | Tailwind 클래스 | 용도              |
| ---------- | --------------- | ----------------- |
| #000000    | `text-black`    | 기본 텍스트       |
| #4A4C53    | `text-gray-600` | 보조 텍스트       |
| #686A72    | `text-gray-500` | 비활성 텍스트     |
| #3250FE    | `text-blue-500` | 링크, 강조 텍스트 |
| #D23D2C    | `text-red-500`  | 에러, 경고 텍스트 |

**실제 적용 예시:**

```jsx
// Figma 분석 결과:
// - fontSize: 16px
// - fontWeight: 500
// - color: #000000
//
// 매핑 결과:
<p className="body4 font-medium text-black">
  1:1문의는 어떻게 하나요?
</p>

// Figma 분석 결과:
// - fontSize: 12px
// - fontWeight: 600
// - color: #4A4C53
//
// 매핑 결과:
<span className="caption font-semibold text-gray-600">
  Matz Lab
</span>
```

**피그마 디자인 실제 분석 예시 (node-id: 2253-33693):**

```jsx
// 분석된 Figma 텍스트 스타일:
// style_18DYXT: fontSize: 16px, fontWeight: 500, color: #000000
// style_V516Z2: fontSize: 12px, fontWeight: 600, color: #4A4C53

// React 컴포넌트로 변환:
<div className="bg-white border-b border-gray-200 p-5">
  <div className="flex flex-col gap-2">
    {/* 카테고리 라벨 */}
    <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-full">
      <span className="caption font-semibold text-gray-600">
          Matz Lab
      </span>
    </div>

    {/* 제목 텍스트 */}
    <h3 className="body4 font-medium text-black">
        1:1문의는 어떻게 하나요?
    </h3>
  </div>
</div>
```

**자동 매핑 규칙:**

1. **텍스트 크기 분석**: `fontSize` 값을 확인하여 해당하는 타이포그래피 클래스 결정
2. **폰트 굵기 분석**: `fontWeight` 값을 Tailwind 폰트 클래스로 변환
3. **색상 분석**: 색상 코드를 프로젝트의 표준 색상 클래스로 매핑
4. **컨텍스트 고려**: 텍스트의 용도(제목, 본문, 라벨 등)에 따라 적절한 HTML 태그 선택

### 3. 색상 시스템

`variables.css`의 색상 변수를 활용하여 브랜드 일관성을 유지합니다.

```jsx
// CSS 변수 활용
<div className="bg-blue-500 text-white">
  <span className="text-gray-700">보조 텍스트</span>
</div>
```

### 4. 반응형 디자인

프로젝트의 브레이크포인트를 준수합니다:

- **모바일**: 기본 (768px 미만)
- **태블릿**: `sm:` (768px 이상)
- **PC**: `md:` (1024px 이상)

## 주요 컴포넌트 활용법

### Button 컴포넌트

```jsx
import { Button } from "@/components/ui/button";

// 기본 사용법
<Button variant="primary" size="md">
  기본 버튼
</Button>;

// 반응형 적용
const { isMobile, isTablet, isDesktop } = useResponsiveQuery();
{
  isMobile && <p>모바일이닷 📱</p>;
}
{
  isTablet && <p>태블릿임 💻</p>;
}
{
  isDesktop && <p>데스크탑이여! 🖥️</p>;
}
<Button variant="outline" size="sm" pcSize="md">
  반응형 버튼
</Button>;
```

## 레이아웃 패턴

## 색상 활용 가이드

### 브랜드 색상

```jsx
// 주요 브랜드 색상
<div className="bg-blue-500 text-white">Primary Blue</div>
<div className="bg-green-500 text-white">Primary Green</div>
<div className="bg-red-500 text-white">Primary Red</div>

// 그레이 스케일
<div className="bg-gray-50 text-gray-900">Light Background</div>
<div className="bg-gray-100 text-gray-800">Subtle Background</div>
<div className="bg-gray-900 text-white">Dark Background</div>
```

## 반응형 개발 패턴

### 간격 조정

```jsx
// 마진/패딩
<div className="p-5 sm:p-8 md:p-10">
  <div className="mb-5 sm:mb-8 md:mb-10">
    {/* 콘텐츠 */}
  </div>
</div>

// 갭
<div className="flex gap-3 sm:gap-5 md:gap-8">
  {/* 플렉스 아이템들 */}
</div>
```

### 숨김/표시

```jsx
// 모바일에서만 표시
<div className="block sm:hidden">
  모바일 전용 콘텐츠
</div>

// 태블릿 이상에서만 표시
<div className="hidden sm:block">
  태블릿/PC 전용 콘텐츠
</div>

// PC에서만 표시
<div className="hidden md:block">
  PC 전용 콘텐츠
</div>
```

## 폼 구성 패턴

### 기본 폼 레이아웃

app/(app)/example/form/page.jsx 화면참고

## 접근성 고려사항

### 키보드 네비게이션

```jsx
// 포커스 가능한 요소들
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  버튼
</button>
```

### 스크린 리더 지원

```jsx
// aria 속성 활용
<button
  aria-label="메뉴 열기"
  aria-expanded={isMenuOpen}
  aria-controls="navigation-menu"
>
  <span className="sr-only">메뉴</span>
  {/* 아이콘 */}
</button>

<nav id="navigation-menu" aria-hidden={!isMenuOpen}>
  {/* 네비게이션 메뉴 */}
</nav>
```

## 성능 최적화

### 이미지 최적화

```jsx
import Img from "@/components/ui/img";

// 반응형 이미지
<Img
  src="/images/hero-image.jpg"
  alt="히어로 이미지"
  width={800}
  height={400}
  className="w-full h-auto object-cover"
  priority={true}
/>;
```

## 마무리

이 가이드를 통해 Figma 디자인을 기반으로 일관성 있고 접근성이 좋은 React 컴포넌트를 개발할 수 있습니다. 
항상 기존 컴포넌트를 먼저 확인하고, 프로젝트의 디자인 시스템을 준수하여 개발하시기 바랍니다.

### 추가 참고사항

- 새로운 컴포넌트 개발 시 기존 패턴을 따라 작성
- 색상과 타이포그래피는 반드시 정의된 변수 사용
- 반응형 디자인은 모바일 우선으로 개발
- 접근성과 성능을 항상 고려하여 개발
