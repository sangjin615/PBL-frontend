<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">신고 처리</h1>
        <div class="text-sm text-gray-500">관리자 페이지</div>
      </div>
    </div>

    <div class="p-6">
      <!-- 목록 카드 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div class="text-sm text-gray-600">총 {{ totalCount }}건</div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 text-sm rounded-md border" @click="loadReports()">새로고침</button>
          </div>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="p-8 text-center text-gray-500">불러오는 중...</div>
        <div v-else>
          <table class="w-full">
            <thead class="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th class="px-4 py-3 text-left">ID</th>
                <th class="px-4 py-3 text-left">유형</th>
                <th class="px-4 py-3 text-left">대상 ID</th>
                <th class="px-4 py-3 text-left">작성자</th>
                <th class="px-4 py-3 text-left">내용</th>
                <th class="px-4 py-3 text-left">상태</th>
                <th class="px-4 py-3 text-left">접수일</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reports" :key="r.id" class="border-t text-sm">
                <td class="px-4 py-3">#{{ r.id }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded text-xs bg-gray-100">{{ mapType(r.type) }}</span>
                </td>
                <td class="px-4 py-3">{{ r.targetId }}</td>
                <td class="px-4 py-3">{{ getTargetAuthor(r) }}</td>
                <td class="px-4 py-3 truncate max-w-[380px]" :title="r.content">{{ r.content }}</td>
                <td class="px-4 py-3">
                  <span :class="statusClass(r.status)" class="px-2 py-1 rounded text-xs">{{ mapStatus(r.status) }}</span>
                </td>
                <td class="px-4 py-3">{{ formatDate(r.createdAt) }}</td>
                <td class="px-4 py-3 text-right">
                  <button class="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm" @click="openDetail(r)">자세히 보기</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 상세 모달 -->
    <div v-if="selected" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" @click="closeDetail">
      <div class="bg-white w-full max-w-2xl rounded-lg shadow-xl" @click.stop>
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">신고 상세 #{{ selected?.id }}</h2>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div class="p-6 space-y-4 text-sm">
          <div>
            <div class="text-gray-500">유형</div>
            <div class="font-medium">{{ mapType(selected!.type) }}</div>
          </div>
          <div>
            <div class="text-gray-500">대상 ID</div>
            <div class="font-medium">{{ selected!.targetId }}</div>
          </div>
          <div>
            <div class="text-gray-500">작성자</div>
            <div class="font-medium">{{ getTargetAuthor(selected!) }}</div>
          </div>
          <div>
            <div class="text-gray-500">신고 내용</div>
            <div class="font-medium whitespace-pre-wrap">{{ selected!.content }}</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div class="text-gray-500 mb-2">이용 정지</div>
              <div class="flex items-center gap-2">
                <select v-model="suspensionDays" class="border rounded-md px-2 py-1">
                  <option :value="0">정지 안 함</option>
                  <option :value="1">1일</option>
                  <option :value="3">3일</option>
                  <option :value="7">7일</option>
                  <option :value="14">14일</option>
                  <option :value="30">30일</option>
                </select>
                <button class="px-3 py-1.5 text-sm border rounded-md text-red-600" @click="applyPermanentBan">영구 정지</button>
              </div>
            </div>
            <div>
              <div class="text-gray-500 mb-2">콘텐츠 조치</div>
              <div class="flex flex-wrap items-center gap-2">
                <label class="inline-flex items-center gap-1 text-sm">
                  <input type="checkbox" v-model="hideContent" class="rounded" /> 숨기기(게시물/댓글/강의물/커리큘럼)
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t flex items-center justify-end gap-2">
          <button class="px-3 py-1.5 text-sm border rounded-md bg-green-600 text-white hover:bg-green-700" @click="markResolved">처리 완료</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reportApiService } from '@/services/reportApi'
import type { ReportResponse } from '@/types/report'

const reports = ref<ReportResponse[]>([])
const totalCount = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const selected = ref<ReportResponse | null>(null)
const suspensionDays = ref<number>(0)
const hideContent = ref<boolean>(false)
const permanentBan = ref<boolean>(false)
// 이전 처리 내역 유지 불필요 요구에 따라 상태 제거

function mapType(t: ReportResponse['type']) {
  const map: Record<ReportResponse['type'], string> = {
    curriculum: '커리큘럼',
    lecture: '강의',
    problem: '문제',
    post: '게시글',
    comment: '댓글'
  }
  return map[t]
}

function mapStatus(s: ReportResponse['status']) {
  return s === 'pending' ? '대기' : s === 'processing' ? '처리 중' : s === 'resolved' ? '완료' : '반려'
}

function statusClass(s: ReportResponse['status']) {
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800'
  if (s === 'processing') return 'bg-blue-100 text-blue-800'
  if (s === 'resolved') return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0')
  const mm = String(d.getMinutes()).padStart(2,'0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

async function loadReports() {
  loading.value = true
  try {
    const res = await reportApiService.getReports(page.value, pageSize.value)
    reports.value = res.reports
    totalCount.value = res.totalCount
  } finally {
    loading.value = false
  }
}

function openDetail(r: ReportResponse) {
  selected.value = r
  suspensionDays.value = 0
  hideContent.value = false
  permanentBan.value = false
}
function closeDetail() { selected.value = null }

async function markResolved() {
  if (!selected.value) return
  // 저장(모킹): localStorage에 조치 내역 추가
  const actionsKey = 'reportActions'
  const existing = JSON.parse(localStorage.getItem(actionsKey) || '[]')
  existing.push({
    reportId: selected.value.id,
    type: selected.value.type,
    targetId: selected.value.targetId,
    suspensionDays: permanentBan.value ? 'permanent' : suspensionDays.value,
    hideContent: hideContent.value,
    processedAt: new Date().toISOString()
  })
  localStorage.setItem(actionsKey, JSON.stringify(existing))

  selected.value.status = 'resolved'
  alert('정상 처리되었습니다.')
  closeDetail()
}

async function applyPermanentBan() {
  if (!selected.value) return
  permanentBan.value = true
  alert('영구 정지 설정됨(저장은 처리 완료 시 반영)')
}

onMounted(loadReports)

// 대상 작성자(모킹): 실제 연동 시 API 통해 조회
function getTargetAuthor(r: ReportResponse): string {
  const names = ['김준성', '임상진', '박민수', '이지은', '정수진', '송지현', '윤서준', '한미래', '오지훈', '배준호']
  return names[r.targetId % names.length]
}
</script>


