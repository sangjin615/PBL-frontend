/**
 * 언어 관련 API 서비스
 * Judge0 API와 통신하는 언어 관련 클라이언트
 */

import type { Language, LanguageResponse, MonacoLanguage } from '@/types/language';
import { apiConfig } from '../config/api';

class LanguageApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.judge0.baseUrl;
  }

  /**
   * HTTP 요청을 위한 공통 fetch 래퍼
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`언어 API 요청 실패 [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * 지원하는 모든 언어 목록 조회
   * GET /languages
   */
  async getLanguages(): Promise<Language[]> {
    try {
      const response = await this.request<Language[]>('/languages');
      return response || [];
    } catch (error) {
      console.error('언어 목록 조회 실패:', error);
      // 기본 언어 목록 반환
      return this.getDefaultLanguages();
    }
  }

  /**
   * 특정 언어 정보 조회
   * GET /languages/{id}
   */
  async getLanguage(id: number): Promise<Language | null> {
    try {
      return await this.request<Language>(`/languages/${id}`);
    } catch (error) {
      console.error(`언어 ${id} 조회 실패:`, error);
      return null;
    }
  }

  /**
   * 언어 ID를 Monaco Editor 언어로 변환
   */
  getMonacoLanguage(languageId: number): MonacoLanguage {
    const languageMap: Record<number, MonacoLanguage> = {
      // Python
      70: 'python', 
      71: 'python', 
      
      // JavaScript/TypeScript
      63: 'javascript', 
      74: 'typescript',
      
      // Java
      62: 'java', 
      
      // C
      48: 'c', 
      49: 'c', 
      50: 'c', 
      75: 'c',
      
      // C++
      52: 'cpp', 
      53: 'cpp', 
      54: 'cpp', 
      76: 'cpp', 
      
      // C#
      51: 'csharp',
      
      // Go
      60: 'go', 
      
      // Rust
      73: 'rust', 
      
      // Ruby
      72: 'ruby', 
      
      // PHP
      68: 'php', 
      
      // Lua
      64: 'lua',
      
      // Perl
      85: 'perl', 
      
      // Shell
      46: 'shell', 
      
      // Haskell
      61: 'haskell', 
      
      // Lisp
      55: 'lisp', 
      
      // OCaml
      65: 'ocaml',
      
      // Prolog
      69: 'prolog', 
      
      // MATLAB
      66: 'matlab', 
      
      // R
      80: 'r', 
      
      // Fortran
      59: 'fortran', 
      
      // Pascal
      67: 'pascal',
      
      // D
      56: 'd', 
      
      // Erlang
      58: 'erlang', 
      
      // Elixir
      57: 'elixir', 
      
      // Groovy
      88: 'groovy', 
      
      // Clojure
      86: 'clojure',
      
      // Scala
      81: 'scala', 
      
      // Kotlin
      78: 'kotlin', 
      
      // Objective-C
      79: 'objective-c', 
      
      // Swift
      83: 'swift', 
      
      // Visual Basic
      84: 'vb',
      
      // BASIC
      47: 'basic', 
      
      // COBOL
      77: 'cobol', 
      
      // Assembly
      45: 'asm', 
      
      // SQL
      82: 'sql', 
      
      // F#
      87: 'fsharp',
      
      // Plain text
      43: 'plaintext', 
      44: 'plaintext', 
      89: 'plaintext'
    };
    
    return languageMap[languageId] || 'plaintext';
  }

  /**
   * Monaco 언어를 언어 ID로 역변환
   */
  getLanguageIdFromMonaco(monacoLanguage: MonacoLanguage): number {
    const reverseMap: Record<MonacoLanguage, number> = {
      'python': 71,
      'javascript': 63,
      'typescript': 74,
      'java': 62,
      'c': 49,
      'cpp': 52,
      'csharp': 51,
      'go': 60,
      'rust': 73,
      'ruby': 72,
      'php': 68,
      'lua': 64,
      'perl': 85,
      'shell': 46,
      'haskell': 61,
      'lisp': 55,
      'ocaml': 65,
      'prolog': 69,
      'matlab': 66,
      'r': 80,
      'fortran': 59,
      'pascal': 67,
      'd': 56,
      'erlang': 58,
      'elixir': 57,
      'groovy': 88,
      'clojure': 86,
      'scala': 81,
      'kotlin': 78,
      'objective-c': 79,
      'swift': 83,
      'vb': 84,
      'basic': 47,
      'cobol': 77,
      'asm': 45,
      'sql': 82,
      'fsharp': 87,
      'plaintext': 43
    };
    
    return reverseMap[monacoLanguage] || 43;
  }

  /**
   * 기본 언어 목록 (API 실패 시 사용)
   */
  private getDefaultLanguages(): Language[] {
    return [
      { id: 71, name: 'Python 3', version: '3.8.1', file_extension: '.py' },
      { id: 63, name: 'JavaScript (Node.js)', version: '12.14.0', file_extension: '.js' },
      { id: 74, name: 'TypeScript', version: '3.7.4', file_extension: '.ts' },
      { id: 62, name: 'Java', version: '13.0.1', file_extension: '.java' },
      { id: 49, name: 'C (GCC)', version: '9.2.0', file_extension: '.c' },
      { id: 52, name: 'C++ (GCC)', version: '9.2.0', file_extension: '.cpp' },
      { id: 51, name: 'C#', version: '6.12', file_extension: '.cs' },
      { id: 60, name: 'Go', version: '1.13.5', file_extension: '.go' },
      { id: 72, name: 'Ruby', version: '2.7.0', file_extension: '.rb' },
      { id: 68, name: 'PHP', version: '7.4.1', file_extension: '.php' }
    ];
  }

  /**
   * 인기 언어 목록 조회 (상위 10개)
   */
  async getPopularLanguages(): Promise<Language[]> {
    const allLanguages = await this.getLanguages();
    const popularIds = [71, 63, 62, 49, 52, 51, 60, 72, 68, 73]; // Python, JS, Java, C, C++, C#, Go, Ruby, PHP, Rust
    
    return popularIds
      .map(id => allLanguages.find(lang => lang.id === id))
      .filter((lang): lang is Language => lang !== undefined);
  }

  /**
   * 언어 이름으로 검색
   */
  async searchLanguagesByName(query: string): Promise<Language[]> {
    const allLanguages = await this.getLanguages();
    const lowerQuery = query.toLowerCase();
    
    return allLanguages.filter(lang => 
      lang.name.toLowerCase().includes(lowerQuery)
    );
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const languageApiService = new LanguageApiService();
export default languageApiService;
