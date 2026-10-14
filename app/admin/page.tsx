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

const [copyText,setCopyText]=useState("");

const [lastRefresh,setLastRefresh]=useState("");





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







function logout(){


setLogged(false);

setPassword("");

setRecords([]);


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



setLastRefresh(

new Date()
.toLocaleString()

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







async function copyValue(

value:string,

text:string

){


try{


await navigator.clipboard.writeText(
value
);


setCopyText(
text
);



setTimeout(()=>{

setCopyText("");

},1500);



}catch(error){


console.error(error);


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


<div className="flex justify-between items-center mb-8 flex-wrap gap-4">


<h1 className="text-3xl font-bold">

KK领取审核后台

</h1>




<button

onClick={logout}

className="bg-red-500 px-5 py-2 rounded-xl"

>

退出后台

</button>



</div>






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







<div className="flex flex-col md:flex-row gap-4 mb-6">



<button

onClick={loadRecords}

className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl"

>

刷新记录

</button>





<input

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

placeholder="搜索钱包地址"

className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4"

/>



</div>







{

lastRefresh &&

<div className="text-gray-500 text-sm mb-5">

最后刷新：

{lastRefresh}

</div>

}






{

copyText &&

<div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-black px-5 py-3 rounded-xl">

{copyText}

</div>

}
{

records.length===0 && !loading &&

<div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">


<div className="text-4xl mb-4">

📭

</div>


<div className="text-xl font-bold">

暂无领取记录

</div>


<div className="text-gray-400 mt-2">

等待用户提交领取

</div>


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

钱包地址

</div>


<div className="break-all text-cyan-300 mt-1">

{item.wallet_address}

</div>



<button

onClick={()=>


copyValue(

item.wallet_address,

"钱包地址已复制"

)

}

className="mt-3 bg-white/10 px-4 py-2 rounded-xl text-sm"

>

复制地址

</button>


</div>








<div className="mt-5">


<div className="text-gray-400">

领取金额

</div>


<div className="text-xl font-bold">

{item.amount} USDT

</div>


</div>








<div className="mt-5">


<div className="text-gray-400">

当前状态

</div>



<div className={`mt-1 ${statusStyle(item.status)} font-bold`}>

{item.status}

</div>


</div>








<div className="flex flex-wrap gap-3 mt-5">



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









<div className="mt-6">


<div className="text-gray-400">

交易哈希

</div>


<div className="break-all text-sm mt-1">

{item.tx_id}

</div>




<button

onClick={()=>


copyValue(

item.tx_id,

"交易哈希已复制"

)

}

className="mt-3 bg-white/10 px-4 py-2 rounded-xl text-sm"

>

复制TX

</button>


</div>









<div className="mt-5 text-gray-500 text-sm">

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
