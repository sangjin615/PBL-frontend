/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2025 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { RegisteredFileSystemProvider, RegisteredMemoryFile, registerFileSystemOverlay } from '@codingame/monaco-vscode-files-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import * as vscode from 'vscode';
// this is required syntax highlighting
import { LogLevel } from '@codingame/monaco-vscode-api';
import '@codingame/monaco-vscode-java-default-extension';
import { EditorApp, type EditorAppConfig } from 'monaco-languageclient/editorApp';
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory';
import { LanguageClientWrapper, type LanguageClientConfig } from 'monaco-languageclient/lcwrapper';
import { MonacoVscodeApiWrapper, type MonacoVscodeApiConfig } from 'monaco-languageclient/vscodeApiWrapper';
import { LangiumMonarchContent } from '../config/langium.monarch.js';
import { URL_PREFIX, URL_PORT } from '../config/api';

export const runExtendedClient = async (lsConfig: ExampleLsConfig, helloCode: string) => {
    // 언어별 파일 확장자 매핑
    const getFileExtension = (languageId: string): string => {
        const extensions: Record<string, string> = {
            python: 'py',
            javascript: 'js',
            typescript: 'ts',
            json: 'json',
            java: 'java',
            html: 'html',
            css: 'css',
            xml: 'xml',
            yaml: 'yml',
            markdown: 'md',
            cpp: 'cpp',
            c: 'c',
            csharp: 'cs',
            go: 'go',
            rust: 'rs',
            php: 'php',
            ruby: 'rb',
            swift: 'swift',
            kotlin: 'kt',
            scala: 'scala',
            sql: 'sql',
            shell: 'sh',
            powershell: 'ps1',
            dockerfile: 'dockerfile'
        };
        return extensions[languageId] || languageId; // 매핑이 없으면 원래 languageId 사용
    };

    // 파일 URI 생성 및 메모리 파일 시스템에 등록
    // LSP 서버가 파일을 인식할 수 있도록 가상 파일 시스템에 파일을 등록
    const fileExtension = getFileExtension(lsConfig.languageId);
    const helloUri = vscode.Uri.file(`${lsConfig.basePath}/workspace/hello.${fileExtension}`);
    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(new RegisteredMemoryFile(helloUri, helloCode));
    registerFileSystemOverlay(1, fileSystemProvider);

    const htmlContainer = document.getElementById('monaco-editor-root')!;
    const vscodeApiConfig: MonacoVscodeApiConfig = {
        $type: 'extended',
        viewsConfig: {
            $type: 'EditorService',
            htmlContainer
        },
        logLevel: LogLevel.Debug,
        serviceOverrides: {
            ...getKeybindingsServiceOverride(),
        },
        userConfiguration: {
            json: JSON.stringify({
                'workbench.colorTheme': 'Default Dark Modern',
                'editor.guides.bracketPairsHorizontal': 'active',
                'editor.lightbulb.enabled': 'On',
                'editor.wordBasedSuggestions': 'off',
                'editor.experimental.asyncTokenization': true
            })
        },
        monacoWorkerFactory: configureDefaultWorkerFactory
    };
    const path = lsConfig.path || lsConfig.languageId;
    const languageClientConfig: LanguageClientConfig = {
        languageId: lsConfig.languageId,
        connection: {
            options: {
                $type: 'WebSocketUrl',
                url: `ws://${URL_PREFIX}:${URL_PORT}/${path}`,
                startOptions: {
                    onCall: () => {
                        console.log('Connected to socket.');
                    },
                    reportStatus: true
                },
                stopOptions: {
                    onCall: () => {
                        console.log('Disconnected from socket.');
                    },
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

    const editorAppConfig: EditorAppConfig = {
        codeResources: {
            modified: {
                text: helloCode,
                uri: helloUri.path
            }
        },
        languageDef: {
            monarchLanguage: LangiumMonarchContent,
            languageExtensionConfig: { id: 'langium' }
        }
    };

    // perform global init
    const apiWrapper = new MonacoVscodeApiWrapper(vscodeApiConfig);
    await apiWrapper.start();

    const lcWrapper = new LanguageClientWrapper(languageClientConfig, apiWrapper.getLogger());
    const editorApp = new EditorApp(editorAppConfig);

    try {
        // 에디터와 LSP 클라이언트 시작 (버튼 없이 바로 시작)
        await editorApp.start(htmlContainer);
        await lcWrapper.start();

        // open files, so the LS can pick it up
        await vscode.workspace.openTextDocument(helloUri);
        
        // 에디터와 LSP 클라이언트 인스턴스 반환
        return {
            editorApp,
            lcWrapper,
        };
    } catch (e) {
        console.error('Monaco Editor 초기화 중 오류 발생:', e);
        throw e;
    }
};

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
