"use client";


import { useEffect, useState } from "react";



type ClaimRecord = {

  id:number;

  wallet_address:string;

  amount:string;

  tx_id:string;

  status:string;

  created_at:string;

};





export default function AdminPage(){



const [records,setRecords]=useState<ClaimRecord[]>([]);

const [loading,setLoading]=useState(true);






async function loadRecords(){


try{


const res =
await fetch(
"/api/admin/claims"
);



const data =
await res.json();



setRecords(
data.records || []
);



}catch(error){


console.error(
"load admin error",
error
);



}finally{


setLoading(false);


}



}







useEffect(()=>{


loadRecords();


},[]);








return (


<div className="min-h-screen bg-[#030817] text-white p-6">


<h1 className="text-3xl font-bold mb-8">

KK领取记录后台

</h1>





{
loading &&

<div>

正在加载...

</div>

}





{
!loading &&
records.length===0 &&

<div className="text-gray-400">

暂无领取记录

</div>

}








<div className="space-y-5">


{

records.map((item)=>(


<div

key={item.id}

className="bg-white/5 border border-white/10 rounded-2xl p-5"


>


<div className="mb-3">

<span className="text-gray-400">

钱包地址：

</span>

<br/>

{item.wallet_address}


</div>





<div>

<span className="text-gray-400">

领取金额：

</span>

{item.amount} USDT


</div>





<div className="mt-3">


<span className="text-gray-400">

交易哈希：

</span>

<br/>

<div className="break-all text-sm">

{item.tx_id}

</div>


</div>





<div className="mt-3">


<span className="text-gray-400">

状态：

</span>

<span className="text-cyan-300">

{item.status}

</span>


</div>





<div className="mt-3 text-sm text-gray-500">


{

new Date(
item.created_at
)
.toLocaleString()

}


</div>



</div>



))


}


</div>





</div>


);


}