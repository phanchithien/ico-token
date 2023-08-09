import { Button, HStack, Text, Image } from '@chakra-ui/react';
import React from 'react'
import { numberFormat, showSortAddress } from '../utils';

interface IProps {
    address?: string;
    amount: number;
}

function WalletInfo({address, amount}: IProps) {
  return (
    <Button variant="outline" ml="10px">
        <HStack>
            <Text>{showSortAddress(address)}</Text>
            <Image src='/bnb.png' w="25px" alt="bnb" ml="20px"></Image>
            <Text>{numberFormat(amount)}</Text>
        </HStack>
    </Button>
  )
}

export default WalletInfo