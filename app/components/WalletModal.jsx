"use client";


import {
  useEffect,
  useRef,
} from "react";


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







// 找 TronLink Adapter


function findTronLink(){


return wallets.find((item)=>{


return item.adapter.name
.toLowerCase()
.includes("tronlink");


});


}







// 用户点击 TronLink


function handleClick(){



const target = findTronLink();



if(!target){


onError?.(
"没有找到 TronLink 钱包"
);


return;


}



select(
target.adapter.name
);



}









// select 完成以后 connect


useEffect(()=>{



if(!open){

return;

}



if(!wallet?.adapter?.name){

return;

}




if(
!wallet.adapter.name
.toLowerCase()
.includes("tronlink")
){

return;

}




if(connectingRef.current){

return;

}




connectingRef.current=true;



async function run(){



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



run();



},[

open,

wallet,

connect,

onError

]);









// 连接成功


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

使用安全方式连接您的TRON钱包

</p>








<button


onClick={handleClick}


disabled={connecting}



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
