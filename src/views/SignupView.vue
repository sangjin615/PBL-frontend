<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl border p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">회원가입</h1>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <FormInput
          v-model="nickname"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          :error="nicknameError"
          required
        />

        <FormInput
          v-model="userId"
          label="아이디"
          placeholder="아이디를 입력하세요"
          :error="userIdError"
          required
        />

        <FormInput
          v-model="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          :error="passwordError"
          required
        />

        <ErrorMessage v-if="error" :message="error" />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoading"
          loading-text="가입 중..."
          full-width
        >
          가입하기
        </Button>
      </form>

      <div class="mt-6 text-sm text-gray-600 text-center">
        이미 계정이 있으신가요?
        <router-link to="/login" class="text-blue-600 hover:underline">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApiService } from '@/services/userApi'
import { FormInput, ErrorMessage, Button } from '@/components/common'
import { validateUsername, validateLoginId, validatePassword, handleApiError, MESSAGES } from '@/utils'

const router = useRouter()

const nickname = ref('')
const userId = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// 유효성 검사
const nicknameError = computed(() => validateUsername(nickname.value))
const userIdError = computed(() => validateLoginId(userId.value))
const passwordError = computed(() => validatePassword(password.value))

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

async function handleSignup() {
  error.value = ''
  
  // 유효성 검사
  const nicknameValidation = validateUsername(nickname.value)
  const userIdValidation = validateLoginId(userId.value)
  const passwordValidation = validatePassword(password.value)
  
  if (nicknameValidation || userIdValidation || passwordValidation) {
    return
  }

  isLoading.value = true
  
  try {
    const response = await userApiService.signUp({
      username: nickname.value.trim(),
      loginId: userId.value.trim(),
      password: password.value
    })
    
    alert(MESSAGES.SUCCESS.SIGNUP)
    router.push({ name: 'login' })
  } catch (err: any) {
    console.error('회원가입 실패:', err)
    error.value = handleApiError(err)
  } finally {
    isLoading.value = false
  }
}
</script>

