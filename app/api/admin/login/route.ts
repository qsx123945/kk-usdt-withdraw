import { NextResponse } from "next/server";



const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD || "kkadmin123";





export async function POST(
request:Request
){


try{


const body =
await request.json();



const password =
body.password;




if(
password !== ADMIN_PASSWORD
){


return NextResponse.json(

{

success:false,

message:"密码错误"

},

{

status:401

}

);


}





const response =
NextResponse.json({

success:true

});





response.cookies.set(

"kk_admin_auth",

"authenticated",

{

httpOnly:true,

secure:true,

sameSite:"strict",

maxAge:60*60*24

}

);





return response;





}catch(error){



return NextResponse.json(

{

success:false,

message:"服务器错误"

},

{

status:500

}

);


}



}