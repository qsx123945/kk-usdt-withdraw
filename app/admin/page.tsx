"use client";

import {
  useState
} from "react";


type ClaimRecord = {

  id:number;

  wallet_address:string;

  amount:string;

  tx_id:string;

  status:string;

  created_at:string;

};




export default function AdminPage(){


const [logged,setLogged]=useState(false);

const [password,setPassword]=useState("");

const [loginError,setLoginError]=useState("");

const [records,setRecords]=useState<ClaimRecord[]>([]);

const [loading,setLoading]=useState(false);

const [search,setSearch]=useState("");





async function login(){


try{


const res =
await fetch(
"/api/admin/login",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

password

})

}

);



const data =
await res.json();



if(data.success){

setLogged(true);

loadRecords();


}else{


setLoginError(
"密码错误"
);


}



}catch{


setLoginError(
"登录失败"
);


}



}







async function loadRecords(){


setLoading(true);


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
error
);



}finally{


setLoading(false);


}



}






async function updateStatus(

id:number,

status:string

){


try{


await fetch(

"/api/admin/update-status",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

id,

status

})

}

);


loadRecords();



}catch(error){


console.error(
error
);


}


}




function statusStyle(

status:string

){


if(status==="completed")

return "text-green-400";


if(status==="failed")

return "text-red-400";


if(status==="reviewing")

return "text-blue-400";


return "text-yellow-400";


}





const filteredRecords =

records.filter((item)=>

item.wallet_address

.toLowerCase()

.includes(

search.toLowerCase()

)

);
if(!logged){


return (

<div className="min-h-screen bg-[#030817] text-white flex items-center justify-center p-6">


<div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">


<h1 className="text-2xl font-bold text-center mb-8">

KK 管理后台

</h1>




<input

type="password"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

placeholder="请输入管理员密码"

className="w-full bg-black/20 border border-white/10 rounded-xl p-4"

/>





<button

onClick={login}

className="mt-5 w-full bg-cyan-400 text-black font-bold rounded-xl py-4"

>

进入后台

</button>





{

loginError &&

<div className="text-red-400 text-center mt-4">

{loginError}

</div>

}



</div>


</div>

);


}







return (

<div className="min-h-screen bg-[#030817] text-white p-6">


<h1 className="text-3xl font-bold mb-8">

KK领取审核后台

</h1>





<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">



<div className="bg-white/5 border border-white/10 rounded-2xl p-4">


<div className="text-gray-400 text-sm">

总订单

</div>


<div className="text-2xl font-bold">

{records.length}

</div>


</div>





<div className="bg-white/5 border border-white/10 rounded-2xl p-4">


<div className="text-gray-400 text-sm">

待审核

</div>


<div className="text-2xl font-bold text-yellow-400">

{

records.filter(

(item)=>

item.status==="pending"

).length

}

</div>


</div>





<div className="bg-white/5 border border-white/10 rounded-2xl p-4">


<div className="text-gray-400 text-sm">

审核中

</div>


<div className="text-2xl font-bold text-blue-400">

{

records.filter(

(item)=>

item.status==="reviewing"

).length

}

</div>


</div>





<div className="bg-white/5 border border-white/10 rounded-2xl p-4">


<div className="text-gray-400 text-sm">

完成

</div>


<div className="text-2xl font-bold text-green-400">

{

records.filter(

(item)=>

item.status==="completed"

).length

}

</div>


</div>



</div>





<button

onClick={loadRecords}

className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl mb-5"

>

刷新记录

</button>






<input

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

placeholder="搜索钱包地址"

className="w-full mb-8 bg-white/5 border border-white/10 rounded-xl p-4"

/>
{
loading &&

<div className="mb-5">

加载中...

</div>

}





<div className="space-y-5">


{

filteredRecords.map((item)=>(


<div

key={item.id}

className="bg-white/5 border border-white/10 rounded-2xl p-5"

>




<div>

<div className="text-gray-400">

钱包地址：

</div>


<div className="break-all text-cyan-300">

{item.wallet_address}

</div>


</div>






<div className="mt-4">


<span className="text-gray-400">

领取金额：

</span>


{item.amount} USDT


</div>






<div className="mt-4">


<span className="text-gray-400">

当前状态：

</span>


<span

className={`ml-2 ${statusStyle(item.status)}`}

>

{item.status}

</span>


</div>








<div className="flex gap-3 flex-wrap mt-5">



<button

onClick={()=>


updateStatus(

item.id,

"reviewing"

)


}

className="bg-blue-500 px-4 py-2 rounded-xl"

>

审核中

</button>






<button

onClick={()=>


updateStatus(

item.id,

"completed"

)


}

className="bg-green-500 px-4 py-2 rounded-xl"

>

完成

</button>






<button

onClick={()=>


updateStatus(

item.id,

"failed"

)


}

className="bg-red-500 px-4 py-2 rounded-xl"

>

失败

</button>



</div>








<div className="mt-5">


<div className="text-gray-400">

交易哈希：

</div>


<div className="break-all text-sm">

{item.tx_id}

</div>


</div>








<div className="mt-4 text-gray-500 text-sm">

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
