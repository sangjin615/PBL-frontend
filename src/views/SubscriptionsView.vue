<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">구독</h1>
          <p class="text-sm text-gray-600 mt-1">구독 중인 크리에이터를 한 눈에 확인하세요</p>
        </div>
        <div class="flex items-center gap-2">
          <FormInput
            v-model="searchQuery"
            placeholder="크리에이터 검색..."
            class="w-64"
          />
          <FormSelect
            v-model="sortBy"
            :options="sortOptions"
          />
        </div>
      </div>
    </div>

    <!-- 콘텐츠 -->
    <div class="px-8 py-8">
      <div v-if="filteredCreators.length === 0" class="text-center py-24 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h10a4 4 0 100-8H7a4 4 0 00-4 4z" />
        </svg>
        <p>아직 구독 중인 크리에이터가 없습니다.</p>
        <p class="text-sm mt-1">강의 목록이나 대시보드에서 마음에 드는 크리에이터를 구독해보세요.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="creator in filteredCreators"
          :key="creator.id"
          class="bg-white rounded-xl border hover:shadow-md transition-shadow p-5 flex flex-col"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold"
              :style="{ backgroundColor: creator.avatarColor }"
            >
              {{ creator.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 truncate">{{ creator.name }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">구독자 {{ formatSubs(creator.subscribers) }}</span>
              </div>
              <p class="text-sm text-gray-500 truncate">{{ creator.handle }}</p>
            </div>
          </div>

          <p class="text-sm text-gray-600 mt-4 line-clamp-2">{{ creator.description }}</p>

          <div class="mt-5 flex items-center gap-2">
            <Button
              @click="viewCreator(creator)"
              variant="secondary"
              size="sm"
            >
              프로필 보기
            </Button>
            <Button
              @click="toggleSubscribe(creator.id)"
              variant="ghost"
              size="sm"
            >
              구독 해지
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { Button, FormInput, FormSelect } from '@/components/common'

const router = useRouter()
const ui = useUiStore()

interface Creator {
  id: number
  name: string
  handle: string
  avatarColor: string
  subscribers: number
  description: string
  subscribedAt: string
}

const creators = ref<Creator[]>([])
const searchQuery = ref('')
const sortBy = ref<'recent' | 'name' | 'subs'>('recent')

const sortOptions = [
  { value: 'recent', label: '최근 구독순' },
  { value: 'name', label: '이름순' },
  { value: 'subs', label: '구독자 많은순' }
]

function loadSubscriptions(): Creator[] {
  try {
    const raw = localStorage.getItem('subscriptions')
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveSubscriptions(list: Creator[]) {
  localStorage.setItem('subscriptions', JSON.stringify(list))
}

function seedIfEmpty() {
  if (creators.value.length > 0) return
  const seed: Creator[] = [
    { id: 101, name: '코드팩토리', handle: '@codefactory', avatarColor: '#4F46E5', subscribers: 124000, description: '실무 중심의 프로그래밍 강좌를 제공합니다.', subscribedAt: new Date().toISOString() },
    { id: 102, name: '데이터스미스', handle: '@datasmith', avatarColor: '#059669', subscribers: 88000, description: '데이터 분석과 머신러닝 입문부터 고급까지', subscribedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 103, name: '프론트엔드캠프', handle: '@fecamp', avatarColor: '#F59E0B', subscribers: 56000, description: '모던 프론트엔드 개발 실전 프로젝트', subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 104, name: '알고리즘랩', handle: '@algolab', avatarColor: '#DC2626', subscribers: 42000, description: '자료구조/알고리즘 문제풀이와 해설', subscribedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 105, name: '백엔드스쿨', handle: '@backschool', avatarColor: '#2563EB', subscribers: 76000, description: '스프링/자바/DB 성능 최적화 강좌', subscribedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 106, name: '클라우드연구소', handle: '@cloudlab', avatarColor: '#0EA5E9', subscribers: 91000, description: 'AWS, 쿠버네티스, DevOps 자동화', subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 107, name: 'iOS 마이스터', handle: '@iosmeister', avatarColor: '#9333EA', subscribers: 37000, description: 'SwiftUI, Combine 실전 앱 빌드', subscribedAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 108, name: '안드로이드노트', handle: '@andnote', avatarColor: '#10B981', subscribers: 64000, description: 'Kotlin/Compose로 만드는 안드로이드', subscribedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 109, name: '보안연구회', handle: '@secstudy', avatarColor: '#1F2937', subscribers: 28000, description: '웹해킹/디지털포렌식/보안개발', subscribedAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 110, name: '게임엔진랩', handle: '@gamelab', avatarColor: '#EF4444', subscribers: 52000, description: 'Unity/Unreal 엔진으로 만드는 게임', subscribedAt: new Date(Date.now() - 86400000 * 9).toISOString() },
    { id: 111, name: '수학코딩', handle: '@mathcode', avatarColor: '#14B8A6', subscribers: 33000, description: '수학으로 이해하는 알고리즘과 AI', subscribedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 112, name: '디자인시스템즈', handle: '@designsys', avatarColor: '#FB7185', subscribers: 47000, description: '디자인 시스템과 컴포넌트 설계', subscribedAt: new Date(Date.now() - 86400000 * 11).toISOString() },
    { id: 113, name: '데브툴즈', handle: '@devtools', avatarColor: '#CA8A04', subscribers: 41000, description: '개발 생산성을 올리는 도구와 워크플로우', subscribedAt: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 114, name: 'ML Ops 팀', handle: '@mlops', avatarColor: '#22C55E', subscribers: 69000, description: '실전 ML 파이프라인과 운영', subscribedAt: new Date(Date.now() - 86400000 * 13).toISOString() },
    { id: 115, name: '파이썬러버', handle: '@pylove', avatarColor: '#3B82F6', subscribers: 102000, description: '파이썬 실전 과제와 프로젝트', subscribedAt: new Date(Date.now() - 86400000 * 14).toISOString() },
    { id: 116, name: 'JS 아카데미', handle: '@jsacademy', avatarColor: '#F97316', subscribers: 97000, description: 'JavaScript/TypeScript 심화 과정', subscribedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
    { id: 117, name: 'Rust 스쿨', handle: '@rustschool', avatarColor: '#92400E', subscribers: 26000, description: 'Rust로 배우는 시스템 프로그래밍', subscribedAt: new Date(Date.now() - 86400000 * 16).toISOString() },
    { id: 118, name: 'Go 언어연구소', handle: '@golab', avatarColor: '#0EA5E9', subscribers: 39000, description: 'Go로 만드는 클라우드 네이티브', subscribedAt: new Date(Date.now() - 86400000 * 17).toISOString() },
    { id: 119, name: 'DB 마스터', handle: '@dbmaster', avatarColor: '#6366F1', subscribers: 58000, description: 'SQL 튜닝과 데이터 모델링', subscribedAt: new Date(Date.now() - 86400000 * 18).toISOString() },
    { id: 120, name: '테스트공방', handle: '@testcraft', avatarColor: '#16A34A', subscribers: 22000, description: 'TDD/테스트 자동화/품질 관리', subscribedAt: new Date(Date.now() - 86400000 * 19).toISOString() },
    { id: 121, name: '리더십랩', handle: '@leaderlab', avatarColor: '#EC4899', subscribers: 12000, description: '개발 리더십과 협업 문화 만들기', subscribedAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  ]
  creators.value = seed
  saveSubscriptions(seed)
}

const filteredCreators = computed(() => {
  // 헤더 서치바 검색어와 로컬 검색어 통합
  const headerQuery = ui.searchQuery?.trim().toLowerCase() || '';
  const localQuery = searchQuery.value.trim().toLowerCase();
  const q = headerQuery || localQuery;
  
  let list = creators.value.filter(c => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))

  switch (sortBy.value) {
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'subs':
      list = [...list].sort((a, b) => b.subscribers - a.subscribers)
      break
    case 'recent':
    default:
      list = [...list].sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
  }
  return list
})

function toggleSubscribe(id: number) {
  const creator = creators.value.find(c => c.id === id)
  if (!creator) return

  // 구독 해지 확인 다이얼로그
  if (confirm(`"${creator.name}"의 구독을 해지하시겠습니까?\n\n구독을 해지하면 해당 크리에이터의 새로운 콘텐츠 알림을 받을 수 없습니다.`)) {
    creators.value = creators.value.filter(c => c.id !== id)
    saveSubscriptions(creators.value)
    
    // 성공 메시지 (선택사항)
    alert(`${creator.name}의 구독이 해지되었습니다.`)
  }
}

function viewCreator(creator: Creator) {
  router.push({ name: 'creator-profile', params: { id: creator.id.toString() } })
}

function formatSubs(n: number) {
  if (n >= 10000) return `${Math.round(n / 100) / 100}만명`
  if (n >= 1000) return `${Math.round(n / 10) / 100}천명`
  return `${n}명`
}

// 헤더 서치바 검색어 변경 감지
watch(() => ui.searchQuery, (newQuery) => {
  // 헤더에서 검색하면 로컬 검색어와 동기화
  if (newQuery !== searchQuery.value) {
    searchQuery.value = newQuery || '';
  }
});

// 로컬 검색어 변경 시 헤더와 동기화 (사용자가 직접 입력한 경우)
watch(searchQuery, (newQuery) => {
  if (newQuery !== ui.searchQuery) {
    ui.setSearchQuery(newQuery);
  }
});

onMounted(() => {
  creators.value = loadSubscriptions()
  seedIfEmpty()
})
</script>
