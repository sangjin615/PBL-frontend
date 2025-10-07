<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl border p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">로그인</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input v-model="userId" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring" placeholder="아이디 입력" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring" placeholder="비밀번호 입력" />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button type="submit" class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">로그인</button>
      </form>

      <div class="mt-6 text-sm text-gray-600 text-center">
        아직 회원이 아니신가요?
        <router-link to="/signup" class="text-blue-600 hover:underline">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userId = ref('')
const password = ref('')
const error = ref('')

function loadUsers(): Array<{ nickname: string; userId: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]')
  } catch {
    return []
  }
}

function handleLogin() {
  error.value = ''
  if (!userId.value.trim()) {
    error.value = '아이디를 입력하세요.'
    return
  }
  if (!password.value.trim()) {
    error.value = '비밀번호를 입력하세요.'
    return
  }
  const users = loadUsers()
  const found = users.find(u => u.userId === userId.value.trim() && u.password === password.value)
  if (!found) {
    error.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
    return
  }

  localStorage.setItem('currentUser', JSON.stringify({ userId: found.userId, nickname: found.nickname }))
  alert('로그인되었습니다.')
  // stay on page per request (no redirect). Could navigate elsewhere if needed.
}
</script>
