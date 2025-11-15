<template>
  <div class="problem-editor-container">
    <h3 class="text-lg font-semibold mb-4">코딩 문제 설정</h3>

    <div class="space-y-6">
      <!-- 시간/메모리 제한 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">시간 제한 (초) *</label>
          <input
            v-model.number="localData.timeLimit"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">메모리 제한 (MB) *</label>
          <input
            v-model.number="localData.memoryLimit"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="256"
          />
        </div>
      </div>

      <!-- 문제 설명 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <MdEditor
            v-model="localData.problemDescription"
            :theme="theme"
            :toolbars="toolbars"
            :height="300"
            placeholder="문제를 자세히 설명해주세요..."
          />
        </div>
      </div>

      <!-- 입력 설명 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">입력 설명</label>
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <MdEditor
            v-model="localData.inputDescription"
            :theme="theme"
            :toolbars="toolbars"
            :height="200"
            placeholder="입력 형식을 설명해주세요..."
          />
        </div>
      </div>

      <!-- 출력 설명 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">출력 설명</label>
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <MdEditor
            v-model="localData.outputDescription"
            :theme="theme"
            :toolbars="toolbars"
            :height="200"
            placeholder="출력 형식을 설명해주세요..."
          />
        </div>
      </div>

      <!-- 테스트 케이스 -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700">테스트 케이스 *</label>
          <button
            @click="addTestCase"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            + 테스트 케이스 추가
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(testCase, index) in localData.testCases"
            :key="index"
            class="border border-gray-300 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">테스트 케이스 {{ index + 1 }}</h4>
              <button
                @click="removeTestCase(index)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                삭제
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">입력</label>
                <textarea
                  v-model="testCase.input"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="입력 데이터"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">출력</label>
                <textarea
                  v-model="testCase.output"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="예상 출력"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { MdEditor, type Themes, type ToolbarNames } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'

interface TestCase {
  input: string
  output: string
}

interface ProblemData {
  timeLimit: number
  memoryLimit: number
  problemDescription: string
  inputDescription: string
  outputDescription: string
  testCases: TestCase[]
}

interface Props {
  modelValue: ProblemData
  theme?: Themes
}

interface Emits {
  (e: 'update:modelValue', value: ProblemData): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})

const emit = defineEmits<Emits>()

const localData = reactive<ProblemData>({ ...props.modelValue })

// 양방향 바인딩
watch(localData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  Object.assign(localData, newValue)
}, { deep: true })

// 툴바 설정
const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', 'strikeThrough',
  'quote', 'unorderedList', 'orderedList', 'codeRow', 'code',
  'link', 'table', 'revoke', 'next', 'preview'
]

// 테스트 케이스 관리
function addTestCase() {
  localData.testCases.push({
    input: '',
    output: ''
  })
}

function removeTestCase(index: number) {
  if (localData.testCases.length > 1) {
    localData.testCases.splice(index, 1)
  } else {
    alert('최소 1개의 테스트 케이스가 필요합니다.')
  }
}
</script>

<style scoped>
.problem-editor-container {
  width: 100%;
}
</style>
