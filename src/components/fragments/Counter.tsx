import React, { type ReactElement } from 'react'

const Counter: React.FC<{ count: number }> = ({ count }): ReactElement => {
  return (
    <div className='position-absolute bg-info rounded-circle overflow-hidden' style={{ bottom: '-5px', right: '-10px', width: '24px', height: '24px' }}>
      <div className={'text-white text-center fw-bold'} style={{ width: '40px', marginLeft: '-8px' }}>
        {count > 99 ? '...' : count}
      </div>
    </div>
  )
}

export default Counter
