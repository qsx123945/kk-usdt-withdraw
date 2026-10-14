import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


export async function POST(
  request: Request
) {

  try {


    const supabaseUrl =
      process.env.SUPABASE_URL;


    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;



    if(
      !supabaseUrl ||
      !supabaseKey
    ){

      console.error(
        "Missing Supabase environment variables"
      );


      return NextResponse.json(
        {
          success:false,
          message:"服务器配置错误"
        },
        {
          status:500
        }
      );

    }



    const supabase =
      createClient(
        supabaseUrl,
        supabaseKey
      );



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




    const {
      data: existing,
      error: checkError
    } =
      await supabase

      .from("claim_records")

      .select("id")

      .eq(
        "tx_id",
        txId
      )

      .maybeSingle();



    if(checkError){

      console.error(
        "Supabase check error",
        checkError
      );

    }



    if(existing){

      return NextResponse.json(
        {
          success:false,
          message:"该交易已经记录"
        }
      );

    }





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
          message:error.message
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



  }catch(error:any){


    console.error(
      "Claim API Error",
      error
    );


    return NextResponse.json(
      {
        success:false,
        message:error.message || "服务器错误"
      },
      {
        status:500
      }
    );


  }

}
