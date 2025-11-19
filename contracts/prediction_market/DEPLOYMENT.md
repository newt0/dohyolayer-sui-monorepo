# Prediction Market - Testnet Deployment

## ✅ Deployment Status: SUCCESSFUL

**Network**: Sui Testnet
**Deployed**: November 15, 2025
**Transaction Digest**: `9YU9yoHbi68oprhGjsT13u1mwkDUyS9k1dymiUeRn5ry`

---

## 📦 Important Addresses

### Package ID (コントラクトアドレス)
```
0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799
```

### AdminCap Object ID (管理者権限)
```
0xa69d1c87adb92342dc3079c4ec0ee66a123db593c07d84527adfbacda2732fe7
```
**Owner**: `0xb7dbc93f0e8489b2aafcdfae658af3a465412cf31b9348cfd7da1d4ded145d49`

### UpgradeCap Object ID (アップグレード権限)
```
0xdbde3935fc0d16f6cc058ce70660dd634ca96d6b7eabb7edb450786c99c52e3e
```

---

## 💰 Gas Costs

- **Storage Cost**: 23.696800 MIST
- **Computation Cost**: 1.000000 MIST
- **Storage Rebate**: 0.978120 MIST
- **Total Gas Used**: ~23.72 MIST (≈0.024 SUI)

---

## 🔗 Explorer Links

### Transaction
https://testnet.suivision.xyz/txblock/9YU9yoHbi68oprhGjsT13u1mwkDUyS9k1dymiUeRn5ry

### Package
https://testnet.suivision.xyz/package/0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799

### AdminCap Object
https://testnet.suivision.xyz/object/0xa69d1c87adb92342dc3079c4ec0ee66a123db593c07d84527adfbacda2732fe7

---

## 🚀 Usage Examples

### 1. マーケットを作成 (Create Market)

```bash
sui client call \
  --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
  --module prediction_market \
  --function create_market \
  --args \
    "Will BTC reach $100k by end of 2024?" \
    1735689600 \
    1000 \
  --gas-budget 10000000
```

### 2. YESに賭ける (Bet YES)

まず使用可能なSUIコインを確認:
```bash
sui client gas
```

次にベット:
```bash
sui client call \
  --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
  --module prediction_market \
  --function bet_yes \
  --args \
    <MARKET_ID> \
    <COIN_OBJECT_ID> \
  --gas-budget 10000000
```

### 3. NOに賭ける (Bet NO)

```bash
sui client call \
  --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
  --module prediction_market \
  --function bet_no \
  --args \
    <MARKET_ID> \
    <COIN_OBJECT_ID> \
  --gas-budget 10000000
```

### 4. マーケットを解決 (Resolve Market - Admin Only)

```bash
sui client call \
  --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
  --module prediction_market \
  --function resolve_market \
  --args \
    0xa69d1c87adb92342dc3079c4ec0ee66a123db593c07d84527adfbacda2732fe7 \
    <MARKET_ID> \
    1 \
  --gas-budget 10000000
```

**Outcome値**:
- `1` = YES勝利
- `2` = NO勝利

### 5. 賞金を請求 (Claim Winnings)

```bash
sui client call \
  --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
  --module prediction_market \
  --function claim \
  --args \
    <MARKET_ID> \
    <POSITION_ID> \
  --gas-budget 10000000
```

---

## 📊 TypeScript SDK Example

```typescript
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });
const PACKAGE_ID = '0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799';

// Create a market
async function createMarket(signer) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::prediction_market::create_market`,
    arguments: [
      tx.pure('Will ETH reach $5000 by end of 2024?'),
      tx.pure(1735689600), // Unix timestamp
      tx.pure(1000), // b parameter
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer,
    transactionBlock: tx,
  });

  return result;
}

// Bet YES
async function betYes(signer, marketId, coinId) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::prediction_market::bet_yes`,
    arguments: [
      tx.object(marketId),
      tx.object(coinId),
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer,
    transactionBlock: tx,
  });

  return result;
}
```

---

## 🧪 Testing on Testnet

### テスト用SUIトークンを取得
https://faucet.sui.io/?address=0xb7dbc93f0e8489b2aafcdfae658af3a465412cf31b9348cfd7da1d4ded145d49

### 基本的なテストフロー

1. **マーケット作成** - 任意の質問でマーケットを作成
2. **複数アカウントでベット** - YES/NOの両方にベットする
3. **結果の解決** - AdminCapを使用してマーケットを解決
4. **勝者が賞金請求** - 勝った側のユーザーが賞金を請求

---

## 🔍 Contract Verification

### Source Code
GitHub: `https://github.com/[your-repo]/sha256-sui-monorepo/tree/main/contracts/prediction_market`

### Build Reproducibility
```bash
git clone [your-repo]
cd sha256-sui-monorepo/contracts/prediction_market
sui move build
# Compare with deployed package digest
```

---

## 📝 Notes

- **Network**: Sui Testnet (プロトコルバージョン 101)
- **Sui CLI Version**: 1.49.1 (バージョン警告あり、動作には影響なし)
- **Module**: `prediction_market::prediction_market`
- **AdminCap Owner**: デプロイしたアドレスが所有

---

## ⚠️ Important Reminders

1. **AdminCapは安全に保管** - マーケット解決に必要
2. **Testnetのトークンは価値なし** - 実際の資金ではありません
3. **本番環境への移行前** - セキュリティ監査を推奨
4. **LST統合** - コード内のTODOコメントを参照

---

## 🎯 Hackathon Demo Script

### シナリオ: "Will BTC reach $100k by EOY 2024?"

1. **Setup** (1分)
   - Explorer でパッケージを表示
   - AdminCapの所有を確認

2. **Create Market** (2分)
   ```bash
   sui client call --package 0x71a6f72703672915f742044f9f7e2840cbf2d44d7747e0e1c9d64de1866bd799 \
     --module prediction_market --function create_market \
     --args "Will BTC reach $100k by EOY 2024?" 1735689600 1000 \
     --gas-budget 10000000
   ```

3. **Place Bets** (3分)
   - Alice: 100 SUI on YES
   - Bob: 100 SUI on NO
   - Show share difference (early bettor advantage)

4. **Resolve** (1分)
   - Admin resolves to YES (outcome=1)

5. **Claim** (2分)
   - Alice claims and receives ~200 SUI
   - Show Bob cannot claim (error)

6. **Highlight** (1分)
   - LMSR pricing working
   - Immutable positions
   - Ready for LST integration

**Total Demo Time**: ~10 minutes

---

## 📞 Support

問題が発生した場合:
1. Transaction Digestでエラーを確認
2. Sui Explorerで状態を検証
3. CLIのバージョンを確認
4. ガス予算を増やしてリトライ

**Deployed by**: Prediction Market Team
**For**: Sui × ONE Championship Hackathon
