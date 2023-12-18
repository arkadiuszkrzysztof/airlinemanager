import React, { type ReactElement, useEffect } from 'react'
import { type Contract } from '../../models/Contract'
import { Regions } from '../../models/Airport'
import { type ContractOption } from '../../controllers/ContractsController'
import { AirlineController } from '../../controllers/AirlineController'
import { Col, Row } from 'react-bootstrap'

interface Props {
  filter: string
  setFilter: (filter: string) => void
  items: Array<{ contract: Contract, options: ContractOption[] }>
  setFilteredItems: (items: Array<{ contract: Contract, options: ContractOption[] }>) => void
}

const WORLD = 'WORLD'
const ALL = 'ALL'

const ContractsFilter: React.FC<Props> = ({ filter: region, setFilter: setRegion, items, setFilteredItems }): ReactElement => {
  const handleFilter = (key: string): void => {
    if (key === ALL) {
      setRegion(key)
      setFilteredItems(items.filter((item) => item))
    } else if (AirlineController.getInstance().getTier().record.constraints.canFlyCrossRegion && key === WORLD) {
      setRegion(key)
      setFilteredItems(items.filter((item) => item.contract.hub.region !== item.contract.destination.region))
    } else if (AirlineController.getInstance().unlockedRegions.includes(key)) {
      setRegion(key)
      setFilteredItems(items.filter((item) => item.contract.hub.region === key && item.contract.destination.region === key))
    }
  }

  const getCountForRegion = (key: string): number => {
    if (key === ALL) {
      return items.filter((item) => item.options.length > 0).length
    } else if (AirlineController.getInstance().getTier().record.constraints.canFlyCrossRegion && key === WORLD) {
      return items.filter((item) => item.contract.hub.region !== item.contract.destination.region && item.options.length > 0).length
    } else {
      return items.filter((item) => item.contract.hub.region === key && item.contract.destination.region === key && item.options.length > 0).length
    }
  }

  useEffect(() => {
    if (region !== '') {
      handleFilter(region)
    } else {
      handleFilter(ALL)
    }
  }, [items])

  return (
    <Row className='my-2 text-center justify-content-center'>
      <Col xs={'auto'}>
        <div
          className={`position-relative d-flex justify-content-center align-items-center bg-secondary rounded fw-bold cursor-pointer  ${region === ALL ? 'border border-2 border-primary' : 'border border-2 border-secondary'}`}
          style={{ width: '50px', height: '50px', boxSizing: 'border-box' }}
          onClick={() => { handleFilter(ALL) }}>
          {getCountForRegion(ALL) > 0 && <span className={`position-absolute bg-info rounded-circle text-white fw-bold ${getCountForRegion(ALL) > 9 ? 'px-1' : 'px-2'}`} style={{ bottom: '-5px', right: '-10px' }}>
            {getCountForRegion(ALL)}
          </span>}
          ALL
        </div>
      </Col>
      <Col xs={'auto'}>
        <div className='position-relative' style={{ width: '100px' }}>
          <img
            src={'/images/region-world.png'}
            alt={'World'}
            className={`rounded ${AirlineController.getInstance().getTier().record.constraints.canFlyCrossRegion ? 'cursor-pointer' : 'grayscale opacity-50'} ${region === WORLD ? 'border border-2 border-primary' : ''}`}
            style={{ maxWidth: '100px' }}
            onClick={() => { handleFilter(WORLD) }} />
            {getCountForRegion(WORLD) > 0 && <span className={`position-absolute bg-info rounded-circle text-white fw-bold ${getCountForRegion(WORLD) > 9 ? 'px-1' : 'px-2'}`} style={{ bottom: '-5px', right: '-10px' }}>
              {getCountForRegion(WORLD)}
            </span>}
          </div>
      </Col>
      {Object.keys(Regions).map((key) => (
        <Col xs={'auto'} key={key}>
          <div className='position-relative' style={{ width: '50px' }}>
            <img
              src={`/images/region-${key.toLocaleLowerCase()}.png`}
              alt={Regions[key as keyof typeof Regions]}
              className={`rounded ${AirlineController.getInstance().unlockedRegions.includes(key) ? 'cursor-pointer' : 'grayscale opacity-50'} ${region === key ? 'border border-2 border-primary' : ''}`}
              style={{ maxWidth: '50px' }}
              onClick={() => { handleFilter(key) }} />
              {getCountForRegion(key) > 0 && <span className={`position-absolute bg-info rounded-circle text-white fw-bold ${getCountForRegion(key) > 9 ? 'px-1' : 'px-2'}`} style={{ bottom: '-5px', right: '-10px' }}>
                {getCountForRegion(key)}
              </span>}
            </div>
        </Col>
      ))}
    </Row>
  )
}

export default ContractsFilter
