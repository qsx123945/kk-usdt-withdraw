import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";




const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

);





export async function GET(){


try{


const {

data,

error

} = await supabase

.from("claim_records")

.select("*")

.order(

"created_at",

{

ascending:false

}

);





if(error){


console.error(

"admin query error",

error

);


return NextResponse.json(

{

records:[],

error:"database error"

},

{

status:500

}

);


}






return NextResponse.json(

{

records:data || []

}

);



}catch(error){



console.error(

"admin api error",

error

);



return NextResponse.json(

{

records:[],

error:"server error"

},

{

status:500

}

);



}


}