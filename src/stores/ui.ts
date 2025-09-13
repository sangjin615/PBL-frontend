import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: true as boolean,
    searchQuery: '' as string,
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setSearchQuery(q: string) {
      this.searchQuery = q;
    },
  },
});
