import { DB } from 'anondb'
import { User } from '../../src/types'
import { Synchronizer, UserState } from '@unirep/core'
import { Identity } from '@semaphore-protocol/identity'
import { ethers } from 'ethers'
import { Prover } from '@unirep/circuits'

export class UserStateFactory {
    db: DB
    provider: ethers.providers.JsonRpcProvider
    prover: Prover
    unirepAddress: string
    attesterId: string
    synchronizer: Synchronizer

    constructor(
        db: DB,
        provider: ethers.providers.JsonRpcProvider,
        prover: Prover,
        unirepAddress: ethers.Contract,
        attesterId: ethers.Contract,
        synchronizer: Synchronizer
    ) {
        this.db = db
        this.provider = provider
        this.prover = prover
        this.unirepAddress = unirepAddress.address
        this.attesterId = attesterId.address
        this.synchronizer = synchronizer
    }

    async createUserState(
        user: User,
        wallet?: ethers.Wallet,
        requireSync: boolean = true
    ) {
        let signature = user.signMsg
        if (wallet) {
            signature = await wallet.signMessage(user.hashUserId)
        }
        const identity = new Identity(signature)
        const sync = requireSync ? this.synchronizer : undefined

        return new UserState({
            db: this.db,
            provider: this.provider,
            prover: this.prover,
            unirepAddress: this.unirepAddress,
            attesterId: BigInt(this.attesterId),
            id: identity,
            synchronizer: sync,
        })
    }

    async initUserState(userState: UserState) {
        await userState.start()
        await userState.waitForSync()
    }

    async genProof(userState: UserState) {
        const signupProof = await userState.genUserSignUpProof()
        const publicSignals = signupProof.publicSignals.map((n) => n.toString())
        return { signupProof, publicSignals }
    }
}
