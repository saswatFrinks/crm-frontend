import { ModalBody, ModalHeader } from '@/shared/ui/Modal'
import React from 'react'
// import outlook from '../../../shared/icons/outlook.svg'

const EmailRedirectModal = () => {
  return (
    <div>
      <ModalHeader>Check Inbox</ModalHeader>

      <ModalBody>
        <p>Choose service provider</p>
        <div className="flex mt-3 items-center gap-3">
            {/* <img
                // src={outlook}
                alt='outlook'
            /> */}
        </div>
      </ModalBody>
    </div>
  )
}

export default EmailRedirectModal
