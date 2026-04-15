# Dev Setup

[lab] 쇼핑몰 만들기

## Vapor UI

- URL: /docs/getting-started/installation
- Source: https://raw.githubusercontent.com/goorm-dev/vapor-ui/refs/heads/main/apps/website/content/docs/getting-started/(overview)/installation.mdx

### 사전 준비

| 요구사항 | 버전    |
| :------- | :------ |
| React    | 17 이상 |
| Node.js  | 16 이상 |

### 패키지 설치

```bash
npm install @vapor-ui/core @vapor-ui/icons
```

## 개발 기본 설정

이 저장소에는 코드 스타일과 기본 정적 검사를 위해 `Prettier`, `ESLint`, `TypeScript` 기반 설정이 포함되어 있습니다.

### 설치된 도구

- `prettier`
- `eslint`
- `typescript`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `husky`
- `@commitlint/cli`
- `@commitlint/config-conventional`

### 관련 설정 파일

- `package.json`: lint/format 스크립트 및 개발 의존성
- `eslint.config.js`: JavaScript, JSX, TypeScript, TSX용 ESLint 설정
- `commitlint.config.cjs`: 커밋 메시지 규칙
- `.husky/commit-msg`: 커밋 메시지 검사용 Git hook
- `.prettierrc.json`: Prettier 규칙
- `.prettierignore`: Prettier 제외 대상
- `.gitignore`: Git 추적 제외 파일
- `tsconfig.json`: TypeScript 기본 컴파일 옵션
- `.github/workflows/lint-and-format.yml`: GitHub Actions 품질 검사

### 사용 방법

의존성 설치:

```bash
npm install
```

Lint 실행:

```bash
npm run lint
```

Lint 자동 수정:

```bash
npm run lint:fix
```

Prettier 적용:

```bash
npm run format
```

Prettier 검사만 실행:

```bash
npm run format:check
```

Husky hook 설치:

```bash
npm run prepare
```

### 커밋 메시지 규칙

커밋 메시지는 대문자 타입을 대괄호로 감싼 형식을 따릅니다.

예시:

```text
[FEAT] add product card component
[FIX] handle empty cart state
[DOCS] update dev setup guide
[CHORE] configure commitlint and husky
```

형식:

```text
[TYPE] subject
```

자주 쓰는 `type`:

- `FEAT`
- `FIX`
- `ADD`
- `UPDATE`
- `REMOVE`
- `REFACTOR`
- `DOCS`
- `STYLE`
- `TEST`
- `CHORE`

### GitHub Actions

다음 경우에 자동으로 품질 검사가 실행됩니다.

- Pull Request 생성/수정 시
- `main` 브랜치 push 시
- `develop` 브랜치 push 시

실행 항목:

- `npm ci`
- `npm run lint`
- `npm run format:check`

### Git에 올리지 않는 파일

다음 유형의 파일은 `.gitignore`에 포함되어 있습니다.

- `node_modules/`
- `dist/`, `build/`, `coverage/`
- `.env`, `.env.*`
- `*.log`
- `.DS_Store`
- `.idea/`, `.vscode/`
- `.eslintcache`
- `*.tsbuildinfo`

### TypeScript 사용

현재 설정은 JavaScript만 써도 동작하고, 이후 `*.ts`, `*.tsx` 파일을 추가해도 바로 lint 대상에 포함됩니다.
