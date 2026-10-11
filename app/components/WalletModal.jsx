"use client";


import { useEffect, useRef } from "react";


import {
  useWallet,
} from "@tronweb3/tronwallet-adapter-react-hooks";





export default function WalletModal({

  open,

  onClose,

  onConnected,

  onError,

}) {



const {


wallets,

wallet,

address,

connected,

connecting,

select,

connect,


}=useWallet();





const connectingRef = useRef(false);







const tronWallet = wallets.find((item)=>{


return item.adapter.name
.toLowerCase()
.includes("tronlink");


});









function chooseTronLink(){



if(!tronWallet){


onError?.(
"没有找到 TronLink 钱包"
);


return;


}



select(
tronWallet.adapter.name
);



}










useEffect(()=>{



if(!open){

return;

}



if(
!wallet?.adapter?.name
){

return;

}



if(
connectingRef.current
){

return;

}





if(
wallet.adapter.name
.toLowerCase()
.includes("tronlink")
){



connectingRef.current=true;



async function startConnect(){


try{


await connect();



}catch(error){


console.log(error);


onError?.(
"钱包连接失败"
);


}finally{


connectingRef.current=false;


}



}



startConnect();



}



},[

open,

wallet,

connect,

onError

]);









useEffect(()=>{


if(
connected &&
address
){



onConnected?.({

address,

walletName:
wallet?.adapter?.name

});



onClose?.();


}



},[

connected,

address,

wallet,

onConnected,

onClose

]);







if(!open){


return null;


}









return (



<div className="fixed inset-0 bg-black/70 flex items-center justify-center px-6 z-50">



<div className="bg-[#101936] rounded-3xl p-8 w-full max-w-sm text-center border border-white/10">





<img

src="/tronlink-global.png"

className="w-24 h-24 mx-auto rounded-2xl"

/>







<h2 className="text-2xl font-bold mt-6">

连接 TronLink 钱包

</h2>






<p className="text-gray-400 mt-4">

请选择连接您的TRON钱包

</p>








<button


disabled={connecting}


onClick={chooseTronLink}


className="mt-8 w-full rounded-2xl py-5 bg-gradient-to-r from-cyan-300 to-blue-400 text-black font-bold"



>



{

connecting

?

"正在连接..."

:

"连接 TronLink 钱包"

}



</button>








<button

onClick={onClose}

className="mt-5 text-gray-400"

>


取消


</button>







</div>



</div>



);



}
