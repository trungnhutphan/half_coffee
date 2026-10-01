# KA Pods marketing demo

Website giới thiệu KA Pods chạy hoàn toàn ở frontend và được build bằng Vite.

## Chạy local

```bash
npm ci
npm run dev
```

## Deploy lên GitHub Pages

1. Trên GitHub, mở **Settings → Pages**.
2. Tại **Build and deployment → Source**, chọn **GitHub Actions**.
3. Push nhánh `main` lên GitHub.

Workflow `.github/workflows/deploy-pages.yml` sẽ tự chạy test, build thư mục `dist` và publish website tại:

<https://trungnhutphan.github.io/half_coffee/>
