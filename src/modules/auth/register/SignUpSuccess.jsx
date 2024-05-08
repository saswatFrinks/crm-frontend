import Button from '@/shared/ui/Button'
import { ModalBody, ModalHeader } from '@/shared/ui/Modal'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const SignUpSuccess = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ModalHeader>Check your Email to Activate Account</ModalHeader>

      <ModalBody>
        <div className="flex flex-row-reverse">
          <Button fullWidth={false} style={{padding: '0.5rem 1.5rem'}} color="flat" onClick={() => {navigate('/login')}}>
            Login
          </Button>
        </div>
      </ModalBody>
    </div>
  )
}

export default SignUpSuccess
