import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, message: "服务器配置错误" }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: "地址不能为空" }, { status: 400 });
    }

    const { error } = await supabase
      .from("claim_records")
      .insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("insert error", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("api error", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
