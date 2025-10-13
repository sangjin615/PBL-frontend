<!-- Monaco Editor with LSP 컴포넌트 (단순화 버전) -->
<template>
  <div ref="editorContainer" id="monaco-editor-root" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, computed } from 'vue'
// this is required syntax highlighting
// 언어 확장자들을 순서대로 로드
import '@codingame/monaco-vscode-json-default-extension';
import '@codingame/monaco-vscode-python-default-extension';
import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-typescript-language-features-default-extension';
import { runExtendedClient, type MonacoEditorConfig } from '../../services/extendedClient';

const props = defineProps<{
  config: MonacoEditorConfig;
}>();

const editorContainer = ref<HTMLElement>()
let currentLcWrapper: any = null;
let currentEditor: any = null;

// 소스코드 getter
const getCurrentCode = (): string => {
  if (currentEditor && currentEditor.getEditor) {
    return currentEditor.getEditor().getValue() || '';
  }
  console.warn('MonacoEditor: 에디터 인스턴스가 아직 준비되지 않았습니다.');
  return '';
};

// 외부에서 접근 가능하도록 expose
defineExpose({
  getCurrentCode
});

// 컴포넌트 마운트 시 에디터 초기화
onMounted(async () => {
  console.log('MonacoEditor 초기화:', {
    languageId: props.config.languageId,
    monacoLanguage: props.config.monacoLanguage,
    sourceCodeLength: props.config.sourceCode.length
  });

  const codeToUse = props.config.sourceCode || '';
  const editorInstance = await runExtendedClient(props.config.lspConfig, codeToUse);
  currentEditor = editorInstance.editorApp;
  currentLcWrapper = editorInstance.lcWrapper;

  console.log('MonacoEditor 초기화 완료');
});

// 리소스 정리 함수
const cleanup = async () => {
  if (currentEditor && currentEditor.dispose) {
    console.log('MonacoEditor LSP 연결 해제 시작');
    try {
      await currentLcWrapper.dispose();
      await currentEditor.dispose();
      currentLcWrapper = null;
      currentEditor = null;
      console.log('MonacoEditor LSP 연결 해제 완료');
    } catch (e) {
      console.error('MonacoEditor 정리 중 오류:', e);
    }
  }
};

// 라우터 이동 전에 즉시 정리
onBeforeUnmount(async () => {
  console.log('MonacoEditor 언마운트 시작 - 즉시 정리');
  await cleanup();
});

// // 안전장치 - 완전 언마운트 시에도 한번 더 정리
// onUnmounted(async () => {
//   console.log('MonacoEditor 언마운트 완료 - 최종 정리');
//   await cleanup();
// });

</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 300px; /* 안전 장치: 부모 높이 미지정 시에도 표시 */
}
</style>