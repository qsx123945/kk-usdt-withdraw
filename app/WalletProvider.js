"use client";

import { useEffect, useState } from "react";

import {
  WalletProvider
} from "@tronweb3/tronwallet-adapter-react-hooks";


import {
  TronLinkAdapter,
  TokenPocketAdapter
} from "@tronweb3/tronwallet-adapters";




export default function WalletProviderWrapper({
  children
}) {


  const [adapters,setAdapters] = useState([]);




  useEffect(()=>{


    const tronLink = new TronLinkAdapter();


    const tokenPocket = new TokenPocketAdapter({

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
