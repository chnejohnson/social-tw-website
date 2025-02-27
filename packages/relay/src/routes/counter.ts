import { DB } from 'anondb/node'
import { Express } from 'express'
import { errorHandler } from '../services/singletons/errorHandler'
import { UnirepSocialSynchronizer } from '../services/singletons/UnirepSocialSynchronizer'
import { EPOCHKEYS_AMOUNT } from '../config'
import { InternalError } from '../types/InternalError'
import { counterService } from '../services/CounterService'

export default (
    app: Express,
    db: DB,
    synchronizer: UnirepSocialSynchronizer
) => {
    app.get(
        '/api/counter',
        errorHandler(async (req, res, _) => {
            const epks =
                typeof req.query.epks === 'string'
                    ? req.query.epks.split('_')
                    : undefined
            // each user has 3 epoch keys during the epoch
            if (!epks || epks.length != EPOCHKEYS_AMOUNT) {
                throw new InternalError('wrong number of epks', 400)
            }

            const counter = await counterService.fetchActions(epks, db)

            res.json({ counter: counter })
        })
    )
}
