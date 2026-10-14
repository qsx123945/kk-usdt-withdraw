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

    const body = await request.json();


    const {
      id,
      status
    } = body;



    if (!id || !status) {

      return NextResponse.json(
        {
          success: false,
          message: "参数错误"
        },
        {
          status: 400
        }
      );

    }



    const { error } = await supabase
      .from("claim_records")
      .update({
        status: status
      })
      .eq(
        "id",
        id
      );



    if (error) {

      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        {
          status: 500
        }
      );

    }



    return NextResponse.json(
      {
        success: true
      }
    );



  } catch (error) {


    return NextResponse.json(
      {
        success: false,
        message: "服务器错误"
      },
      {
        status: 500
      }
    );


  }

}