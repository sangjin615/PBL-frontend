<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">신고 처리</h1>
        <div class="text-sm text-gray-500">관리자 페이지</div>
      </div>
    </div>

    <div class="p-6">
      <!-- 필터 영역 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">상태:</label>
            <select v-model="statusFilter" @change="currentPage = 0; loadReports()" class="px-3 py-1.5 text-sm border rounded-md">
              <option value="">전체</option>
              <option v-for="(label, status) in REPORT_STATUS_LABELS" :key="status" :value="status">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">유형:</label>
            <select v-model="targetTypeFilter" @change="currentPage = 0; loadReports()" class="px-3 py-1.5 text-sm border rounded-md">
              <option value="">전체</option>
              <option v-for="(label, type) in REPORT_TARGET_TYPE_LABELS" :key="type" :value="type">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 목록 카드 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div class="text-sm text-gray-600">총 {{ totalElements }}건</div>
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
                  <span class="px-2 py-1 rounded text-xs bg-gray-100">{{ mapTargetType(r.targetType) }}</span>
                </td>
                <td class="px-4 py-3">{{ r.targetId }}</td>
                <td class="px-4 py-3">{{ getTargetAuthor(r) }}</td>
                <td class="px-4 py-3 truncate max-w-[380px]" :title="r.content">{{ r.content }}</td>
                <td class="px-4 py-3">
                  <span :class="statusClass(r.status)" class="px-2 py-1 rounded text-xs">{{ mapStatus(r.status) }}</span>
                </td>
                <td class="px-4 py-3">{{ formatDateTime(r.createdAt) }}</td>
                <td class="px-4 py-3 text-right">
                  <button class="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm" @click="openDetail(r)">자세히 보기</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
          <div v-if="totalPages > 1" class="p-4 border-t bg-gray-50 flex items-center justify-center gap-2">
            <button
              @click="currentPage = 0; loadReports()"
              :disabled="currentPage === 0"
              class="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              처음
            </button>
            <button
              @click="currentPage--; loadReports()"
              :disabled="currentPage === 0"
              class="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span class="text-sm text-gray-600">{{ currentPage + 1 }} / {{ totalPages }}</span>
            <button
              @click="currentPage++; loadReports()"
              :disabled="currentPage >= totalPages - 1"
              class="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
            <button
              @click="currentPage = totalPages - 1; loadReports()"
              :disabled="currentPage >= totalPages - 1"
              class="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              마지막
            </button>
          </div>
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
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-gray-500">유형</div>
              <div class="font-medium">{{ mapTargetType(selected!.targetType) }}</div>
            </div>
            <div>
              <div class="text-gray-500">상태</div>
              <div class="font-medium">
                <span :class="statusClass(selected!.status)" class="px-2 py-1 rounded text-xs">
                  {{ mapStatus(selected!.status) }}
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-gray-500">대상 ID</div>
              <div class="font-medium">{{ selected!.targetId }}</div>
            </div>
            <div>
              <div class="text-gray-500">대상 콘텐츠 작성자</div>
              <div class="font-medium">{{ getTargetAuthor(selected!) }}</div>
            </div>
          </div>
          <div>
            <div class="text-gray-500">신고 사유</div>
            <div class="font-medium">{{ REPORT_REASON_LABELS[selected!.reason] }}</div>
          </div>
          <div>
            <div class="text-gray-500">신고자</div>
            <div class="font-medium">{{ selected!.reporterUsername }} (ID: {{ selected!.reporterId }})</div>
          </div>
          <div>
            <div class="text-gray-500">신고 상세 내용</div>
            <div class="font-medium whitespace-pre-wrap">{{ selected!.content || '(상세 내용 없음)' }}</div>
          </div>
          <div>
            <div class="text-gray-500">접수일</div>
            <div class="font-medium">{{ formatDateTime(selected!.createdAt) }}</div>
          </div>

          <!-- 처리 내역 (이미 처리된 경우) -->
          <div v-if="selected!.processedAt" class="border-t pt-4">
            <div class="text-sm font-medium text-gray-700 mb-2">처리 내역</div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-gray-500">처리자</div>
                <div class="font-medium">{{ selected!.processorUsername || '알 수 없음' }} (ID: {{ selected!.processorId }})</div>
              </div>
              <div>
                <div class="text-gray-500">처리일시</div>
                <div class="font-medium">{{ formatDateTime(selected!.processedAt) }}</div>
              </div>
            </div>
            <div v-if="selected!.processAction" class="mt-2">
              <div class="text-gray-500">처리 조치</div>
              <div class="font-medium">{{ selected!.processAction }}</div>
            </div>
            <div v-if="selected!.processNote" class="mt-2">
              <div class="text-gray-500">처리 메모</div>
              <div class="font-medium whitespace-pre-wrap">{{ selected!.processNote }}</div>
            </div>
          </div>

          <!-- 관리자 조치 (PENDING 상태일 때만 표시) -->
          <div v-if="selected!.status === 'PENDING' || selected!.status === 'PROCESSING'" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
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
                <button class="px-3 py-1.5 text-sm border rounded-md text-red-600 hover:bg-red-50" @click="applyPermanentBan">영구 정지</button>
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
        <div class="p-4 border-t flex items-center justify-between gap-2">
          <button class="px-3 py-1.5 text-sm border rounded-md text-gray-600 hover:bg-gray-100" @click="closeDetail">닫기</button>
          <div v-if="selected!.status === 'PENDING' || selected!.status === 'PROCESSING'" class="flex gap-2">
            <button class="px-3 py-1.5 text-sm border rounded-md bg-gray-600 text-white hover:bg-gray-700" @click="markRejected">반려</button>
            <button class="px-3 py-1.5 text-sm border rounded-md bg-green-600 text-white hover:bg-green-700" @click="markResolved">처리 완료</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reportApiService } from '@/services/reportApi'
import { formatDateTime } from '@/services/utils'
import type {
  ReportResponse,
  ReportListParams,
  ProcessReportRequest,
  ReportTargetType,
  ReportStatus,
  ProcessAction,
  ReportReason
} from '@/types/report'
import {
  REPORT_TARGET_TYPE_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_REASON_LABELS
} from '@/types/report'

const reports = ref<ReportResponse[]>([])
const loading = ref(false)

// 필터 상태
const statusFilter = ref<ReportStatus | ''>('')
const targetTypeFilter = ref<ReportTargetType | ''>('')

// 페이지네이션 (0-based index)
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

// 모달 상태
const selected = ref<ReportResponse | null>(null)
const suspensionDays = ref<number>(0)
const hideContent = ref<boolean>(false)
const permanentBan = ref<boolean>(false)

// 타입 매핑 함수
function mapTargetType(t: ReportTargetType): string {
  return REPORT_TARGET_TYPE_LABELS[t]
}

function mapStatus(s: ReportStatus): string {
  return REPORT_STATUS_LABELS[s]
}

function statusClass(s: ReportStatus): string {
  const map: Record<ReportStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-gray-100 text-gray-800'
  }
  return map[s]
}

async function loadReports() {
  loading.value = true
  try {
    const params: ReportListParams = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    if (targetTypeFilter.value) {
      params.targetType = targetTypeFilter.value
    }

    const res = await reportApiService.getReports(params)

    // Spring Pageable 응답 구조
    reports.value = res.content
    totalElements.value = res.totalElements
    totalPages.value = res.totalPages
    currentPage.value = res.pageable.pageNumber
  } catch (error) {
    console.error('신고 목록 조회 실패:', error)
    window.alert('신고 목록을 불러오는데 실패했습니다.')
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

  try {
    // ProcessAction 결정
    let processAction: ProcessAction = 'NO_ACTION'
    let processNote = ''

    if (permanentBan.value) {
      processAction = 'DELETE_ACCOUNT'
      processNote = '영구 정지 조치'
    } else if (suspensionDays.value > 0) {
      processAction = 'MUTE_USER'
      processNote = `${suspensionDays.value}일 이용 정지`
    }

    if (hideContent.value) {
      processNote += (processNote ? ' / ' : '') + '콘텐츠 숨김'
      if (processAction === 'NO_ACTION') {
        processAction = 'DELETE_CONTENT'
      }
    }

    const request: ProcessReportRequest = {
      status: 'RESOLVED',
      processAction,
      processNote: processNote || undefined
    }

    await reportApiService.processReport(selected.value.id, request)

    window.alert('정상 처리되었습니다.')
    closeDetail()
    await loadReports() // 목록 새로고침
  } catch (error) {
    console.error('신고 처리 실패:', error)
    window.alert('신고 처리에 실패했습니다.')
  }
}

async function markRejected() {
  if (!selected.value) return

  if (!window.confirm('신고를 반려하시겠습니까?')) return

  try {
    const request: ProcessReportRequest = {
      status: 'REJECTED',
      processNote: '관리자 검토 결과 조치 불필요'
    }

    await reportApiService.processReport(selected.value.id, request)

    window.alert('신고가 반려되었습니다.')
    closeDetail()
    await loadReports()
  } catch (error) {
    console.error('신고 반려 실패:', error)
    window.alert('신고 반려에 실패했습니다.')
  }
}

async function applyPermanentBan() {
  if (!selected.value) return
  permanentBan.value = true
  window.alert('영구 정지 설정됨(저장은 처리 완료 시 반영)')
}

onMounted(loadReports)

// 대상 작성자(모킹): 실제 연동 시 API 통해 조회
function getTargetAuthor(r: ReportResponse): string {
  const names = ['김준성', '임상진', '박민수', '이지은', '정수진', '송지현', '윤서준', '한미래', '오지훈', '배준호']
  return names[r.targetId % names.length]
}
</script>


