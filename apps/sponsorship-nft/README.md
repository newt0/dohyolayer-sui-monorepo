# Sponsor On-Chain

通过购买选手短裤赞助位 NFT，让品牌 Logo 登上真实格斗赛场。

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Sui Slush Wallet (@mysten/wallet-kit)

## 功能

1. ✅ Sui Slush Wallet 登录
2. ✅ Dashboard 首页（选手列表）
3. ✅ 选手页（短裤槽位展示）
4. ✅ 槽位信息面板（三种状态）
5. ✅ Logo 上传流程

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

## 短裤图片说明

请将短裤图片放在 `public/shorts/shorts.png`

### 槽位位置坐标（相对于 400x500 的容器）

- **Slot A（左腿上）**: x: 80, y: 120, width: 100, height: 40
- **Slot B（左腿下）**: x: 80, y: 280, width: 100, height: 40
- **Slot C（右腿上）**: x: 220, y: 120, width: 100, height: 40
- **Slot D（右腿下）**: x: 220, y: 280, width: 100, height: 40

生成图片时，请确保 Logo 位置与上述坐标对应。

## 项目结构

```
├── app/
│   ├── fighter/[id]/page.tsx  # 选手详情页
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/
│   ├── WalletButton.tsx        # 钱包连接按钮
│   ├── WalletProvider.tsx      # 钱包提供者
│   ├── FighterCard.tsx        # 选手卡片
│   ├── ShortsDisplay.tsx       # 短裤展示组件
│   ├── SlotPanel.tsx          # 槽位信息面板
│   ├── EventInfo.tsx          # 赛事信息
│   └── UploadLogoModal.tsx    # Logo 上传弹窗
├── data/
│   └── mockData.ts            # Mock 数据
└── public/
    └── shorts/
        └── shorts.png         # 短裤图片（需要添加）
```

