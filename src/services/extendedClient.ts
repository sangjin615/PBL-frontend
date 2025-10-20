/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2025 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

/**
 * 이 파일은 타입 정의만 포함합니다.
 *
 * 실제 Monaco Editor 초기화 로직은 MonacoEditor.vue 컴포넌트에 통합되었습니다.
 * runExtendedClient 함수는 더 이상 사용되지 않으며,
 * MonacoEditor.vue에서 직접 EditorApp과 LSP를 초기화합니다.
 *
 * 이렇게 변경한 이유:
 * - LSP 서버 연결 실패 시에도 에디터 사용 가능
 * - 에디터 인스턴스에 직접 접근하여 코드 가져오기 간소화
 * - 디버깅 및 에러 처리 개선
 */

// LSP 설정 타입
export type ExampleLsConfig = {
    port?: number;
    path: string;
    basePath?: string;
    languageId: string;
};

// Monaco Editor 통합 설정 타입
export type MonacoEditorConfig = {
    languageId: number;          // Judge0 언어 ID
    sourceCode: string;           // 소스코드
    monacoLanguage: string;       // Monaco 언어 이름 (내부 계산)
    lspConfig: ExampleLsConfig;   // LSP 설정 (내부 계산)
};
