module cockfight::game {
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::ExtendRef;
    use aptos_framework::randomness;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;

    use aptos_std::string_utils::{to_string};
    use aptos_std::table;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    use std::option;
    use std::vector;
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
    const EUNAUTHORIZED: u64 = 6;
    const EINVALID_STAGE: u64 = 7;
    const ENOT_SUFFICIENT_EGGS: u64 = 8;
    const EINVALID_TICKET: u64 = 9;
    const EINSUFFICIENT_BALANCE: u64 = 10;

    const APP_OBJECT_SEED: vector<u8> = b"COCKIE";
    const COCKIE_COLLECTION_NAME: vector<u8> = b"Cockie Collection";
    const COCKIE_COLLECTION_DESCRIPTION: vector<u8> = b"Cockie Collection Description";
    const COCKIE_COLLECTION_URI: vector<u8> = b"https://raw.githubusercontent.com/grass-coder/cockfight-aptos/refs/heads/main/frontend/src/images/cockie/cockie1.png";
    
    const DEFAULT_COCKIE_PRICE: u64 = 100_000; // 100_000 oct = 1 Aptocockie
    const DEFAULT_BETTING_RANGE: u64 = 4;
    const DEFAULT_FUNDING_EGGS_PER_COCKIE: u64 = 5;

    // Body value range is [0, 5)
    const BODY_MAX_VALUE_EXCL: u8 = 5;
    // Ear value range is [0, 6)
    const EAR_MAX_VALUE_EXCL: u8 = 6;
    // Face value range is [0, 4)
    const FACE_MAX_VALUE_EXCL: u8 = 4;

    struct ModuleStore has key {
        stage: u64,
        users: vector<address>,
        cockie_owner: table::Table<address, CockieOwnerInfo>,
    }

    struct CockieOwnerInfo has store {
        eggs: u64,
        cockie_addresses: vector<address>,
    }

    struct Cockie has key {
        live: bool,
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
        
        move_to(account, ModuleStore {
            stage: 0,
            users: vector[],
            cockie_owner: table::new<address, CockieOwnerInfo>()
        })
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
    entry fun create_cockie(user: &signer) acquires CollectionCapability, ModuleStore {
        create_cockie_internal(user);
    }

    entry fun fund_eggs(deployer: &signer, stage: u64) acquires ModuleStore {
        assert!(address_of(deployer) == @cockfight, EUNAUTHORIZED);
        let module_store = borrow_global_mut<ModuleStore>(@cockfight);
        
        assert!(module_store.stage + 1 == stage, EINVALID_STAGE);
        module_store.stage = stage;
        
        vector::for_each(module_store.users, |user| {
            let cockie_owner_info = table::borrow_mut(&mut module_store.cockie_owner, user);
            cockie_owner_info.eggs = cockie_owner_info.eggs + DEFAULT_FUNDING_EGGS_PER_COCKIE * vector::length(&cockie_owner_info.cockie_addresses);
        })
    }

    fun create_cockie_internal(user: &signer): address acquires CollectionCapability, ModuleStore {
        assert!(coin::balance<AptosCoin>(address_of(user)) >= DEFAULT_COCKIE_PRICE, EINSUFFICIENT_BALANCE);
        coin::transfer<AptosCoin>(user, @cockfight, DEFAULT_COCKIE_PRICE);

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
            extend_ref,
            mutator_ref,
            burn_ref,
        };
        move_to(token_signer_ref, cockie);

        let module_store = borrow_global_mut<ModuleStore>(@cockfight);
        if (table::contains(&module_store.cockie_owner, user_address)) {
            let cockie_owner_info = table::borrow_mut(&mut module_store.cockie_owner, user_address);
            vector::push_back(&mut cockie_owner_info.cockie_addresses, cockie_address);
        } else {
            table::add(&mut module_store.cockie_owner, user_address, CockieOwnerInfo {
                eggs: 0,
                cockie_addresses: vector[cockie_address],
            });
            vector::push_back(&mut module_store.users, user_address);
        };
        
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

    fun check_cockie_exist(user: address) acquires ModuleStore {
        let module_store = borrow_global<ModuleStore>(@cockfight);
        assert!(table::contains(&module_store.cockie_owner, user), ECOCKIE_NOT_EXIST);
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

    #[randomness]
    entry fun make_random_betting(
        user: &signer,
        ticket: u64
    ) acquires ModuleStore {        
        let user_address = address_of(user);
        check_cockie_exist(user_address);

        let module_store = borrow_global_mut<ModuleStore>(@cockfight);
        let cockie_owner_info = table::borrow_mut(&mut module_store.cockie_owner, user_address);
        assert!(cockie_owner_info.eggs >= ticket, ENOT_SUFFICIENT_EGGS);
        assert!(ticket > 0, EINVALID_TICKET);
        cockie_owner_info.eggs = cockie_owner_info.eggs - ticket;

        let random_value = randomness::u64_range(0, DEFAULT_BETTING_RANGE);
        if (random_value == 0) {
            cockie_owner_info.eggs = cockie_owner_info.eggs + ticket * DEFAULT_BETTING_RANGE;
        }
    }

    // Get collection name of cockie collection
    #[view]
    public fun get_cockie_collection_name(): (String) {
        utf8(COCKIE_COLLECTION_NAME)
    }

    #[view]
    public fun get_cockie_owner_info(user: address): (u64, vector<address>) acquires ModuleStore {
        let module_store = borrow_global<ModuleStore>(@cockfight);
        if (!table::contains(&module_store.cockie_owner, user)) {
            return (0, vector::empty<address>())
        };
        let cockie_owner_info = table::borrow(&module_store.cockie_owner, user);
        (cockie_owner_info.eggs, cockie_owner_info.cockie_addresses)
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
    public fun get_cockie(cockie_address: address): (bool) acquires Cockie {
        let cockie = borrow_global<Cockie>(cockie_address);
        (cockie.live)
    }



    // ==== TESTS ====
    // Setup testing environment
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use aptos_std::crypto_algebra::enable_cryptography_algebra_natives;
    #[test_only]
    use aptos_framework::aptos_coin::mint_apt_fa_for_test;
    #[test_only]
    use aptos_framework::primary_fungible_store;


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

        primary_fungible_store::deposit(address_of(creator), mint_apt_fa_for_test(DEFAULT_COCKIE_PRICE));
        primary_fungible_store::deposit(address_of(account), mint_apt_fa_for_test(DEFAULT_COCKIE_PRICE));
        coin::register<AptosCoin>(account);
        coin::register<AptosCoin>(creator);

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
    ) acquires CollectionCapability, Cockie, ModuleStore {
        setup_test(fx, account, creator);
        let cockie_address = create_cockie_internal(creator);
        let (live) = get_cockie(cockie_address);
        assert!(live, 1);
        let (eggs, cockie_addresses) = get_cockie_owner_info(address_of(creator));
        assert!(eggs == 0, 1);
        assert!(vector::length(&cockie_addresses) == 1, 1);

        let (eggs, cockie_addresses) = get_cockie_owner_info(address_of(account));
        assert!(eggs == 0, 1);
        assert!(vector::length(&cockie_addresses) == 0, 1);
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    fun T_make_random_betting(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, ModuleStore {
        setup_test(fx, account, creator);
        
        create_cockie_internal(creator);
        fund_eggs(account, 1);
        make_random_betting(creator, 1);
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = EINSUFFICIENT_BALANCE, location = cockfight::game)]
    fun test_cannot_create_cockie_not_sufficient_balance(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, ModuleStore {
        setup_test(fx, account, creator);
        create_cockie_internal(creator);
        create_cockie_internal(creator);
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = ECOCKIE_NOT_EXIST, location = cockfight::game)]
    fun test_cannot_make_random_betting_when_no_cockie(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires ModuleStore {
        setup_test(fx, account, creator);
        make_random_betting(creator, 0)
    }

    #[test(
        fx = @aptos_framework,
        account = @cockfight,
        creator = @0x123
    )]
    #[expected_failure(abort_code = EINVALID_STAGE, location = cockfight::game)]
    fun test_cannot_fund_eggs_invalid_stage(
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires ModuleStore {
        setup_test(fx, account, creator);
        fund_eggs(account, 0);
    }
}