declare var window: any;
import { IPackage, IRate, IWalletInfo, TOKEN } from "@/src/_types_";
import { ConnectWallet, SuccessModal, WalletInfo } from "@/src/components";
import { packages } from "@/src/constants";
import { Flex, Heading, SimpleGrid, Spacer, useDisclosure } from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import InvestCard from "./components/InvestCard";
import CrowdSaleContract from "@/src/contracts/CrowdSaleContract";
import UsdtContract from "@/src/contracts/UsdtContract";

function InvestView() {
    const [wallet, setWallet] = React.useState<IWalletInfo>();
    const [rate, setRate] = React.useState<IRate>({bnbRate: 0, usdtRate: 0});
    const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
    const [pak, setPak] = React.useState<IPackage>();
    const [txHash, setTxHash] = React.useState<string>();
    const {isOpen, onClose, onOpen} = useDisclosure();

    const [web3Provider, setWeb3Provider] = React.useState<ethers.providers.Web3Provider>();

    const getRate = React.useCallback(async () => {
        const crowdContract = new CrowdSaleContract();
        const bnbRate = await crowdContract.getBnbRate();
        const usdtRate = await crowdContract.getUsdtRate();

        setRate({bnbRate, usdtRate});
    }, []);

    React.useEffect(() => {
        getRate();
    }, [getRate]);

    const onConnectMetamask = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const bigBalance = await provider.getBalance(address);
            const bnbBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));
            setWallet({address, bnb: bnbBalance});
            setWeb3Provider(provider);
        }
        console.log(wallet);
    }

    const handleBuyIco = async (pk: IPackage) => {
        if(!web3Provider) return;
        setPak(pk);
        setIsProcessing(true);

        let hash ='';
        const crowdContract = new CrowdSaleContract(web3Provider);
        if (pk.token === TOKEN.USDT) {
            const usdtContract = new UsdtContract(web3Provider);
            await usdtContract.appove(crowdContract._contractAddress, pk.amount / rate.usdtRate);
            hash = await crowdContract.buyTokenByUSDT(pk.amount)
        } else {
            hash = await crowdContract.buyTokenByBnB(pk.amount);
        }
        setTxHash(hash);
        onOpen();
        try {
            
        } catch (er: any) {

        }
        setPak(undefined);
        setIsProcessing(false);
    }

    return (
        <Flex
            w={{ base: "full", lg: "70%" }}
            flexDirection="column"
            margin="50px auto"
        >
            <Flex>
                <Heading size="lg" fontWeight="bold">
                    BlockChain Trainee
                </Heading>
                <Spacer />
                {!wallet && <ConnectWallet onClick={onConnectMetamask} />}
                {wallet && <WalletInfo
                    address={wallet?.address}
                    amount={wallet?.bnb || 0}
                />}
            </Flex>
            
            <SimpleGrid columns={{base: 1, lg: 3}} mt="50px" spacingY="20px">
                {packages.map((pk, index) => (<InvestCard
                    pak={pk}
                    key={String(index)}
                    isBuying={isProcessing && pak?.key === pk.key}
                    rate={pk.token === TOKEN.BNB ? rate.bnbRate : rate.usdtRate}
                    walletInfo={wallet}
                    onBuy={() => handleBuyIco(pk)}
                />))}
            </SimpleGrid>

            <SuccessModal
                isOpen={isOpen}
                onClose={onClose}
                hash={txHash}
                title="BUY ICO"
            />
        </Flex>
    )
}

export default InvestView