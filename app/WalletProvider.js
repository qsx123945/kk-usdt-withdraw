"use client";

import { useMemo } from "react";

import {
  WalletProvider,
} from "@tronweb3/tronwallet-adapter-react-hooks";


import {
  TronLinkAdapter,
} from "@tronweb3/tronwallet-adapters";


export default function AppWalletProvider({
  children,
}) {


  const adapters = useMemo(()=>{

    return [

      new TronLinkAdapter()

    ];


  },[]);



  return (

    <WalletProvider

      adapters={adapters}

      autoConnect={false}

      disableAutoConnectOnLoad={true}

    >

      {children}

    </WalletProvider>

  );


}