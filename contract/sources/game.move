module cockfight::game {
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::ExtendRef;
    use aptos_framework::randomness;
    use aptos_std::string_utils::{to_string};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use std::option;
    use std::signer::address_of;
    use std::string::{String, utf8};

    /// Cockie not exist at given address
    const ECOCKIE_NOT_EXIST: u64 = 1;
    /// Randomness commitment not exist at given address, please commit first
    const ERANDOMNESS_COMMITMENT_NOT_EXIST: u64 = 2;
    /// Dead Cockie cannot move
    const EDEAD_COCKIE_CANNOT_MOVE: u64 = 3;
    /// Already committed random value, please reveal now
    const EALREADY_COMMITTED: u64 = 4;
    /// Already revealed random value, please commit again for next move
    const EALREADY_REVEALED: u64 = 5;

    const APP_OBJECT_SEED: vector<u8> = b"COCKIE";
    const COCKIE_COLLECTION_NAME: vector<u8> = b"Cockie Collection";
    const COCKIE_COLLECTION_DESCRIPTION: vector<u8> = b"Cockie Collection Description";
    const COCKIE_COLLECTION_URI: vector<u8> = b"https://otjbxblyfunmfblzdegw.supabase.co/storage/v1/object/public/cockie/aptocockie.png";
    const COCKIE_DEFAULT_VALUE: u64 = 1_000_000; // 1_000_000 oct = 1 Aptocockie

    // Body value range is [0, 5)
    const BODY_MAX_VALUE_EXCL: u8 = 5;
    // Ear value range is [0, 6)
    const EAR_MAX_VALUE_EXCL: u8 = 6;
    // Face value range is [0, 4)
    const FACE_MAX_VALUE_EXCL: u8 = 4;
    // default health of Cockie at creation
    const DEFAULT_BEGINNING_HEALTH: u8 = 5;

    struct Cockie has key {
        live: bool,
        health: u8,
        extend_ref: ExtendRef,
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
    }

    struct RandomnessCommitmentExt has key {
        revealed: bool,
        value: u8,
    }

    #[event]
    struct MintCockieEvent has drop, store {
        cockie_address: address,
        token_name: String,
    }

    // Tokens require a signer to create, so this is the signer for the collection
    struct CollectionCapability has key {
        extend_ref: ExtendRef,
    }

    // This function is only called once when the module is published for the first time.
    fun init_module(account: &signer) {
        let constructor_ref = object::create_named_object(
            account,
            APP_OBJECT_SEED,
        );
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let app_signer = &object::generate_signer(&constructor_ref);

        move_to(app_signer, CollectionCapability {
            extend_ref,
        });

        create_cockie_collection(app_signer);
    }

    fun get_collection_address(): address {
        object::create_object_address(&@cockfight, APP_OBJECT_SEED)
    }

    fun get_collection_signer(collection_address: address): signer acquires CollectionCapability {
        object::generate_signer_for_extending(&borrow_global<CollectionCapability>(collection_address).extend_ref)
    }

    fun get_cockie_signer(cockie_address: address): signer acquires Cockie {
        object::generate_signer_for_extending(&borrow_global<Cockie>(cockie_address).extend_ref)
    }

    // Create the collection that will hold all the Cockies
    fun create_cockie_collection(creator: &signer) {
        let description = utf8(COCKIE_COLLECTION_DESCRIPTION);
        let name = utf8(COCKIE_COLLECTION_NAME);
        let uri = utf8(COCKIE_COLLECTION_URI);

        collection::create_unlimited_collection(
            creator,
            description,
            name,
            option::none(),
            uri,
        );
    }

    // Create an Cockie token object.
    // Because this function calls random it must not be public.
    // This ensures user can only call it from a transaction instead of another contract.
    // This prevents users seeing the result of mint and act on it, e.g. see the result and abort the tx if they don't like it.
    #[randomness]
    entry fun create_cockie(user: &signer) acquires CollectionCapability {
        create_cockie_internal(user);
    }

    fun create_cockie_internal(user: &signer): address acquires CollectionCapability {
        // let body = randomness::u8_range(0, BODY_MAX_VALUE_EXCL);
        // let ear = randomness::u8_range(0, EAR_MAX_VALUE_EXCL);
        // let face = randomness::u8_range(0, FACE_MAX_VALUE_EXCL);

        let uri = utf8(COCKIE_COLLECTION_URI);
        let description = utf8(COCKIE_COLLECTION_DESCRIPTION);
        let user_address = address_of(user);
        let token_name = to_string(&user_address);

        let collection_address = get_collection_address();
        let constructor_ref = &token::create(
            &get_collection_signer(collection_address),
            utf8(COCKIE_COLLECTION_NAME),
            description,
            token_name,
            option::none(),
            uri,
        );

        let token_signer_ref = &object::generate_signer(constructor_ref);
        let cockie_address = address_of(token_signer_ref);

        let extend_ref = object::generate_extend_ref(constructor_ref);
        let mutator_ref = token::generate_mutator_ref(constructor_ref);
        let burn_ref = token::generate_burn_ref(constructor_ref);
        let transfer_ref = object::generate_transfer_ref(constructor_ref);

        // Initialize and set default Cockie struct values
        let cockie = Cockie {
            live: true,
            health: DEFAULT_BEGINNING_HEALTH,
            extend_ref,
            mutator_ref,
            burn_ref,
        };
        move_to(token_signer_ref, cockie);

        // Emit event for minting Cockie token
        event::emit<MintCockieEvent>(
            MintCockieEvent {
                cockie_address: address_of(token_signer_ref),
                token_name,
            },
        );

        // Transfer the Cockie to the user
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));

        cockie_address
    }

    // Throw error if Cockie does not exist or is dead
    fun check_cockie_exist_and_live(cockie_address: address) acquires Cockie {
        let exist_cockie = exists<Cockie>(cockie_address);
        assert!(exist_cockie, ECOCKIE_NOT_EXIST);

        let cockie_ref = borrow_global<Cockie>(cockie_address);
        assert!(cockie_ref.live, EDEAD_COCKIE_CANNOT_MOVE)
    }

    // Throw error if RandomnessCommitmentExt does not exist or is not committed
    fun check_randomness_commitment_exist_and_not_revealed(
        cockie_address: address
    ) acquires RandomnessCommitmentExt {
        let exist_randomness_commitment_ext = exists<RandomnessCommitmentExt>(cockie_address);
        assert!(exist_randomness_commitment_ext, ERANDOMNESS_COMMITMENT_NOT_EXIST);
        let random_commitment_ext = borrow_global<RandomnessCommitmentExt>(cockie_address);
        assert!(!random_commitment_ext.revealed, EALREADY_REVEALED)
    }

    // Make a random move for the Aptocockie.
    // Depending on the random value, the Cockie's health will increase or decrease.
    // We prevent undergasing attack by making sure the gas cost of both paths are equal or reward path is higher.
    // This function is only called from a transaction to prevent test and abort attack.
    #[randomness]
    entry fun make_random_move(
        cockie_address: address,
    ) acquires Cockie {
        check_cockie_exist_and_live(cockie_address);
        let cockie = borrow_global_mut<Cockie>(cockie_address);
        let random_value = randomness::u8_range(0, 2);
        if (random_value == 0) {
            // Reward path
            cockie.health = cockie.health + 1;
            // Always run to make sure reward path gas cost is always higher or equal to punishment path
            if (cockie.health > 0) {
                cockie.live = true;
            }
        } else {
            // Punishment path
            cockie.health = cockie.health - 1;
            // Conditionally run, so punishment path gas cost is always lower or equal to reward path
            if (cockie.health == 0) {
                cockie.live = false;
            }
        };
    }

    // This prevents undergasing attack by committing it first.
    // This function is only called from a transaction to prevent test and abort attack.
    #[randomness]
    entry fun make_random_move_commit(cockie_address: address) acquires Cockie, RandomnessCommitmentExt {
        check_cockie_exist_and_live(cockie_address);
        let exist_randomness_commitment_ext = exists<RandomnessCommitmentExt>(cockie_address);
        if (exist_randomness_commitment_ext) {
            let random_commitment_ext = borrow_global_mut<RandomnessCommitmentExt>(cockie_address);
            // Randomness should already be revealed now so it can be committed again
            // Throw error if it's already committed but not revealed
            assert!(random_commitment_ext.revealed, EALREADY_COMMITTED);
            let random_value = randomness::u8_range(0, 2);
            // Commit a new random value now, flip the revealed flag to false
            random_commitment_ext.revealed = false;
            random_commitment_ext.value = random_value;
        } else {
            let random_value = randomness::u8_range(0, 2);
            let cockie_signer_ref = &get_cockie_signer(cockie_address);
            move_to(cockie_signer_ref, RandomnessCommitmentExt {
                revealed: false,
                value: random_value,
            });
        }
    }

    // Used together with make_random_move_commit to reveal the random value.
    // If user doesn't reveal cause it doesn't like the result, it cannot enter the next round of game
    // In our case user cannot make another move without revealing the previous move
    // This function is only called from a transaction to prevent test and abort attack.
    entry fun make_random_move_reveal(
        cockie_address: address,
    ) acquires Cockie, RandomnessCommitmentExt {
        check_cockie_exist_and_live(cockie_address);
        let cockie = borrow_global_mut<Cockie>(cockie_address);
        check_randomness_commitment_exist_and_not_revealed(cockie_address);
        let random_commitment_ext = borrow_global_mut<RandomnessCommitmentExt>(cockie_address);
        if (random_commitment_ext.value == 0) {
            cockie.health = cockie.health + 1;
        } else {
            cockie.health = cockie.health - 1;
            if (cockie.health == 0) {
                cockie.live = false;
            }
        };
        random_commitment_ext.revealed = true;
    }

    // Get collection name of cockie collection
    #[view]
    public fun get_cockie_collection_name(): (String) {
        utf8(COCKIE_COLLECTION_NAME)
    }

    // Get creator address of cockie collection
    #[view]
    public fun get_cockie_collection_creator_address(): (address) {
        get_collection_address()
    }

    // Get collection ID of cockie collection
    #[view]
    public fun get_cockie_collection_address(): (address) {
        let collection_name = utf8(COCKIE_COLLECTION_NAME);
        let creator_address = get_collection_address();
        collection::create_collection_address(&creator_address, &collection_name)
    }

    // Returns all fields for this Cockie (if found)
    #[view]
    public fun get_cockie(cockie_address: address): (bool, u8) acquires Cockie {
        let cockie = borrow_global<Cockie>(cockie_address);
        (cockie.live, cockie.health)
    }

    // ==== TESTS ====
    // Setup testing environment
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use aptos_std::crypto_algebra::enable_cryptography_algebra_natives;

    #[test_only]
    fun setup_test(
        fx: &signer,
        account: &signer,
        creator: &signer,
    ) {
        enable_cryptography_algebra_natives(fx);
        randomness::initialize_for_testing(fx);
        randomness::set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");

        // create a fake account (only for testing purposes)
        create_account_for_test(address_of(creator));
        create_account_for_test(address_of(account));

        init_module(account)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    fun test_create_cockie(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, Cockie {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        let (live, health) = get_cockie(cockie_address);
        assert!(live, 1);
        assert!(health == DEFAULT_BEGINNING_HEALTH, 2)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    fun test_move_happy_path(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        let (live, health) = get_cockie(cockie_address);
        assert!(live, 1);
        assert!(health == DEFAULT_BEGINNING_HEALTH - 3, 2)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = ECOCKIE_NOT_EXIST, location = cockfight::game)]
    fun test_cannot_move_when_cockie_not_exist(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie {
        setup_test(fx, account, creator);
        let creator_address = address_of(creator);
        make_random_move(creator_address)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = EDEAD_COCKIE_CANNOT_MOVE, location = cockfight::game)]
    fun test_cannot_move_dead_cockie(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        // Initial health is 5, so we make 5 random moves to decrease health to 0 and kill the Cockie
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        make_random_move(cockie_address);
        // Cockie is dead now, so it throws dead cockie cannot move error
        make_random_move(cockie_address)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = EALREADY_COMMITTED, location = cockfight::game)]
    fun test_cannot_commit_randomness_twice(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability, RandomnessCommitmentExt {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        make_random_move_commit(cockie_address);
        make_random_move_commit(cockie_address)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = ERANDOMNESS_COMMITMENT_NOT_EXIST, location = cockfight::game)]
    fun test_cannot_reveal_without_commit_first(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability, RandomnessCommitmentExt {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        make_random_move_reveal(cockie_address)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = EALREADY_REVEALED, location = cockfight::game)]
    fun test_cannot_reveal_twice(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability, RandomnessCommitmentExt {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        make_random_move_commit(cockie_address);
        make_random_move_reveal(cockie_address);
        // Reveal twice should throw error cause it's already revealed
        make_random_move_reveal(cockie_address)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    fun test_commit_and_reveal_move_happy_path(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Cockie, CollectionCapability, RandomnessCommitmentExt {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        make_random_move_commit(cockie_address);
        make_random_move_reveal(cockie_address);
        make_random_move_commit(cockie_address);
        make_random_move_reveal(cockie_address);
        let (live, health) = get_cockie(cockie_address);
        assert!(live, 1);
        assert!(health == DEFAULT_BEGINNING_HEALTH - 2, 2)
    }
}