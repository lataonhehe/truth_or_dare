# Truth or Dare 🎮

Game party **Truth or Dare** dành cho nhóm bạn, xây dựng bằng Next.js với giao diện tiếng Việt.

## Tính năng

- **2 chế độ chơi**: Classic (Thật/Thách) và Chaos (Làm Ngay/Thách)
- **3 mức độ**: Chill, Spicy, Wild
- **Theo dõi thống kê**: Đếm số lượt hoàn thành và bỏ qua của từng người chơi
- **27 thẻ câu hỏi/thách thức** được phân loại theo mức độ
- **Hình phạt** cho người chơi bỏ qua lượt
- Hỗ trợ dark/light mode

## Tech Stack

- [Next.js](https://nextjs.org/) 16 + React 19 + TypeScript
- [TailwindCSS](https://tailwindcss.com/) 4
- [Radix UI](https://www.radix-ui.com/) — component library
- [Framer Motion](https://www.framer.com/motion/) — animations

## Cài đặt

```bash
# Cài dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |

## Cấu trúc dự án

```
├── app/
│   ├── page.tsx          # Quản lý trạng thái game (Splash → Home → Setup → Gameplay → GameOver)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── splash-screen.tsx
│   ├── home-screen.tsx
│   ├── game-setup.tsx
│   ├── gameplay-screen.tsx
│   ├── game-over-screen.tsx
│   └── ui/               # 40+ Radix UI components
└── lib/
    └── game-data.ts      # Dữ liệu thẻ bài và logic lọc
```

## Luật chơi

1. Nhập danh sách người chơi (tối thiểu 2 người)
2. Chọn chế độ và mức độ
3. Mỗi người chơi lần lượt rút thẻ và hoàn thành thách thức
4. Game kết thúc sau 10 vòng
