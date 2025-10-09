<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold">AI 활용하기</h1>
        <p class="text-sm text-gray-600">AI와 대화하며 강의/커리큘럼을 생성해보세요</p>
      </div>
    </div>

    <!-- 본문 -->
    <div class="max-w-5xl mx-auto p-6">
      <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div class="h-[70vh] p-4 overflow-y-auto space-y-4" ref="messagesContainer">
          <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div :class="m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'" class="px-3 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap">
              {{ m.content }}
            </div>
          </div>
        </div>
        <div class="border-t p-3 flex items-center gap-2">
          <input v-model="input" @keydown.enter.prevent="send" type="text" class="flex-1 border rounded-lg px-3 py-2" placeholder="예: 파이썬 입문 커리큘럼 만들어줘" />
          <button @click="send" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">보내기</button>
        </div>
      </div>
      <div class="mt-4 text-sm text-gray-500">
        생성된 결과는 임시로 표시됩니다. 실제 발행은 우측 상단 '만들기'에서 진행하세요.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요? 예: "초급 파이썬 커리큘럼 만들어줘"' }
])
const input = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

async function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''

  // 데모: 간이 응답 생성 (실제 연동 시 백엔드/AI API 호출)
  const draft = generateDraft(text)
  messages.value.push({ role: 'assistant', content: draft })

  await nextTick()
  messagesContainer.value?.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: 'smooth' })
}

function generateDraft(prompt: string): string {
  // 간단한 규칙 기반 데모 응답
  if (/커리큘럼|커리큘럼 만들어/.test(prompt)) {
    return `커리큘럼 초안

1. 오리엔테이션 (15분)
- 과정 소개, 개발 환경 준비

2. 기초 문법 (60분)
- 변수, 자료형, 연산자, 입출력

3. 제어문 (60분)
- 조건문, 반복문, 실습 과제

4. 함수와 모듈 (60분)
- 함수 정의/호출, 표준 라이브러리

5. 미니 프로젝트 (90분)
- 간단한 CLI 앱 구현
`
  }
  if (/강의|레슨|강좌/.test(prompt)) {
    return `강의 초안

제목: 파이썬으로 배우는 알고리즘 기초
목표: 정렬/탐색 기본기를 예제로 익히기
섹션:
- 버블 정렬 이론 (영상 10분)
- 버블 정렬 실습 (문제 2개)
- 선택 정렬 이론 (영상 10분)
- 선택 정렬 실습 (문제 2개)
과제: 정렬 알고리즘 비교 리포트`
  }
  return '요청을 이해했어요. 더 구체적인 형식(커리큘럼/강의)을 알려주시면 초안을 만들어 드릴게요.'
}
</script>

<style scoped>
</style>


