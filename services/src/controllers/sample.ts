import { type RequestHandler } from 'express'

import { SampleModel } from '../models/sample'

const samples: SampleModel[] = []

export const createSampleController: RequestHandler = (req, res, next) => {
  const newSample = new SampleModel(Math.random().toString(), req.body.name)
  samples.push(newSample)

  res.status(201).json({ message: 'Sample created', sample: newSample })
}

export const getSamplesController: RequestHandler = (req, res, next) => {
  res.status(200).json({ samples })
}

export const updateSampleController: RequestHandler<{ id: string }> = (req, res, next) => {
  const sampleId = req.params.id
  const sampleIndex = samples.findIndex(sample => sample.id === sampleId)

  if (sampleIndex < 0) {
    throw new Error('Sample not found')
  }

  samples[sampleIndex] = new SampleModel(samples[sampleIndex].id, req.body.name)

  res.status(200).json({ message: 'Sample updated', sample: samples[sampleIndex] })
}

export const deleteSampleController: RequestHandler<{ id: string }> = (req, res, next) => {
  const sampleId = req.params.id
  const sampleIndex = samples.findIndex(sample => sample.id === sampleId)

  if (sampleIndex < 0) {
    throw new Error('Sample not found')
  }

  samples.splice(sampleIndex, 1)

  res.status(200).json({ message: 'Sample deleted' })
}
