import React from 'react'
import { ModalBody, ModalHeader } from './Modal'
import Button from './Button'
import { useRecoilState } from 'recoil'
import { modalAtom } from '../states/modal.state'

const ErrorModal = ({error}) => {
  const [open, setOpen] = useRecoilState(modalAtom);

  return (
    <>
      <ModalHeader>Error</ModalHeader>
      <ModalBody>
        <div className="text-red-500">{error}</div>
        <div className='text-right mt-2'>
          <Button 
            color='primary'
            fullWidth={false}
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </ModalBody>
    </>
  )
}

export default ErrorModal
