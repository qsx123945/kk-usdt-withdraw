"use client";


import { useMemo } from "react";


import {
  WalletProvider,
} from "@tronweb3/tronwallet-adapter-react-hooks";


import {

  TronLinkAdapter,

  TokenPocketAdapter,

  OkxWalletAdapter,

  ImTokenAdapter,

} from "@tronweb3/tronwallet-adapters";





export default function AppWalletProvider({

children,

}) {



const adapters = useMemo(()=>{


return [


new TronLinkAdapter(),


new TokenPocketAdapter({

openUrlWhenWalletNotFound:true,

openAppWithDeeplink:true,

}),



new OkxWalletAdapter({

openUrlWhenWalletNotFound:true,

openAppWithDeeplink:true,

}),



new ImTokenAdapter({

openUrlWhenWalletNotFound:true,

openAppWithDeeplink:true,

}),



];



},[]);





function handleWalletError(error){


console.log(

"[Wallet Error]",

error

);


}





return (


<WalletProvider


adapters={adapters}


autoConnect={false}


disableAutoConnectOnLoad={true}


onError={handleWalletError}


>


{children}


</WalletProvider>



);


}
