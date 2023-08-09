import { Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'

interface IProps extends ButtonProps {}
function ConnectWallet({...props}: IProps) {
  return (
    <Button variant="primary" {...props}>Connect wallet</Button>
  )
}

export default ConnectWallet