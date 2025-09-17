import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/qa',
    name: 'qa',
    component: () => import('../views/QaView.vue'),
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('../views/SubscriptionsView.vue'),
  },
  {
    path: '/course/:id',
    name: 'course-overview',
    component: () => import('../views/CourseOverviewView.vue'),
  },
  {
    path: '/curriculum/:id',
    name: 'curriculum-overview',
    component: () => import('../views/CurriculumOverviewView.vue'),
  },
  {
    path: '/curriculum/:id/learn',
    name: 'curriculum-detail',
    component: () => import('../views/CurriculumDetailView.vue'),
  },
  {
    path: '/learn/:lessonId',
    name: 'learning',
    component: () => import('../views/LearningView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
