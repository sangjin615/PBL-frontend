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
    const htmlContainer = editorContainer.value!;
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
    apiWrapper = new MonacoVscodeApiWrapper(vscodeApiConfig);
    await apiWrapper.start();

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
  }
});

// 리소스 정리
onBeforeUnmount(async () => {
  try {
    await lcWrapper?.dispose();
    await editorApp?.dispose();
    lcWrapper = null;
    editorApp = null;
    apiWrapper = null;
  } catch (e) {
    console.error('⚠️ MonacoEditor 정리 오류:', e);
  }
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
