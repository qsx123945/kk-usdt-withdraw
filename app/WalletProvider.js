"use client";

import { useState, useEffect } from "react";

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


  const [adapters,setAdapters] = useState([]);



  useEffect(()=>{


    const tronLink =
      new TronLinkAdapter();



    const tokenPocket =
      new TokenPocketAdapter({

        openUrlWhenWalletNotFound:true

      });



    setAdapters([
      tronLink,
      tokenPocket
    ]);



  },[]);





  if(adapters.length===0){

    return (
      <>
        {children}
      </>
    );

  }





  return (

    <WalletProvider
      adapters={adapters}
      autoConnect={true}
    >

      {children}

    </WalletProvider>

  );


}
