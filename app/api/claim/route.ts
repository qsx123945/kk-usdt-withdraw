import { NextResponse } from "next/server";



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
      !txId
    ){


      return NextResponse.json(
        {

          success:false,

          message:"参数错误"

        },
        {
          status:400
        }
      );


    }






    console.log(
      "NEW CLAIM:",
      {

        address,

        amount,

        txId,

        time

      }
    );






    /*
    
    这里下一步接数据库
    
    目前先确认接口正常
    
    */







    return NextResponse.json(
      {

        success:true,

        message:"保存成功"

      }
    );





  }catch(error){


    console.error(
      "CLAIM API ERROR",
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