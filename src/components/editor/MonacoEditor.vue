<!-- Monaco Editor with LSP 컴포넌트 (최적화 버전) -->
<template>
  <div ref="editorContainer" id="monaco-editor-root" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Monaco 관련 import
import { RegisteredFileSystemProvider, RegisteredMemoryFile, registerFileSystemOverlay } from '@codingame/monaco-vscode-files-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import * as vscode from 'vscode';
import { LogLevel } from '@codingame/monaco-vscode-api';
import { EditorApp, type EditorAppConfig } from 'monaco-languageclient/editorApp';
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory';
import { LanguageClientWrapper, type LanguageClientConfig } from 'monaco-languageclient/lcwrapper';
import { MonacoVscodeApiWrapper, type MonacoVscodeApiConfig } from 'monaco-languageclient/vscodeApiWrapper';
import { URL_PREFIX, URL_PORT } from '../../config/api';
import type { MonacoEditorConfig } from '../../services/extendedClient';

// 언어 확장자 로드
import '@codingame/monaco-vscode-java-default-extension';
import '@codingame/monaco-vscode-python-default-extension';
import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-typescript-language-features-default-extension';
import '@codingame/monaco-vscode-json-default-extension';

const props = defineProps<{
  config: MonacoEditorConfig;
}>();

const editorContainer = ref<HTMLElement>()
let editorApp: EditorApp | null = null;
let lcWrapper: LanguageClientWrapper | null = null;
let apiWrapper: MonacoVscodeApiWrapper | null = null;
const isReady = ref(false);
const lspConnected = ref(false);

// 파일 확장자 매핑
const FILE_EXTENSIONS: Record<string, string> = {
  python: 'py', javascript: 'js', typescript: 'ts', json: 'json',
  java: 'java', html: 'html', css: 'css', xml: 'xml',
  yaml: 'yml', markdown: 'md', cpp: 'cpp', c: 'c',
  csharp: 'cs', go: 'go', rust: 'rs', php: 'php',
  ruby: 'rb', swift: 'swift', kotlin: 'kt', scala: 'scala',
  sql: 'sql', shell: 'sh', powershell: 'ps1', dockerfile: 'dockerfile'
};

function getFileExtension(languageId: string): string {
  return FILE_EXTENSIONS[languageId] || languageId;
}

// 코드 가져오기
const getCurrentCode = (): string => {
  try {
    const editor = editorApp?.getEditor();
    const model = editor?.getModel();
    return model?.getValue() || '';
  } catch (error) {
    console.error('MonacoEditor: 코드 가져오기 오류:', error);
    return '';
  }
};

defineExpose({
  getCurrentCode,
  isReady,
  lspConnected
});

// 에디터 초기화
onMounted(async () => {
  console.log('🚀 MonacoEditor 초기화 시작');

  try {
    // 전역 인스턴스가 활성화되어 있는지 확인
    if (window.__monacoEditorActive) {
      console.warn('⚠️ 이미 활성화된 Monaco Editor가 있습니다. 정리를 기다립니다...');
      // 이전 인스턴스가 정리될 때까지 최대 2초 대기
      let waitCount = 0;
      while (window.__monacoEditorActive && waitCount < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitCount++;
      }
      
      // 여전히 활성화되어 있다면 에러
      if (window.__monacoEditorActive) {
        throw new Error('Monaco Editor가 이미 로드되어 있습니다. 페이지를 새로고침해주세요.');
      }
    }

    // 이전 인스턴스가 완전히 정리될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 300));

    const htmlContainer = editorContainer.value!;
    if (!htmlContainer) {
      console.error('❌ 에디터 컨테이너를 찾을 수 없습니다');
      return;
    }

    // 전역 플래그 설정
    window.__monacoEditorActive = true;
    window.__monacoEditorCleanup = async () => {
      await cleanup();
    };

    const sourceCode = props.config.sourceCode || '';
    const lsConfig = props.config.lspConfig;

    // 1. 파일 시스템 설정
    const fileExtension = getFileExtension(lsConfig.languageId);
    const fileUri = vscode.Uri.file(`${lsConfig.basePath}/workspace/hello.${fileExtension}`);

    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(new RegisteredMemoryFile(fileUri, sourceCode));
    registerFileSystemOverlay(1, fileSystemProvider);

    // 2. VSCode API 설정
    const vscodeApiConfig: MonacoVscodeApiConfig = {
      $type: 'extended',
      viewsConfig: {
        $type: 'EditorService',
        htmlContainer
      },
      logLevel: LogLevel.Off, // 프로덕션에서는 로그 최소화
      serviceOverrides: {
        ...getKeybindingsServiceOverride(),
      },
      userConfiguration: {
        json: JSON.stringify({
          'workbench.colorTheme': 'Default Dark Modern',
          'editor.guides.bracketPairsHorizontal': 'active',
          'editor.lightbulb.enabled': 'On',
          'editor.wordBasedSuggestions': 'off',
          'editor.experimental.asyncTokenization': true,
          'editor.semanticHighlighting.enabled': true
        })
      },
      monacoWorkerFactory: configureDefaultWorkerFactory
    };

    // 3. LSP 클라이언트 설정
    const path = lsConfig.path || lsConfig.languageId;
    const languageClientConfig: LanguageClientConfig = {
      languageId: lsConfig.languageId,
      connection: {
        options: {
          $type: 'WebSocketUrl',
          url: `ws://${URL_PREFIX}:${URL_PORT}/${path}`,
          startOptions: {
            onCall: () => console.log('✅ LSP 연결'),
            reportStatus: true
          },
          stopOptions: {
            onCall: () => console.log('⚠️ LSP 연결 해제'),
            reportStatus: true
          }
        },
      },
      clientOptions: {
        documentSelector: [lsConfig.languageId],
        workspaceFolder: {
          index: 0,
          name: 'workspace',
          uri: vscode.Uri.parse(`${lsConfig.basePath}/workspace`)
        }
      }
    };

    // 4. EditorApp 설정
    const editorAppConfig: EditorAppConfig = {
      codeResources: {
        modified: {
          text: sourceCode,
          uri: fileUri.path
        }
      }
    };

    // 5. Monaco VSCode API 초기화
    // 중복 로드 방지를 위한 전역 상태 확인
    try {
      apiWrapper = new MonacoVscodeApiWrapper(vscodeApiConfig);
      await apiWrapper.start();
    } catch (monacoError: any) {
      // 이미 로드된 Monaco Editor 오류인 경우 처리
      if (monacoError?.message?.includes('already been loaded') || 
          monacoError?.message?.includes('already loaded')) {
        console.warn('⚠️ Monaco VSCode API가 이미 로드되어 있습니다. 페이지를 새로고침합니다...');
        // 페이지를 새로고침하여 완전히 초기화
        window.location.reload();
        return;
      }
      throw monacoError;
    }

    // TextMate 문법 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6. EditorApp 시작
    lcWrapper = new LanguageClientWrapper(languageClientConfig, apiWrapper.getLogger());
    editorApp = new EditorApp(editorAppConfig);
    await editorApp.start(htmlContainer);

    // 7. 언어 설정
    const editor = editorApp.getEditor();
    const model = editor?.getModel();
    if (model) {
      const monaco = await import('@codingame/monaco-vscode-editor-api');
      const currentLanguage = model.getLanguageId();

      if (currentLanguage !== lsConfig.languageId) {
        monaco.editor.setModelLanguage(model, lsConfig.languageId);
        console.log(`✅ 언어 설정: ${lsConfig.languageId}`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // 8. LSP 연결 시도 (선택적)
    try {
      await lcWrapper.start();
      await vscode.workspace.openTextDocument(fileUri);
      lspConnected.value = true;
      console.log('✅ LSP 서버 연결 성공');
    } catch (lspError) {
      lspConnected.value = false;
      console.warn('⚠️ LSP 서버 연결 실패 - 기본 편집 모드');
    }

    // 9. 준비 완료
    isReady.value = true;
    console.log('🎉 MonacoEditor 준비 완료');

  } catch (error) {
    console.error('❌ MonacoEditor 초기화 오류:', error);
    isReady.value = false;
    // 에러 발생 시 전역 플래그 해제
    window.__monacoEditorActive = false;
    window.__monacoEditorCleanup = undefined;
  }
});

// 정리 함수
async function cleanup() {
  console.log('🧹 MonacoEditor 정리 시작');
  try {
    // 순서대로 정리 (중요: apiWrapper를 마지막에 정리)
    if (lcWrapper) {
      try {
        await lcWrapper.dispose();
        console.log('✅ LanguageClientWrapper 정리 완료');
      } catch (e) {
        console.warn('⚠️ LanguageClientWrapper 정리 중 오류:', e);
      }
      lcWrapper = null;
    }
    
    if (editorApp) {
      try {
        await editorApp.dispose();
        console.log('✅ EditorApp 정리 완료');
      } catch (e) {
        console.warn('⚠️ EditorApp 정리 중 오류:', e);
      }
      editorApp = null;
    }
    
    // apiWrapper를 마지막에 정리 (전역 상태이므로)
    if (apiWrapper) {
      try {
        await apiWrapper.dispose();
        console.log('✅ MonacoVscodeApiWrapper 정리 완료');
        // 정리 후 약간의 지연을 주어 전역 상태가 완전히 해제되도록 함
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.warn('⚠️ MonacoVscodeApiWrapper 정리 중 오류:', e);
      }
      apiWrapper = null;
    }
    
    // 전역 플래그 해제
    window.__monacoEditorActive = false;
    window.__monacoEditorCleanup = undefined;
    
    isReady.value = false;
    lspConnected.value = false;
    console.log('✅ MonacoEditor 정리 완료');
  } catch (e) {
    console.error('❌ MonacoEditor 정리 오류:', e);
    // 에러가 발생해도 플래그는 해제
    window.__monacoEditorActive = false;
    window.__monacoEditorCleanup = undefined;
  }
}

// 리소스 정리
onBeforeUnmount(async () => {
  await cleanup();
});
</script>

<style>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

/* 에디터 배경 및 스타일 */
.monaco-editor-container .monaco-editor {
  background-color: #1e1e1e !important;
}

/* 줄 스타일 - 흰색 박스 제거 */
.monaco-editor-container .monaco-editor .view-lines .view-line,
.monaco-editor-container .monaco-editor .view-line > span {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 행 번호 영역 */
.monaco-editor-container .monaco-editor .margin {
  background-color: #1e1e1e !important;
}

.monaco-editor-container .monaco-editor .line-numbers {
  color: #858585 !important;
}

/* 현재 줄 하이라이트 */
.monaco-editor-container .monaco-editor .current-line {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: none !important;
}

/* 선택 영역 */
.monaco-editor-container .monaco-editor .selected-text {
  background-color: rgba(58, 133, 195, 0.3) !important;
}
</style>
