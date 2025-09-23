<template>
  <div class="terminal-container">
    <div ref="terminalElement" class="terminal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

interface Props {
  output?: string
  isRunning?: boolean
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  output: '',
  isRunning: false,
  language: 'python'
})

const terminalElement = ref<HTMLElement>()
let terminal: Terminal | null = null

// 터미널 초기화
function initTerminal() {
  if (!terminalElement.value) return

  terminal = new Terminal({
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#ffffff',
      selection: '#264f78',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#e5e5e5'
    },
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorBlink: true,
    cursorStyle: 'block',
    scrollback: 1000,
    rows: 20,
    cols: 80
  })

  terminal.open(terminalElement.value)
  
  // 초기 프롬프트 표시
  showPrompt()
}

// 프롬프트 표시
function showPrompt() {
  if (!terminal) return
  
  const language = props.language || 'python'
  const prompt = getPrompt(language)
  terminal.write(`\x1B[1;32m${prompt}\x1B[0m `)
}

// 언어별 프롬프트
function getPrompt(language: string): string {
  const prompts = {
    python: 'python',
    javascript: 'node',
    java: 'java',
    cpp: 'g++',
    c: 'gcc'
  }
  return prompts[language as keyof typeof prompts] || 'python'
}

// 실행 중 표시
function showRunning() {
  if (!terminal) return
  
  terminal.write('\x1B[1;33m실행 중...\x1B[0m\r\n')
}

// 실행 결과 표시
function showOutput(output: string) {
  if (!terminal) return
  
  // 이전 프롬프트 지우기
  terminal.write('\x1B[2K\r')
  
  if (output.trim()) {
    // 출력 결과를 색상과 함께 표시
    const lines = output.split('\n')
    lines.forEach((line, index) => {
      if (line.trim()) {
        // 성공적인 출력은 초록색으로
        terminal!.write(`\x1B[32m${line}\x1B[0m`)
      }
      if (index < lines.length - 1) {
        terminal!.write('\r\n')
      }
    })
  } else {
    // 빈 출력인 경우
    terminal!.write('\x1B[33m(출력 없음)\x1B[0m')
  }
  
  terminal.write('\r\n')
  showPrompt()
}

// 에러 표시
function showError(error: string) {
  if (!terminal) return
  
  terminal.write('\x1B[2K\r')
  terminal.write(`\x1B[1;31mError: \x1B[0m\x1B[31m${error}\x1B[0m\r\n`)
  showPrompt()
}

// 터미널 클리어
function clearTerminal() {
  if (!terminal) return
  terminal.clear()
  showPrompt()
}

// props 변경 감지
watch(() => props.isRunning, (isRunning) => {
  if (isRunning) {
    showRunning()
  }
})

watch(() => props.output, (output) => {
  if (output && !props.isRunning) {
    showOutput(output)
  }
})

// 컴포넌트 마운트
onMounted(() => {
  initTerminal()
})

// 컴포넌트 언마운트
onUnmounted(() => {
  if (terminal) {
    terminal.dispose()
    terminal = null
  }
})

// 외부에서 사용할 수 있는 메서드들
defineExpose({
  clearTerminal,
  showOutput,
  showError,
  showPrompt
})
</script>

<style scoped>
.terminal-container {
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.terminal {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}

/* xterm.js 스타일 오버라이드 */
:deep(.xterm) {
  height: 100%;
}

:deep(.xterm-viewport) {
  background-color: #1e1e1e !important;
}

:deep(.xterm-screen) {
  background-color: #1e1e1e !important;
}
</style>
