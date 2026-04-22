# Dairy Export Checker

베트남/캄보디아 유제품 수출 적합성을 로컬 규정 데이터베이스 기준으로 검토하는 React + Vite 웹앱입니다.

## 특징

- API 없이 동작하는 정적 프론트엔드 앱
- 베트남/캄보디아 국가 선택
- 유제품 유형별 기준 검토
- 동물성 원료 검역 체크
- 첨가물 허용 기준 검토
- 라벨링 필수 항목 안내

## 실행 방법

```bash
npm install
npm run dev
```

## 배포

### GitHub 업로드

```bash
git init
git add .
git commit -m "init dairy export checker"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Vercel 연결

1. Vercel 접속
2. Add New Project
3. GitHub 저장소 선택
4. Framework Preset이 Vite로 잡히는지 확인
5. Deploy

## 빌드

```bash
npm run build
```
