"use client";

import { useEffect, useState } from "react";

import {
  WalletProvider
} from "@tronweb3/tronwallet-adapter-react-hooks";

import {
  TronLinkAdapter
} from "@tronweb3/tronwallet-adapter-tronlink";

import {
  TokenPocketAdapter
} from "@tronweb3/tronwallet-adapter-token-pocket";



export default function WalletProviderWrapper({
  children
}) {


  const [wallets,setWallets] = useState(null);



  useEffect(()=>{


    async function initWallet(){


      const {

        TronLinkAdapter

      } = await import(
        "@tronweb3/tronwallet-adapter-tronlink"
      );



      const {

        TokenPocketAdapter

      } = await import(
        "@tronweb3/tronwallet-adapter-token-pocket"
      );



      setWallets([


        new TronLinkAdapter(),


        new TokenPocketAdapter({

          openUrlWhenWalletNotFound:true

        })


      ]);


    }



    initWallet();



  },[]);





  if(!wallets){

    return children;

  }





  return (

    <WalletProvider

      adapters={wallets}

      autoConnect={true}

    >

      {children}

    </WalletProvider>

  );


}
