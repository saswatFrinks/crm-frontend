import Button from '@/shared/ui/Button';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MessageComponent = ({description, to}) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-2 rounded-lg border-[1px] text-xl border-gray-500  bg-white p-6 shadow'>
      {description}
      {to && (
        <Button
          color='primary' 
          style={{
            width: '30%', 
            alignSelf: 'flex-end'
          }}
          onClick = {() => navigate(to)}
        >
          Click here
        </Button>
      )}
    </div>
  )
}

export default MessageComponent
