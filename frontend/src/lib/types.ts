interface CockieEntity {
    id: string
    owner: string
    type: string
    base_coin: string
    decimal: number
    price: string
    apy: number
    last_yield_time: string
    release_time: string
    create_time: string
}

export interface User {
    address: string
    egg: number
    cockies: CockieEntity[]
}