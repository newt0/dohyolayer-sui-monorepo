/// Prediction Market Module
///
/// A binary (Yes/No) prediction market implementation for Sui.
/// Users can bet on outcomes, and winners claim proportional payouts after resolution.
///
/// Build: `sui move build`
/// Publish: `sui client publish --gas-budget 100000000`
module prediction_market::prediction_market {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;

    // ====== Error Codes ======

    /// Market has already been resolved
    const EMarketAlreadyResolved: u64 = 1;
    /// Market has not been resolved yet
    const EMarketNotResolved: u64 = 2;
    /// Invalid outcome value (must be 1 or 2)
    const EInvalidOutcome: u64 = 3;
    /// Position has already been claimed
    const EAlreadyClaimed: u64 = 4;
    /// This position is on the losing side
    const ELosingPosition: u64 = 5;
    /// Position does not belong to this market
    const EWrongMarket: u64 = 6;
    /// Bet amount must be greater than zero
    const EInvalidBetAmount: u64 = 7;

    // ====== Core Structs ======

    /// Admin capability for managing markets
    /// Only the holder can resolve markets
    public struct AdminCap has key, store {
        id: UID
    }

    /// Represents a binary prediction market
    public struct Market has key, store {
        id: UID,
        /// The question being predicted (e.g., "Will BTC reach $100k by end of 2024?")
        question: vector<u8>,
        /// Unix timestamp when the market should be resolved
        resolve_time: u64,
        /// AMM parameter 'b' - controls how quickly share prices increase
        /// Higher b = flatter price curve (more shares per SUI)
        b: u64,
        /// Total shares issued for YES predictions
        total_yes_shares: u64,
        /// Total shares issued for NO predictions
        total_no_shares: u64,
        /// Locked SUI pool that will be distributed to winners
        /// TODO: Replace Balance<SUI> with Balance<LST> for liquid staking integration
        pool: Balance<SUI>,
        /// Resolution status: 0 = not resolved, 1 = YES, 2 = NO
        outcome: u8
    }

    /// Represents a user's betting position
    /// Each bet creates one Position object owned by the bettor
    public struct Position has key, store {
        id: UID,
        /// ID of the market this position belongs to
        market_id: ID,
        /// Original owner of this position
        owner: address,
        /// True if betting on YES, false if betting on NO
        is_yes: bool,
        /// Amount of SUI originally staked
        amount_sui: u64,
        /// Number of shares received for this position
        shares: u64,
        /// Whether this position has been claimed after resolution
        claimed: bool
    }

    // ====== Events ======

    public struct MarketCreated has copy, drop {
        market_id: ID,
        question: vector<u8>,
        resolve_time: u64,
        b: u64
    }

    public struct BetPlaced has copy, drop {
        market_id: ID,
        position_id: ID,
        bettor: address,
        is_yes: bool,
        amount_sui: u64,
        shares: u64
    }

    public struct MarketResolved has copy, drop {
        market_id: ID,
        outcome: u8
    }

    public struct PositionClaimed has copy, drop {
        market_id: ID,
        position_id: ID,
        claimer: address,
        payout: u64
    }

    // ====== Initialization ======

    /// Initialize the module by creating and transferring AdminCap
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, ctx.sender());
    }

    // ====== Public Entry Functions ======

    /// Create a new prediction market
    ///
    /// # Arguments
    /// * `question` - The prediction question as bytes (e.g., b"Will BTC reach $100k?")
    /// * `resolve_time` - Unix timestamp when market should be resolved
    /// * `b` - AMM parameter controlling share price curve (e.g., 1000)
    ///
    /// # Returns
    /// Creates a shared Market object
    public entry fun create_market(
        question: vector<u8>,
        resolve_time: u64,
        b: u64,
        ctx: &mut TxContext
    ) {
        let market = Market {
            id: object::new(ctx),
            question,
            resolve_time,
            b,
            total_yes_shares: 0,
            total_no_shares: 0,
            pool: balance::zero(),
            outcome: 0
        };

        let market_id = object::id(&market);
        event::emit(MarketCreated {
            market_id,
            question: market.question,
            resolve_time,
            b
        });

        transfer::share_object(market);
    }

    /// Place a bet on YES
    ///
    /// # Arguments
    /// * `market` - The market to bet on
    /// * `payment` - SUI coins to bet
    ///
    /// # Returns
    /// Creates a Position object owned by the bettor
    public entry fun bet_yes(
        market: &mut Market,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        place_bet(market, payment, true, ctx);
    }

    /// Place a bet on NO
    ///
    /// # Arguments
    /// * `market` - The market to bet on
    /// * `payment` - SUI coins to bet
    ///
    /// # Returns
    /// Creates a Position object owned by the bettor
    public entry fun bet_no(
        market: &mut Market,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        place_bet(market, payment, false, ctx);
    }

    /// Resolve a market (admin only)
    ///
    /// # Arguments
    /// * `_admin_cap` - AdminCap proving authorization
    /// * `market` - The market to resolve
    /// * `outcome` - Resolution outcome (1 = YES, 2 = NO)
    public entry fun resolve_market(
        _admin_cap: &AdminCap,
        market: &mut Market,
        outcome: u8,
        _ctx: &mut TxContext
    ) {
        assert!(market.outcome == 0, EMarketAlreadyResolved);
        assert!(outcome == 1 || outcome == 2, EInvalidOutcome);

        market.outcome = outcome;

        event::emit(MarketResolved {
            market_id: object::id(market),
            outcome
        });
    }

    /// Claim winnings from a resolved market
    ///
    /// # Arguments
    /// * `market` - The resolved market
    /// * `position` - The winning position to claim
    ///
    /// # Returns
    /// Transfers SUI payout to the position owner
    public entry fun claim(
        market: &mut Market,
        position: &mut Position,
        ctx: &mut TxContext
    ) {
        // Verify market is resolved
        assert!(market.outcome != 0, EMarketNotResolved);

        // Verify position belongs to this market
        assert!(position.market_id == object::id(market), EWrongMarket);

        // Verify position hasn't been claimed
        assert!(!position.claimed, EAlreadyClaimed);

        // Verify position is on winning side
        let is_winner = (market.outcome == 1 && position.is_yes) ||
                        (market.outcome == 2 && !position.is_yes);
        assert!(is_winner, ELosingPosition);

        // Calculate payout
        let total_winner_shares = if (market.outcome == 1) {
            market.total_yes_shares
        } else {
            market.total_no_shares
        };

        let pool_value = balance::value(&market.pool);
        // Use u128 to avoid overflow in intermediate calculation
        let payout = (((pool_value as u128) * (position.shares as u128)) / (total_winner_shares as u128) as u64);

        // Mark as claimed
        position.claimed = true;

        // Transfer payout
        let payout_balance = balance::split(&mut market.pool, payout);
        let payout_coin = coin::from_balance(payout_balance, ctx);

        event::emit(PositionClaimed {
            market_id: object::id(market),
            position_id: object::id(position),
            claimer: position.owner,
            payout
        });

        transfer::public_transfer(payout_coin, position.owner);
    }

    // ====== Internal Helper Functions ======

    /// Internal function to handle bet placement
    fun place_bet(
        market: &mut Market,
        payment: Coin<SUI>,
        is_yes: bool,
        ctx: &mut TxContext
    ) {
        // Verify market is not resolved
        assert!(market.outcome == 0, EMarketAlreadyResolved);

        let amount = coin::value(&payment);
        assert!(amount > 0, EInvalidBetAmount);

        // Calculate shares using LMSR-inspired formula
        let shares = calc_shares(
            amount,
            market.b,
            market.total_yes_shares,
            market.total_no_shares
        );

        // Update market state
        if (is_yes) {
            market.total_yes_shares = market.total_yes_shares + shares;
        } else {
            market.total_no_shares = market.total_no_shares + shares;
        };

        // Add payment to pool
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut market.pool, payment_balance);

        // Create position for bettor
        let position = Position {
            id: object::new(ctx),
            market_id: object::id(market),
            owner: ctx.sender(),
            is_yes,
            amount_sui: amount,
            shares,
            claimed: false
        };

        let position_id = object::id(&position);

        event::emit(BetPlaced {
            market_id: object::id(market),
            position_id,
            bettor: ctx.sender(),
            is_yes,
            amount_sui: amount,
            shares
        });

        transfer::transfer(position, ctx.sender());
    }

    /// Calculate shares using simplified LMSR-inspired formula
    ///
    /// Formula: shares = amount * b / (b + total_yes_shares + total_no_shares)
    ///
    /// This ensures:
    /// - Early bettors get more shares per SUI
    /// - As total bet volume increases, shares per SUI decrease
    /// - The 'b' parameter controls the rate of decrease
    ///
    /// # Arguments
    /// * `amount` - Amount of SUI being bet
    /// * `b` - AMM parameter (higher = flatter curve)
    /// * `total_yes` - Current total YES shares
    /// * `total_no` - Current total NO shares
    ///
    /// # Returns
    /// Number of shares to mint
    fun calc_shares(
        amount: u64,
        b: u64,
        total_yes: u64,
        total_no: u64
    ): u64 {
        let total_shares = total_yes + total_no;
        let denominator = b + total_shares;

        // shares = (amount * b) / (b + total_shares)
        // Adding 1 to denominator prevents division by zero
        (amount * b) / (denominator + 1)
    }

    // ====== View Functions (for testing and queries) ======

    #[test_only]
    /// Test helper to create AdminCap
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }

    // ====== Unit Tests ======

    #[test_only]
    use sui::test_scenario;
    #[test_only]
    use sui::test_utils::assert_eq;

    #[test]
    /// Test basic market creation and betting flow
    fun test_market_creation_and_betting() {
        let admin = @0xAD;
        let alice = @0xA11CE;

        let mut scenario = test_scenario::begin(admin);

        // Initialize module
        {
            init_for_testing(scenario.ctx());
        };

        scenario.next_tx(admin);

        // Create market
        {
            create_market(
                b"Will BTC reach $100k by EOY?",
                1735689600, // Dec 31, 2024
                1000,
                scenario.ctx()
            );
        };

        scenario.next_tx(alice);

        // Alice bets YES with 100 SUI
        {
            let mut market = scenario.take_shared<Market>();
            let payment = coin::mint_for_testing<SUI>(100_000_000_000, scenario.ctx()); // 100 SUI

            bet_yes(&mut market, payment, scenario.ctx());

            assert_eq(market.total_yes_shares, 99_900_099_900);
            assert_eq(balance::value(&market.pool), 100_000_000_000);

            test_scenario::return_shared(market);
        };

        scenario.end();
    }

    #[test]
    /// Test that winners can claim after resolution
    fun test_winner_can_claim() {
        let admin = @0xAD;
        let alice = @0xA11CE;
        let bob = @0xB0B;

        let mut scenario = test_scenario::begin(admin);

        // Initialize
        {
            init_for_testing(scenario.ctx());
        };

        scenario.next_tx(admin);

        // Create market
        {
            create_market(
                b"Test market",
                1735689600,
                1000,
                scenario.ctx()
            );
        };

        // Alice bets YES
        scenario.next_tx(alice);
        {
            let mut market = scenario.take_shared<Market>();
            let payment = coin::mint_for_testing<SUI>(100_000_000_000, scenario.ctx());
            bet_yes(&mut market, payment, scenario.ctx());
            test_scenario::return_shared(market);
        };

        // Bob bets NO
        scenario.next_tx(bob);
        {
            let mut market = scenario.take_shared<Market>();
            let payment = coin::mint_for_testing<SUI>(100_000_000_000, scenario.ctx());
            bet_no(&mut market, payment, scenario.ctx());
            test_scenario::return_shared(market);
        };

        // Admin resolves to YES
        scenario.next_tx(admin);
        {
            let admin_cap = scenario.take_from_sender<AdminCap>();
            let mut market = scenario.take_shared<Market>();

            resolve_market(&admin_cap, &mut market, 1, scenario.ctx());

            assert_eq(market.outcome, 1);

            scenario.return_to_sender(admin_cap);
            test_scenario::return_shared(market);
        };

        // Alice claims (winner)
        scenario.next_tx(alice);
        {
            let mut market = scenario.take_shared<Market>();
            let mut position = scenario.take_from_sender<Position>();

            claim(&mut market, &mut position, scenario.ctx());

            assert!(position.claimed);

            scenario.return_to_sender(position);
            test_scenario::return_shared(market);
        };

        // Check Alice received payout
        scenario.next_tx(alice);
        {
            let payout = scenario.take_from_sender<Coin<SUI>>();
            assert_eq(coin::value(&payout), 200_000_000_000); // Full pool
            scenario.return_to_sender(payout);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = ELosingPosition)]
    /// Test that losers cannot claim
    fun test_loser_cannot_claim() {
        let admin = @0xAD;
        let bob = @0xB0B;

        let mut scenario = test_scenario::begin(admin);

        // Initialize
        {
            init_for_testing(scenario.ctx());
        };

        scenario.next_tx(admin);

        // Create market
        {
            create_market(b"Test", 1735689600, 1000, scenario.ctx());
        };

        // Bob bets NO
        scenario.next_tx(bob);
        {
            let mut market = scenario.take_shared<Market>();
            let payment = coin::mint_for_testing<SUI>(100_000_000_000, scenario.ctx());
            bet_no(&mut market, payment, scenario.ctx());
            test_scenario::return_shared(market);
        };

        // Admin resolves to YES (Bob loses)
        scenario.next_tx(admin);
        {
            let admin_cap = scenario.take_from_sender<AdminCap>();
            let mut market = scenario.take_shared<Market>();
            resolve_market(&admin_cap, &mut market, 1, scenario.ctx());
            scenario.return_to_sender(admin_cap);
            test_scenario::return_shared(market);
        };

        // Bob tries to claim (should fail)
        scenario.next_tx(bob);
        {
            let mut market = scenario.take_shared<Market>();
            let mut position = scenario.take_from_sender<Position>();

            claim(&mut market, &mut position, scenario.ctx()); // Should abort here

            scenario.return_to_sender(position);
            test_scenario::return_shared(market);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = EAlreadyClaimed)]
    /// Test that double claims are prevented
    fun test_double_claim_fails() {
        let admin = @0xAD;
        let alice = @0xA11CE;

        let mut scenario = test_scenario::begin(admin);

        // Initialize
        {
            init_for_testing(scenario.ctx());
        };

        scenario.next_tx(admin);

        // Create market
        {
            create_market(b"Test", 1735689600, 1000, scenario.ctx());
        };

        // Alice bets YES
        scenario.next_tx(alice);
        {
            let mut market = scenario.take_shared<Market>();
            let payment = coin::mint_for_testing<SUI>(100_000_000_000, scenario.ctx());
            bet_yes(&mut market, payment, scenario.ctx());
            test_scenario::return_shared(market);
        };

        // Resolve to YES
        scenario.next_tx(admin);
        {
            let admin_cap = scenario.take_from_sender<AdminCap>();
            let mut market = scenario.take_shared<Market>();
            resolve_market(&admin_cap, &mut market, 1, scenario.ctx());
            scenario.return_to_sender(admin_cap);
            test_scenario::return_shared(market);
        };

        // Alice claims once (success)
        scenario.next_tx(alice);
        {
            let mut market = scenario.take_shared<Market>();
            let mut position = scenario.take_from_sender<Position>();
            claim(&mut market, &mut position, scenario.ctx());
            scenario.return_to_sender(position);
            test_scenario::return_shared(market);
        };

        // Alice tries to claim again (should fail)
        scenario.next_tx(alice);
        {
            let mut market = scenario.take_shared<Market>();
            let mut position = scenario.take_from_sender<Position>();

            claim(&mut market, &mut position, scenario.ctx()); // Should abort here

            scenario.return_to_sender(position);
            test_scenario::return_shared(market);
        };

        scenario.end();
    }

    #[test]
    /// Test share calculation formula
    fun test_share_calculation() {
        // First bet: lots of shares
        let shares1 = calc_shares(100, 1000, 0, 0);
        assert!(shares1 > 90, 0); // Should get ~99.9 shares per SUI

        // After some bets: fewer shares
        let shares2 = calc_shares(100, 1000, 5000, 5000);
        assert!(shares2 < shares1, 1); // Should get fewer shares

        // Much later: even fewer shares
        let shares3 = calc_shares(100, 1000, 50000, 50000);
        assert!(shares3 < shares2, 2);
    }
}
