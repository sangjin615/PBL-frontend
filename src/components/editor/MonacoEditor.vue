<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

interface Props {
  modelValue: string
  language?: string
  theme?: string
  options?: any
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  theme: 'vs-dark',
  options: () => ({})
})

const emit = defineEmits<Emits>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 에디터 생성
async function createEditor() {
  if (!editorContainer.value) return

  // Monaco Editor 옵션
  const defaultOptions = {
    theme: props.theme,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    folding: true,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line' as const,
    ...props.options
  }

  // 에디터 생성
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    ...defaultOptions
  })

  // 값 변경 이벤트 리스너
  editor.onDidChangeModelContent(() => {
    if (editor) {
      const value = editor.getValue()
      emit('update:modelValue', value)
    }
  })
}

// 에디터 업데이트
function updateEditor() {
  if (!editor) return

  const currentValue = editor.getValue()
  if (currentValue !== props.modelValue) {
    editor.setValue(props.modelValue)
  }

  // 언어 변경
  const currentLanguage = editor.getModel()?.getLanguageId()
  if (currentLanguage !== props.language) {
    monaco.editor.setModelLanguage(editor.getModel()!, props.language)
  }

  // 테마 변경
  monaco.editor.setTheme(props.theme)
}

// 에디터 정리
function disposeEditor() {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

// props 변경 감지
watch(() => props.modelValue, () => {
  updateEditor()
})

watch(() => props.language, () => {
  updateEditor()
})

watch(() => props.theme, () => {
  updateEditor()
})

// 컴포넌트 마운트
onMounted(async () => {
  await nextTick()
  createEditor()
})

// 컴포넌트 언마운트
onUnmounted(() => {
  disposeEditor()
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
