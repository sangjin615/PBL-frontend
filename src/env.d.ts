/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 개발 환경 디버깅 헬퍼
interface Window {
  adminDebug?: {
    makeAdmin: () => boolean;
    makeUser: () => boolean;
    getCurrentUser: () => any;
  };
}