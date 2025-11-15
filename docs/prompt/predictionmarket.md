You are an expert Sui/Move engineer working in Claude Code.
Your task is to implement a complete Move package for a prediction market MVP on Sui.

【Context】

- This project is for a Sui × ONE Championship hackathon.
- Production-level security or complex pricing logic is NOT required.
- The goal is: “looks structurally correct,” “can be published to Sui testnet,” and “easy to explain during the pitch.”

【Requirements】

① Overall Architecture

- A binary prediction market (Yes / No).
- The only currency is SUI (`Coin<SUI>`).
- Each market must store:
  - `question` (string)
  - `resolve_time` (Unix timestamp)
  - an AMM parameter `b` (to favor early bettors)
  - total shares for Yes and No
  - a locked SUI pool (`Coin<SUI>`)
  - resolution state (`resolved`, `outcome`)
- `outcome` should be:
  - 0 = not resolved
  - 1 = YES
  - 2 = NO

② Betting logic

- Users bet SUI on either Yes or No.
- When a user bets:
  - They receive “shares”.
  - Early bettors receive more shares per 1 SUI.
  - As total bet volume increases, shares per SUI decrease.
  - A simplified LMSR-inspired formula is enough.
    Example:
    `shares = amount * b / (1 + total_yes_shares + total_no_shares)`
- Once a position is created, it cannot be changed or cancelled.
  - No selling, no modification → “one-way bet”.

③ Position management

- Each bet mints a `Position` Move object owned by the user.
- A `Position` should include:
  - `market_id`
  - `owner`
  - `is_yes`
  - `amount_sui` (original stake)
  - `shares`
  - `claimed` (boolean)
- Positions must be treated as immutable except for marking `claimed`.

④ Market resolution & payout

- Only the admin may resolve a market.
  - Implement an `AdminCap` object for authorization.
- Workflow:
  - Admin calls `resolve_market(market, outcome)`
  - Winning-side users call `claim(market, position)`
  - Payout formula:
    `payout = pool_value * position.shares / total_winner_shares`
- Losers must NOT be able to claim.
- Double claims must be rejected.

⑤ LST (Liquid Staking) extension (optional stretch goal)

- Actual LST integration is NOT required now.
- However:
  - Keep the design modular so LST can be plugged in later.
  - Add comments showing extension points.
- Example comment:
  /// TODO: Replace Coin<SUI> with Coin<LST> and deposit stakes into an external LST module.

【Development Tasks】

Task 1: Design & File Structure

- Propose `Move.toml` and `sources/` folder layout.
- Package name: `prediction_market`.
- Set Sui Framework dependencies in `Move.toml`.
- Define the main structs with comments:
- `Market`
- `Position`
- `AdminCap`
- Describe each field clearly.

Task 2: Module Implementation

- Implement `sources/prediction_market.move`.
- Required public entry functions:
- `init`
- `create_market`
- `bet_yes`
- `bet_no`
- `resolve_market`
- `claim`
- Implement an internal `calc_shares` function:
- Early users get more shares.
- Shares per SUI decrease as total shares increase.
- Add brief English doc comments to each function.

Task 3: Unit Tests

- Write several Move unit tests (`#[test]`):
- Market creation & betting works.
- After resolution, winners can claim.
- Losers cannot claim.
- Double claim attempts fail.
- Use simple dummy accounts; only basic happy-path and validation required.

Task 4: Build & Deploy Instructions

- At the bottom of the file or in comments:
- Show how to build:
  `sui move build`
- Show how to publish to testnet:
  `sui client publish --gas-budget <amount>`
- Use placeholder addresses and keep instructions hackathon-friendly.

【Important Notes】

- Perfect economic correctness is not needed.
- The priority is:
- Code compiles (as much as possible)
- State transitions are clean and understandable
- Easy to extend (especially for future LST integration)
- Easy to present in a pitch

Please start by outputting:

1. File structure proposal
2. `Move.toml`
3. Struct definitions and comments  
   Then proceed with module implementation → unit tests → build/publish instructions.
