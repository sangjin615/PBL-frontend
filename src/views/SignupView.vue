<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl border p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">회원가입</h1>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
          <input v-model="nickname" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring" placeholder="닉네임 입력" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input v-model="userId" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring" placeholder="아이디 입력" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring" placeholder="비밀번호 입력" />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">가입하기</button>
      </form>

      <div class="mt-6 text-sm text-gray-600 text-center">
        이미 계정이 있으신가요?
        <router-link to="/login" class="text-blue-600 hover:underline">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nickname = ref('')
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

function saveUsers(users: Array<{ nickname: string; userId: string; password: string }>) {
  localStorage.setItem('users', JSON.stringify(users))
}

function validate(): string | null {
  if (!nickname.value.trim()) return '닉네임을 입력하세요.'
  if (!userId.value.trim()) return '아이디를 입력하세요.'
  if (!password.value.trim()) return '비밀번호를 입력하세요.'
  if (password.value.length < 6) return '비밀번호는 6자 이상이어야 합니다.'
  const users = loadUsers()
  if (users.some(u => u.userId === userId.value.trim())) return '이미 존재하는 아이디입니다.'
  return null
}

function handleSignup() {
  const validationError = validate()
  if (validationError) {
    error.value = validationError
    return
  }
  const users = loadUsers()
  users.push({ nickname: nickname.value.trim(), userId: userId.value.trim(), password: password.value })
  saveUsers(users)
  alert('회원가입이 완료되었습니다. 로그인 해주세요.')
  router.push({ name: 'login' })
}
</script>

