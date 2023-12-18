import React, { type ReactElement } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { QuestionCircle } from 'react-bootstrap-icons'

const RefreshHint: React.FC<{ timeTo: string, realTimeTo: string }> = ({ timeTo, realTimeTo }): ReactElement => {
  return (
    <span className='d-flex align-items-center'>
      Refresh in {timeTo}
      <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>In real time:</strong><br />{realTimeTo}</Tooltip>}>
        <QuestionCircle size={16} className='ms-2 text-primary cursor-help' />
      </OverlayTrigger>
    </span>
  )
}

export default RefreshHint
