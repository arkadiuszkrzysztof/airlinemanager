import { Router } from 'express'

import { createSampleController, getSamplesController, updateSampleController, deleteSampleController } from '../controllers/sample'

const router = Router()

router.post('/', createSampleController)

router.get('/', getSamplesController)

router.patch('/:id', updateSampleController)

router.delete('/:id', deleteSampleController)

export default router
