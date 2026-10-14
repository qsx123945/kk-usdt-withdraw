import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

);



export async function POST(
  request: Request
) {


  try {


    const body =
      await request.json();



    const {

      address,

      amount,

      txId,

      time

    } = body;



    if(
      !address ||
      !amount ||
      !txId
    ){

      return NextResponse.json(

        {

          success:false,

          message:"参数不完整"

        },

        {
          status:400
        }

      );

    }



    /*
      防止重复保存同一笔交易
    */

    const {
      data: existing
    } =
      await supabase

      .from("claim_records")

      .select("id")

      .eq(
        "tx_id",
        txId
      )

      .maybeSingle();



    if(existing){


      return NextResponse.json(

        {

          success:false,

          message:"该交易已经记录"

        }

      );


    }





    /*
      写入数据库
    */


    const {
      error
    } =
      await supabase

      .from("claim_records")

      .insert({

        wallet_address:
          address,


        amount:
          String(amount),


        tx_id:
          txId,


        status:
          "pending",


        created_at:
          time ||
          new Date()
          .toISOString()

      });




    if(error){


      console.error(
        "Supabase insert error",
        error
      );


      return NextResponse.json(

        {

          success:false,

          message:"数据库保存失败"

        },

        {
          status:500
        }

      );


    }




    return NextResponse.json(

      {

        success:true,

        message:"保存成功"

      }

    );




  }catch(error){


    console.error(
      "Claim API Error",
      error
    );


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
