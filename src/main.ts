import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 개발 환경에서 콘솔 디버깅 헬퍼 함수 제공
if (import.meta.env.DEV) {
  window.adminDebug = {
    makeAdmin: () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        user.role = 'admin';
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ 관리자 권한이 부여되었습니다. 페이지를 새로고침하세요.');
        return true;
      }
      console.error('❌ 로그인된 사용자 정보를 찾을 수 없습니다.');
      return false;
    },
    makeUser: () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        user.role = 'user';
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ 일반 사용자 권한으로 변경되었습니다. 페이지를 새로고침하세요.');
        return true;
      }
      console.error('❌ 로그인된 사용자 정보를 찾을 수 없습니다.');
      return false;
    },
    getCurrentUser: () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      console.log('현재 사용자 정보:', user);
      return user;
    }
  };
  console.log('🛠️ 개발 모드: 브라우저 콘솔에서 window.adminDebug를 사용할 수 있습니다.');
  console.log('   - window.adminDebug.makeAdmin() - 관리자 권한 부여');
  console.log('   - window.adminDebug.makeUser() - 일반 사용자로 변경');
  console.log('   - window.adminDebug.getCurrentUser() - 현재 사용자 정보 확인');
}

app.mount('#app');
