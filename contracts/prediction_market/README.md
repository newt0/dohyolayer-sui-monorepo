# Prediction Market MVP

A binary (Yes/No) prediction market implementation for Sui blockchain, built for the Sui × ONE Championship hackathon.

## Overview

This Move package implements a simple but functional prediction market where:
- Users can bet SUI on binary outcomes (Yes/No)
- Early bettors receive more shares per SUI (LMSR-inspired pricing)
- Markets are resolved by an admin
- Winners claim proportional payouts from the locked pool
- Positions are immutable NFTs (one-way bets)

## Architecture

### Core Structs

#### `Market`
Represents a binary prediction market with:
- `question`: The prediction question (bytes)
- `resolve_time`: Unix timestamp for when it should be resolved
- `b`: AMM parameter controlling share price curve (higher = flatter)
- `total_yes_shares` / `total_no_shares`: Running totals
- `pool`: Locked SUI balance for payouts
- `outcome`: Resolution status (0 = unresolved, 1 = YES, 2 = NO)

#### `Position`
An NFT representing a user's bet:
- `market_id`: Which market this belongs to
- `owner`: The bettor's address
- `is_yes`: Whether betting on YES or NO
- `amount_sui`: Original stake amount
- `shares`: Number of shares received
- `claimed`: Whether winnings have been claimed

#### `AdminCap`
Capability object for market administration. Only the holder can resolve markets.

### Key Functions

#### Market Creation
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module prediction_market \
  --function create_market \
  --args "Will BTC reach $100k by EOY?" 1735689600 1000
```

#### Betting
```bash
# Bet YES
sui client call \
  --package <PACKAGE_ID> \
  --module prediction_market \
  --function bet_yes \
  --args <MARKET_ID> <COIN_OBJECT_ID> \
  --gas-budget 10000000

# Bet NO
sui client call \
  --package <PACKAGE_ID> \
  --module prediction_market \
  --function bet_no \
  --args <MARKET_ID> <COIN_OBJECT_ID> \
  --gas-budget 10000000
```

#### Market Resolution (Admin Only)
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module prediction_market \
  --function resolve_market \
  --args <ADMIN_CAP_ID> <MARKET_ID> 1 \
  --gas-budget 10000000
```
Note: outcome must be `1` (YES) or `2` (NO)

#### Claiming Winnings
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module prediction_market \
  --function claim \
  --args <MARKET_ID> <POSITION_ID> \
  --gas-budget 10000000
```

## Share Calculation

The module uses a simplified LMSR-inspired formula:

```
shares = (amount * b) / (b + total_yes_shares + total_no_shares)
```

Where:
- `amount`: SUI being bet
- `b`: Market liquidity parameter
- `total_*_shares`: Current shares already issued

This ensures:
- **Early bettors get more shares** (when total_shares is low)
- **Later bettors get fewer shares** (as total_shares increases)
- **Parameter `b` controls the curve** (higher b = more shares overall)

Example with `b = 1000`:
- First 100 SUI bet → ~99.9 shares per SUI
- After 10,000 total shares → ~9.1 shares per SUI
- After 100,000 total shares → ~1.0 shares per SUI

## Build & Test

### Prerequisites

Install the Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Or follow the [official installation guide](https://docs.sui.io/guides/developer/getting-started/sui-install).

### Build

```bash
cd contracts/prediction_market
sui move build
```

Expected output: `Build Successful`

### Run Tests

```bash
sui move test
```

The package includes comprehensive tests:
- ✅ Market creation and betting
- ✅ Winners can claim after resolution
- ✅ Losers cannot claim
- ✅ Double claim prevention
- ✅ Share calculation accuracy

### Publish to Testnet

1. Set up Sui testnet configuration:
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

2. Get testnet SUI from faucet:
```bash
sui client faucet
```

3. Publish the package:
```bash
sui client publish --gas-budget 100000000
```

4. Save important values from the output:
   - `Package ID`: The published package address
   - `AdminCap ID`: Object ID of the admin capability (sent to publisher)
   - `Transaction Digest`: For verification

### Testnet Interaction Example

After publishing, create your first market:

```bash
# Create a market (question in hex bytes)
sui client call \
  --package <YOUR_PACKAGE_ID> \
  --module prediction_market \
  --function create_market \
  --args "0x57696c6c204254432072656163682024313030303030303f" 1735689600 1000 \
  --gas-budget 10000000
```

Note: The question string must be provided as hex bytes. Use a converter or the Move client tools.

## Future Extensions

### Liquid Staking Token (LST) Integration

The design is modular to support LST integration. Marked extension points include:

1. **Pool Type**: Currently `Balance<SUI>`, can be changed to `Balance<LST>`
2. **Staking Logic**: Add calls to external LST protocol on bet placement
3. **Yield Distribution**: Implement yield accrual during market lifetime
4. **Unstaking**: Automatically unstake when winners claim

Example integration point (in `Market` struct):
```move
/// TODO: Replace Balance<SUI> with Balance<LST>
/// TODO: Add LST protocol integration:
///   - On bet: deposit SUI → receive LST
///   - On claim: withdraw LST → unstake to SUI
pool: Balance<SUI>,  // Change to Balance<LST>
```

### Other Potential Extensions

- **Multiple outcome markets**: Extend beyond binary predictions
- **Time-weighted shares**: Reward early participation more heavily
- **Market maker fees**: Take a small percentage for platform
- **Partial claims**: Allow users to claim incrementally
- **Market cancellation**: Return stakes if market is invalid
- **Oracle integration**: Automated resolution from price feeds

## Security Notes

This is an MVP for hackathon demonstration. For production:

1. Add reentrancy guards (Sui's object model helps prevent this)
2. Implement emergency pause functionality
3. Add time locks for resolutions
4. Implement dispute resolution mechanism
5. Audit share calculation for edge cases
6. Add maximum bet limits to prevent manipulation
7. Implement proper access control for admin functions

## File Structure

```
prediction_market/
├── Move.toml                         # Package manifest
├── README.md                         # This file
└── sources/
    └── prediction_market.move        # Main module implementation
```

## License

MIT License - Built for Sui × ONE Championship Hackathon

## Questions?

For hackathon pitch preparation:
- **What problem does this solve?** Decentralized, transparent prediction markets for real-world events
- **Why Sui?** Fast finality, object-centric model perfect for NFT positions, low fees
- **What's unique?** LMSR pricing, immutable positions, ready for LST integration
- **Next steps?** Add LST yield, multi-outcome markets, oracle integration
