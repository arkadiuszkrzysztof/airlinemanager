import React, { useState, type ReactElement } from 'react'
import { type Contract } from '../../models/Contract'
import { Regions } from '../../models/Airport'
import { type ContractOption } from '../../controllers/ContractsController'
import { AirlineController } from '../../controllers/AirlineController'
import { Col, Row } from 'react-bootstrap'

interface Props {
  items: Array<{ contract: Contract, options: ContractOption[] }>
  filter: (items: Array<{ contract: Contract, options: ContractOption[] }>) => void
}

const ContractsFilter: React.FC<Props> = ({ items, filter }): ReactElement => {
  const [region, setRegion] = useState('')

  const handleFilter = (key: string): void => {
    if (AirlineController.getInstance().unlockedRegions.includes(key)) {
      setRegion(key)
      filter(items.filter((item) => item.contract.hub.region === key))
    }
  }

  const getCountForRegion = (key: string): number => {
    return items.filter((item) => item.contract.hub.region === key && item.options.length > 0).length
  }

  return (
    <Row className='my-2 text-center justify-content-center'>
      {Object.keys(Regions).map((key) => (
        <Col xs={'auto'} key={key}>
          <div className='position-relative' style={{ width: '50px' }}>
            <img
              src={`/images/region-${key.toLocaleLowerCase()}.png`}
              alt={Regions[key as keyof typeof Regions]}
              className={`rounded mx-2 ${AirlineController.getInstance().unlockedRegions.includes(key) ? 'cursor-pointer' : 'grayscale opacity-50'} ${region === key ? 'border border-2 border-primary' : ''}`}
              style={{ maxWidth: '50px' }}
              onClick={() => { handleFilter(key) }} />
              {getCountForRegion(key) > 0 && <span className='position-absolute bg-warning rounded-circle text-white fw-bold px-2' style={{ bottom: '-5px', right: '-15px' }}>
                {getCountForRegion(key)}
              </span>}
            </div>
        </Col>
      ))}
    </Row>
  )
}

export default ContractsFilter
