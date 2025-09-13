# Figma → Vue (Vite + Vue 3 + TS)

## 개발 실행
```bash
npm install
npm run dev
```

## Figma 데이터 수집(Dev Mode)
환경변수에 토큰을 설정한 후 실행하세요.
```powershell
$env:FIGMA_TOKEN = "<paste_token_here>"
npm run figma:pull
```
출력: `figma-data/nodes.json`, `figma-data/styles.json`

구성 파일: `figma.config.json`
```json
{
  "fileKey": "0ebMDeqDBVWkgeFEF9Qb9w",
  "nodeId": "361:6569"
}
```

## 기술 스택
- Vue 3 + Vite + TypeScript
- Tailwind CSS
- Vue Router, Pinia
