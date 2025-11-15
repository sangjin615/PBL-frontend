/**
 * 언어 관련 타입 정의
 */

export interface Language {
  id: number;
  name: string;
  version?: string;
  file_extension?: string;
}

export interface LanguageResponse {
  languages: Language[];
}

/**
 * Monaco Editor 언어 매핑 타입
 */
export type MonacoLanguage = 
  | 'python' 
  | 'javascript' 
  | 'typescript' 
  | 'java' 
  | 'c' 
  | 'cpp' 
  | 'csharp' 
  | 'go' 
  | 'rust' 
  | 'ruby' 
  | 'php' 
  | 'lua' 
  | 'perl' 
  | 'shell' 
  | 'haskell' 
  | 'lisp' 
  | 'ocaml' 
  | 'prolog' 
  | 'matlab' 
  | 'r' 
  | 'fortran' 
  | 'pascal' 
  | 'd' 
  | 'erlang' 
  | 'elixir' 
  | 'groovy' 
  | 'clojure' 
  | 'scala' 
  | 'kotlin' 
  | 'objective-c' 
  | 'swift' 
  | 'vb' 
  | 'basic' 
  | 'cobol' 
  | 'asm' 
  | 'sql' 
  | 'fsharp' 
  | 'plaintext';
