import { useState } from “react”;

// ============================================================
// 副業診断データ
// ============================================================
const diagQuestions = [
{ id: “time”, label: “1日のどの時間を副業に充てられますか？”, hint: “例：平日朝1時間、帰宅後21〜22時など、絶対に邪魔されない時間を具体的に”, point: “ここで記した時間内は必ず副業に費やすこと。この時間を守れなかった瞬間、副業は失敗する。できるだけ多く確保しつつ、どんな日でも実行できる時間を選ぶのがポイント。”, type: “textarea” },
{ id: “reason”, label: “副業したい理由を簡潔に述べてください。”, hint: “本当に副業が必要か、自分自身が同意しているかを確認するための質問です”, point: “本当に副業が必要か、副業を始めることに自分自身が同意しているか？を問う質問。「なんとなく」ではなく、自分の言葉で言語化できていることが大切。”, type: “textarea” },
{ id: “halfWork”, label: “美容師の仕事を半分に減らせるとしたら、残りの半分でどんな仕事をして収入を得たいですか？5つ挙げてください。”, hint: “悩みすぎずに！あとで絞っていきます”, point: “書き出し作業。ここから絞っていくのであまり考え過ぎなくてOK。直感で出てきたものほど本音に近い。”, type: “textarea” },
{ id: “dream”, label: “上の5つ以外で、実現できるか分からないけどやってみたい副業はありますか？”, hint: “直感で答えてOK。夢と現実を分けるための質問です”, point: “それは本当に不可能なのか、具体的にどの辺が現実的でないかの最終確認。客観的に課題が見えることで方向性が明瞭になり、夢と現実の分別ができる。”, type: “textarea” },
{ id: “salonRatio”, label: “将来的にサロンワークを何割くらいに減らしたいですか？”, hint: “例：週3日・10時〜17時のみ など、なるべく具体的に”, point: “週何日出勤、○時〜○時まで勤務など、なるべく具体的に。数字が出るほど目標が現実味を帯びてくる。”, type: “textarea” },
{ id: “neverDo”, label: “これから仕事をやっていく上で、絶対にやりたくないことを教えてください。（複数でも可）”, hint: “わがままOK。客観的に判断してもらうための質問です”, point: “ただのわがままか、いますぐ決別した方がいいかを客観的に判断してもらうための質問。正直に書くほど精度が上がる。”, type: “textarea” },
{ id: “tenYears”, label: “10年後どんな暮らしをしていたいですか？”, hint: “イメージを言語化してみましょう”, point: “イメージを言語化する作業。「なんとなく豊かに」ではなく、具体的な場所・生活・時間の使い方まで書けると◎”, type: “textarea” },
{ id: “admire”, label: “尊敬している人や憧れの人を1人以上教えてください。”, hint: “プライバシー保護のためイニシャル推奨。できれば別ジャンルで2〜3人いると◎”, point: “誰でもOK。できれば1人＋別ジャンルで2人の計3人いると、診断の精度が上がる。”, type: “textarea” },
{ id: “dislike”, label: “嫌いな人や嫉妬している人を1人以上教えてください。”, hint: “パッと思い浮かんだ人を。「似ているが苦手」ではなく「嫉妬している」人が重要です”, point: “重要！パッと思い浮かんだ人を記入。「似ているが苦手な人」だと結果がズレるので、純粋に嫉妬している人を選ぶこと。”, type: “textarea” },
{ id: “admireService”, label: “憧れの人がオンラインでサービス販売を始めたら、どんなサービスだと思いますか？思いつく限り挙げてください。”, hint: “3個以上欲しいです。直感を大切に！”, point: “あとで絞るので3個以上欲しい。オンラインサービスは必ずしも有料とは限らない。分からない人は調べながらでもOK。でも直感を大事に。”, type: “textarea” },
{ id: “dislikeService”, label: “嫌いな人が同じサービスを売り始めました。その中で「嫌いな人からでもギリ買えちゃう」サービスを1つ以上選んでください。”, hint: “強烈なファンがいなくても売れるサービスかどうかの確認です”, point: “めちゃくちゃ大事。強烈なファンがいなくても売れるサービスかどうかの確認。ファンじゃなくても買われるサービスは強い。”, type: “textarea” },
{ id: “wantToBuy”, label: “上のサービスの中で、今すぐ自分に必要だと思うものを1つ以上選んでください。”, hint: “なければ「こんなサービスがあれば今すぐ買いたい」と思えるものを1つ考えて、理由も添えてください”, point: “1人目のお客様は自分。商品を作るときは自分自身がターゲットの中に入ると非常に楽になる。”, type: “textarea” },
{ id: “entrepreneur”, label: “経営者って憧れますか？理由も教えてください。”, hint: “最終的な方向性の確認です”, point: “最終的な方向性の確認。ただし副業→事業とする方がリスクが少ない。いきなり事業を始めるより、副業から育てる方が美容師も自分のペースで続けられる。”, type: “textarea” },
{ id: “hardWork”, label: “今の仕事で頑張っていることはなんですか？”, hint: “思いつく限り記入してください”, point: “生産性の確認なので副業にはほぼ関係ないが、思いつく限り記入を。副業と関係ないからと完全にやめるとアイデンティティの喪失につながるので意外と大事。”, type: “textarea” },
{ id: “endless”, label: “何も生み出していないのについずっとやり続けてしまうことはありますか？”, hint: “ここが副業の商品の原型になることが多いです”, point: “副業選びの重要な要素。直感で答えて。基本的にはここが商品の原型になることが多い。”, type: “textarea” },
{ id: “reputation”, label: “周りの人からよく何と言われますか？”, hint: “アンマッチな仕事を除外するための質問です”, point: “アンマッチな仕事を除外するための質問。自分では気づいていない強みが他者の言葉に隠れていることが多い。”, type: “textarea” },
{ id: “mbti”, label: “あなたのMBTIを教えてください。”, hint: “例：INFJ、ENTPなど”, point: “アンマッチな仕事の除外に使う。MBTIは他の要素より重く判断されるので、正確なタイプを入力すること。”, type: “text” },
{ id: “secret”, label: “友達には言えないけど相談したいことはありますか？”, hint: “ざっくりでOK。深い悩みは副業に活かしやすいです”, point: “ざっくりでOK。深い悩みは副業に活かしやすい。あなたが抱える問題は、同じ悩みを持つ人の「解決したいこと」になる。”, type: “textarea” },
{ id: “weakness”, label: “あなたの短所やコンプレックス（身体的特徴以外）を教えてください。”, hint: “あなたの悩みは誰かの悩み。コンプレックスは副業に活かしやすいです”, point: “あなたの悩みは誰かの悩み。コンプレックスは副業に活かしやすい。克服した経験や葛藤そのものが、誰かの背中を押すコンテンツになる。”, type: “textarea” },
];

const buildDiagPrompt = (answers) => {
const qa = diagQuestions.map((q) => `【${q.label}】\n${answers[q.id] || "（未回答）"}`).join(”\n\n”);
return `以下は副業を目指している美容師の回答です。この内容を参考に、最適な副業を導き出してください。\n\n${qa}\n\nそれぞれの回答は1つの要素に過ぎません。累積的に判断し、MBTIは他の要素より重んじること。\n\n以下の条件を守り、中学生でも分かる言葉で出力してください：\n・最適な副業を3つ挙げ、それぞれ理由も120文字以内で記載\n・副業は8割以上がオンラインで完結する"場所に縛られないもの"\n・誰にでも通じる職業名も添えること\n・必ずしも美容師の知見は活かさなくてよい\n・私の自信を創出するような文章を心がけること\n・副業に挫折しそうになったときに思い出す「副業の目的」を最後に提示すること\n・「理想の暮らし」からワンランク下げた1年後のリアルな生活ラインを端的に提案\n・余計な情報は不要\n・この回答からわかる事実以外は断定しないこと`;
};

const oiQuestions = [
{ id: “current”, label: “副業の収益化のために今取り組んでいることは何ですか？”, placeholder: “例：Instagram投稿、ブログ執筆、SNS運用など” },
{ id: “style”, label: “どんなテイストで追い込まれたいですか？”, placeholder: “例：体育会系でガンガン、優しく背中を押してほしい、淡々と事実を突きつけてほしい” },
{ id: “goal”, label: “今の副業の目標を一言で教えてください”, placeholder: “例：月3万円稼ぐ、Xのフォロワーを1000人にする” },
];

const buildOiMessage = (ans) => `【追いLINE登録希望】\n取り組んでいること：${ans.current || ""}\n追い込みスタイル：${ans.style || ""}\n目標：${ans.goal || ""}`;

const openLine = (text) => {
const encoded = encodeURIComponent(text);
window.open(`https://line.me/R/share?text=${encoded}`, “_blank”);
};

// ============================================================
// CSS
// ============================================================
const css = `
@import url(‘https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap’);

- { box-sizing: border-box; margin: 0; padding: 0; }
  .ss-wrap { min-height: 100vh; background: #0a0a0a; font-family: ‘Noto Sans JP’,‘Hiragino Sans’,sans-serif; color: #f0ede8; padding-bottom: 60px; }
  .ss-header { background: #111; border-bottom: 1px solid #1e1e1e; padding: 22px 20px 18px; text-align: center; position: sticky; top: 0; z-index: 20; }
  .ss-header-sub { font-size: 10px; letter-spacing: .18em; color: #c9a84c; margin-bottom: 4px; text-transform: uppercase; }
  .ss-header-title { font-size: 18px; font-weight: 700; color: #fff; }
  .ss-back { display: flex; align-items: center; gap: 6px; color: #666; font-size: 13px; cursor: pointer; background: none; border: none; font-family: inherit; padding: 16px 16px 0; }
  .ss-card { margin: 10px 14px 0; background: #141414; border: 1px solid #222; border-radius: 14px; padding: 18px 16px 40px; cursor: pointer; transition: border-color .2s, transform .15s; position: relative; }
  .ss-card:active { border-color: #c9a84c55; transform: scale(.985); }
  .ss-card-icon { font-size: 20px; color: #c9a84c; margin-bottom: 8px; }
  .ss-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
  .ss-card-title { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.45; flex: 1; padding-right: 8px; }
  .ss-card-tag { font-size: 10px; padding: 2px 9px; border-radius: 20px; border: 1px solid #c9a84c55; color: #c9a84c; white-space: nowrap; }
  .ss-card-desc { font-size: 12px; color: #666; line-height: 1.7; margin-top: 6px; }
  .ss-card-arrow { position: absolute; right: 16px; bottom: 16px; color: #2e2e2e; }
  .ss-panel { margin: 14px 14px 0; background: #141414; border: 1px solid #c9a84c33; border-radius: 16px; padding: 22px 18px; }
  .ss-panel-icon { font-size: 28px; color: #c9a84c; margin-bottom: 10px; }
  .ss-panel-title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .ss-panel-desc { font-size: 13px; color: #777; line-height: 1.8; margin-bottom: 18px; white-space: pre-line; }
  .ss-btn { width: 100%; border: none; border-radius: 11px; padding: 14px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .18s; margin-bottom: 10px; display: block; text-align: center; text-decoration: none; }
  .ss-btn-gold { background: #c9a84c; color: #0a0a0a; }
  .ss-btn-gold:active { background: #e0bd6a; transform: scale(.98); }
  .ss-btn-ghost { background: transparent; color: #666; border: 1px solid #2a2a2a; }
  .ss-btn-ghost:active { border-color: #555; color: #aaa; }
  .ss-btn-line { background: #06b96a; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .ss-btn-line:active { background: #05a85e; }
  .ss-input { width: 100%; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; color: #f0ede8; font-family: inherit; font-size: 14px; padding: 12px 14px; resize: vertical; outline: none; margin-top: 8px; transition: border-color .2s; }
  .ss-input:focus { border-color: #c9a84c; }
  textarea.ss-input { min-height: 90px; }
  .ss-label { font-size: 12px; color: #888; margin-top: 14px; margin-bottom: 2px; font-weight: 500; }
  .ss-hint { font-size: 11px; color: #444; margin-top: 4px; }
  .ss-progress { height: 3px; background: #1e1e1e; border-radius: 2px; margin-bottom: 20px; overflow: hidden; }
  .ss-progress-fill { height: 100%; background: linear-gradient(90deg,#c9a84c,#e8d48a); transition: width .4s; }
  .ss-dots { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 18px; }
  .ss-dot { width: 7px; height: 7px; border-radius: 50%; background: #2a2a2a; cursor: pointer; transition: background .2s; }
  .ss-dot.ans { background: #c9a84c; }
  .ss-dot.cur { background: #e8d48a; box-shadow: 0 0 5px rgba(232,212,138,.7); }
  .ss-badge { display: inline-block; background: rgba(201,168,76,.12); border: 1px solid rgba(201,168,76,.3); border-radius: 20px; padding: 3px 12px; font-size: 11px; color: #c9a84c; margin-bottom: 14px; }
  .ss-point-btn { background: transparent; border: 1px solid rgba(201,168,76,.3); border-radius: 7px; color: #c9a84c; font-size: 11px; padding: 5px 12px; cursor: pointer; font-family: inherit; margin-top: 12px; display: flex; align-items: center; gap: 5px; }
  .ss-point-box { margin-top: 8px; background: rgba(201,168,76,.06); border: 1px solid rgba(201,168,76,.18); border-radius: 9px; padding: 12px 14px; font-size: 12px; color: #c9a84c; line-height: 1.8; }
  .ss-sub-card { margin-bottom: 10px; background: #111; border: 1px solid #222; border-radius: 12px; padding: 15px; cursor: pointer; transition: all .18s; }
  .ss-sub-card:active { transform: scale(.985); }
  .ss-sub-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .ss-sub-desc { font-size: 12px; color: #666; line-height: 1.6; white-space: pre-line; }
  `;

// ============================================================
// メインアプリ
// ============================================================
export default function App() {
const [screen, setScreen] = useState(“menu”);
const back = () => setScreen(“menu”);

return (
<div className="ss-wrap">
<style>{css}</style>
<div className="ss-header">
<div className="ss-header-sub">SubSwitch</div>
<div className="ss-header-title">副業支援アシスタント</div>
</div>
{screen === “menu” && <MenuScreen go={setScreen} />}
{screen === “diag” && <DiagScreen back={back} />}
{screen === “bara” && <BaraScreen back={back} />}
{screen === “oi” && <OiScreen back={back} />}
{screen === “schedule” && <ScheduleScreen back={back} />}
{screen === “other” && <OtherScreen go={setScreen} back={back} />}
{screen === “zoom” && <ZoomScreen back={() => setScreen(“other”)} />}
{screen === “nisa” && <NisaScreen back={() => setScreen(“other”)} />}
</div>
);
}

// ============================================================
// メニュー
// ============================================================
function MenuScreen({ go }) {
const items = [
{ id: “diag”, icon: “◎”, title: “自分に合う副業を知りたい”, desc: “あなたの性格・環境・価値観から\n最適な副業を導き出します”, tag: “AI診断” },
{ id: “bara”, icon: “▦”, title: “今取り組むべきことを知りたい”, desc: “やることが分散していませんか？\n集中すべき一点を特定します”, tag: “バラツキチェッカー” },
{ id: “oi”, icon: “⚡”, title: “気合いを入れてほしい”, desc: “3問に答えるだけで\nパーソナライズされた追いLINEが届きます”, tag: “追いLINE” },
{ id: “schedule”, icon: “▷”, title: “副業開始までのスケジュールを作りたい”, desc: “1日単位でやることが明確になる\nパーソナルスケジュールを構築します”, tag: “スケジュール作成” },
{ id: “other”, icon: “⊹”, title: “その他の相談”, desc: “ZOOMカウンセリング・NISA銘柄チェック”, tag: “相談窓口” },
];
return (
<div>
{items.map(s => (
<div key={s.id} className=“ss-card” onClick={() => go(s.id)}>
<div className="ss-card-icon">{s.icon}</div>
<div className="ss-card-top">
<div className="ss-card-title">{s.title}</div>
<span className="ss-card-tag">{s.tag}</span>
</div>
<div className="ss-card-desc">{s.desc}</div>
<span className="ss-card-arrow">→</span>
</div>
))}
<div style={{ textAlign: “center”, fontSize: 11, color: “#2a2a2a”, marginTop: 22 }}>サブスク契約者限定サービスです</div>
</div>
);
}

// ============================================================
// 副業診断
// ============================================================
function DiagScreen({ back }) {
const [phase, setPhase] = useState(“intro”);
const [answers, setAnswers] = useState({});
const [activeQ, setActiveQ] = useState(0);
const [showPoint, setShowPoint] = useState(false);
const [copied, setCopied] = useState(false);

const total = diagQuestions.length;
const cq = diagQuestions[activeQ];
const progress = Math.round(Object.values(answers).filter(v => v?.trim()).length / total * 100);
const answeredCount = Object.values(answers).filter(v => v?.trim()).length;

const goQ = (i) => { setActiveQ(i); setShowPoint(false); };
const next = () => activeQ < total - 1 ? goQ(activeQ + 1) : setPhase(“result”);
const prev = () => activeQ > 0 && goQ(activeQ - 1);
const copy = () => {
navigator.clipboard.writeText(buildDiagPrompt(answers)).then(() => {
setCopied(true); setTimeout(() => setCopied(false), 2500);
});
};

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
{phase === “intro” && (
<div className="ss-panel">
<div className="ss-panel-icon">◎</div>
<div className="ss-panel-title">あなたに最適な副業を見つける診断</div>
<div className="ss-panel-desc">全19問の質問に答えるだけ。\n回答をもとにプロンプトを生成します。\nClaudeかChatGPTに貼るだけで副業提案が届きます。</div>
<div style={{ background: “#111”, borderRadius: 10, padding: “12px 14px”, marginBottom: 18, fontSize: 12, color: “#666”, lineHeight: 1.9 }}>
<div style={{ color: “#c9a84c”, fontWeight: 600, marginBottom: 6 }}>📋 使い方</div>
<div>① 全問に答える（悩みすぎなくてOK！）</div>
<div>② プロンプトをコピーする</div>
<div>③ Claude か ChatGPT に貼り付けて送信</div>
<div>④ あなたに合った副業提案が届く ✨</div>
</div>
<button className=“ss-btn ss-btn-gold” onClick={() => setPhase(“q”)}>診断をはじめる →</button>
</div>
)}
{phase === “q” && (
<div className="ss-panel">
<div className="ss-progress"><div className=“ss-progress-fill” style={{ width: `${progress}%` }} /></div>
<div className="ss-dots">
{diagQuestions.map((q, i) => (
<div key={q.id} className={`ss-dot ${i === activeQ ? "cur" : ""} ${answers[q.id]?.trim() ? "ans" : ""}`} onClick={() => goQ(i)} />
))}
</div>
<div className="ss-badge">Q{activeQ + 1} / {total}</div>
<div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6, marginBottom: 4 }}>{cq.label}</div>
<div className="ss-hint">💡 {cq.hint}</div>
{cq.type === “textarea”
? <textarea className=“ss-input” value={answers[cq.id] || “”} onChange={e => setAnswers(p => ({ …p, [cq.id]: e.target.value }))} placeholder=“ここに入力してください…” />
: <input className=“ss-input” type=“text” value={answers[cq.id] || “”} onChange={e => setAnswers(p => ({ …p, [cq.id]: e.target.value }))} placeholder=“例：INFJ” />
}
{answers[cq.id]?.trim() && (
<>
<button className=“ss-point-btn” onClick={() => setShowPoint(p => !p)}>
<span>{showPoint ? “▲” : “▼”}</span>{showPoint ? “閉じる” : “回答のポイントを見る”}
</button>
{showPoint && <div className="ss-point-box"><span style={{ opacity: 0.5, fontSize: 10, display: “block”, marginBottom: 4 }}>📌 このポイントを参考に見直そう</span>{cq.point}</div>}
</>
)}
<div style={{ display: “flex”, gap: 10, marginTop: 20 }}>
<button className=“ss-btn ss-btn-ghost” style={{ width: “auto”, padding: “12px 20px” }} onClick={prev} disabled={activeQ === 0}>← 前へ</button>
<button className=“ss-btn ss-btn-gold” style={{ flex: 1 }} onClick={next}>{activeQ === total - 1 ? “完了して確認する ✓” : “次へ →”}</button>
</div>
<div style={{ textAlign: “center”, marginTop: 12, fontSize: 11, color: “#333” }}>{answeredCount} / {total} 問回答済み</div>
</div>
)}
{phase === “result” && (
<div className="ss-panel">
<div style={{ textAlign: “center”, marginBottom: 16 }}>
<div style={{ fontSize: 30, marginBottom: 6 }}>🎉</div>
<div style={{ fontSize: 17, fontWeight: 700 }}>回答完了！</div>
<div style={{ fontSize: 12, color: “#666”, marginTop: 4 }}>プロンプトを生成しました。Claude か ChatGPT に貼り付けて送信してください。</div>
</div>
<div style={{ background: “#0f0f0f”, border: “1px solid #1e1e1e”, borderRadius: 10, padding: “14px”, fontSize: 12, color: “#777”, whiteSpace: “pre-wrap”, maxHeight: 200, overflowY: “auto”, lineHeight: 1.7, marginBottom: 14 }}>{buildDiagPrompt(answers)}</div>
<button className="ss-btn ss-btn-gold" onClick={copy}>{copied ? “✅ コピーしました！” : “📋 プロンプトをコピーする”}</button>
<div style={{ textAlign: “center”, fontSize: 12, color: “#444”, lineHeight: 1.7, marginBottom: 14 }}>コピー後、<strong style={{ color: “#777” }}>Claude</strong> か <strong style={{ color: “#777” }}>ChatGPT</strong> を開いて貼り付けて送信してください 🚀</div>
<div style={{ background: “rgba(6,185,106,.08)”, border: “1px solid rgba(6,185,106,.25)”, borderRadius: 12, padding: “16px”, textAlign: “center”, marginBottom: 12 }}>
<div style={{ fontSize: 12, color: “#aaa”, lineHeight: 1.8, marginBottom: 12 }}>AIが提案した副業を<br /><strong style={{ color: “#06b96a” }}>より強化することができます。</strong></div>
<a href=“https://lin.ee/QiZ1WuP” target=”_blank” rel=“noopener noreferrer” className=“ss-btn ss-btn-line” style={{ textDecoration: “none” }}>
公式LINEで副業プランを完成させる
</a>
</div>
<button className=“ss-btn ss-btn-ghost” onClick={() => { setPhase(“intro”); setAnswers({}); setActiveQ(0); }}>← 最初からやり直す</button>
</div>
)}
</div>
);
}

// ============================================================
// バラツキチェッカー
// ============================================================
function BaraScreen({ back }) {
const [phase, setPhase] = useState(“input”);
const [q1, setQ1] = useState(””);
const [q2, setQ2] = useState(””);
const [copied, setCopied] = useState(false);

const prompt = `以下は副業に取り組んでいる美容師の状況です。\n\n【副業の収益化のために取り組んでいること】\n${q1}\n\n【現在の優先順位・力の入れ具合】\n${q2 || "(未回答)"}\n\n以下の形式で分析してください：\n\n## 集中度スコア\n100点満点で数値と一言コメント\n\n## バラツキの原因\n箇条書きで2〜3個\n\n## 今すぐ一点集中すべきこと\n1つだけ、理由も添えて\n\n## やめていいこと\n1〜2個、理由も添えて\n\n中学生でも分かる言葉で、背中を押すような文体で書いてください。`;

const copy = () => {
navigator.clipboard.writeText(prompt).then(() => {
setCopied(true); setTimeout(() => setCopied(false), 2500);
});
};

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
{phase === “input” && (
<div className="ss-panel">
<div className="ss-panel-icon">▦</div>
<div className="ss-panel-title">バラツキチェッカー</div>
<div className="ss-panel-desc">2つの質問に答えてプロンプトを生成。\nClaudeかChatGPTに貼るだけで\n集中すべきことが明確になります。</div>
<div className="ss-label">Q1. 副業の収益化のために取り組んでいることは何ですか？</div>
<div className="ss-hint">例：Instagram投稿、ブログ執筆、YouTube撮影、Canva素材作り…</div>
<textarea className=“ss-input” value={q1} onChange={e => setQ1(e.target.value)} placeholder=“思いつく限り書き出してください…” />
<div className="ss-label">Q2. それぞれにどのくらい力を入れていますか？（任意）</div>
<div className="ss-hint">例：Instagramに7割、ブログに3割 / Instagramだけ毎日、他は週1くらい</div>
<textarea className=“ss-input” value={q2} onChange={e => setQ2(e.target.value)} placeholder=“ざっくりでOKです…” style={{ minHeight: 70 }} />
<button className=“ss-btn ss-btn-gold” style={{ marginTop: 18 }} onClick={() => setPhase(“result”)} disabled={!q1.trim()}>プロンプトを生成する →</button>
</div>
)}
{phase === “result” && (
<div className="ss-panel">
<div style={{ textAlign: “center”, marginBottom: 16 }}>
<div style={{ fontSize: 30, marginBottom: 6 }}>📋</div>
<div style={{ fontSize: 17, fontWeight: 700 }}>プロンプト生成完了！</div>
<div style={{ fontSize: 12, color: “#666”, marginTop: 4 }}>Claude か ChatGPT に貼り付けて送信してください。</div>
</div>
<div style={{ background: “#0f0f0f”, border: “1px solid #1e1e1e”, borderRadius: 10, padding: “14px”, fontSize: 12, color: “#777”, whiteSpace: “pre-wrap”, maxHeight: 200, overflowY: “auto”, lineHeight: 1.7, marginBottom: 14 }}>{prompt}</div>
<button className="ss-btn ss-btn-gold" onClick={copy}>{copied ? “✅ コピーしました！” : “📋 プロンプトをコピーする”}</button>
<div style={{ textAlign: “center”, fontSize: 12, color: “#444”, lineHeight: 1.7, marginBottom: 14 }}>コピー後、<strong style={{ color: “#777” }}>Claude</strong> か <strong style={{ color: “#777” }}>ChatGPT</strong> を開いて貼り付けて送信してください 🚀</div>
<button className=“ss-btn ss-btn-ghost” onClick={() => { setPhase(“input”); setQ1(””); setQ2(””); }}>← やり直す</button>
</div>
)}
</div>
);
}

// ============================================================
// 追いLINE
// ============================================================
function OiScreen({ back }) {
const [phase, setPhase] = useState(“q”);
const [answers, setAnswers] = useState({});
const [step, setStep] = useState(0);

const cq = oiQuestions[step];
const msg = buildOiMessage(answers);
const next = () => step < oiQuestions.length - 1 ? setStep(s => s + 1) : setPhase(“confirm”);

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
<div className="ss-panel">
<div className="ss-panel-icon">⚡</div>
<div className="ss-panel-title">追いLINE設定</div>
{phase === “q” && (
<>
<div className="ss-panel-desc">3問に答えるだけで、あなたに合った\nパーソナライズされた追いLINEが届きます。</div>
<div style={{ display: “flex”, gap: 8, marginBottom: 18 }}>
{oiQuestions.map((_, i) => (
<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? “#c9a84c” : “#2a2a2a”, transition: “background .3s” }} />
))}
</div>
<div style={{ fontSize: 11, color: “#c9a84c”, marginBottom: 8 }}>Q{step + 1} / {oiQuestions.length}</div>
<div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>{cq.label}</div>
<input className=“ss-input” type=“text” value={answers[cq.id] || “”} onChange={e => setAnswers(p => ({ …p, [cq.id]: e.target.value }))} placeholder={cq.placeholder} />
<div style={{ display: “flex”, gap: 10, marginTop: 18 }}>
{step > 0 && <button className=“ss-btn ss-btn-ghost” style={{ width: “auto”, padding: “12px 20px” }} onClick={() => setStep(s => s - 1)}>← 前へ</button>}
<button className=“ss-btn ss-btn-gold” style={{ flex: 1 }} onClick={next} disabled={!answers[cq.id]?.trim()}>{step === oiQuestions.length - 1 ? “確認する ✓” : “次へ →”}</button>
</div>
</>
)}
{phase === “confirm” && (
<>
<div className="ss-panel-desc">以下の内容でLINEを送信します。\nボタンを押すとLINEが開くので\nそのまま送信してください。</div>
<div style={{ background: “#0f0f0f”, border: “1px solid #1e1e1e”, borderRadius: 10, padding: “14px”, marginBottom: 18, fontSize: 13, color: “#aaa”, lineHeight: 1.8, whiteSpace: “pre-wrap” }}>{msg}</div>
<button className=“ss-btn ss-btn-line” onClick={() => openLine(msg)}>🟢 LINEで送信する</button>
<button className=“ss-btn ss-btn-ghost” onClick={() => { setPhase(“q”); setStep(0); }}>← やり直す</button>
</>
)}
</div>
</div>
);
}

// ============================================================
// スケジュール作成
// ============================================================
function ScheduleScreen({ back }) {
const [note, setNote] = useState(””);
const msg = `【スケジュール作成依頼】\n副業開始までのスケジュールを作成してほしいです。\n${note ? `\n補足：${note}` : ""}`.trim();

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
<div className="ss-panel">
<div className="ss-panel-icon">▷</div>
<div className="ss-panel-title">副業開始までのスケジュール作成</div>
<div className="ss-panel-desc">1日単位でやることが明確になる\nパーソナルスケジュールを構築します。\n\n補足があれば入力してからLINEで送信してください。</div>
<div className="ss-label">補足・現状（任意）</div>
<div className="ss-hint">例：今はInstagramを始めたばかり、目標は3ヶ月で収益化など</div>
<textarea className=“ss-input” value={note} onChange={e => setNote(e.target.value)} placeholder=“ざっくりでOKです…” style={{ minHeight: 80 }} />
<button className=“ss-btn ss-btn-line” style={{ marginTop: 18 }} onClick={() => openLine(msg)}>🟢 LINEで送信する</button>
<button className="ss-btn ss-btn-ghost" onClick={back}>← 戻る</button>
</div>
</div>
);
}

// ============================================================
// その他メニュー
// ============================================================
function OtherScreen({ go, back }) {
return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
<div style={{ padding: “14px 14px 0”, fontSize: 13, color: “#555”, marginBottom: 4 }}>ご相談内容をお選びください</div>
<div style={{ padding: “0 14px” }}>
<div className=“ss-sub-card” onClick={() => go(“zoom”)}>
<div style={{ fontSize: 18, color: “#c9a84c”, marginBottom: 6 }}>◉</div>
<div className="ss-sub-title">15分カウンセリング（ZOOM）</div>
<div className="ss-sub-desc">何をやっても上手くいかない時に\n思い切って相談・脳内整理</div>
</div>
<div className=“ss-sub-card” onClick={() => go(“nisa”)}>
<div style={{ fontSize: 18, color: “#c9a84c”, marginBottom: 6 }}>◈</div>
<div className="ss-sub-title">NISA銘柄チェッカー</div>
<div className="ss-sub-desc">銘柄と積立額を入力するだけで\n最適なプランをご提案</div>
</div>
</div>
</div>
);
}

// ============================================================
// ZOOMカウンセリング
// ============================================================
function ZoomScreen({ back }) {
const [note, setNote] = useState(””);
const msg = `【ZOOMカウンセリング希望】\n15分のカウンセリングをお願いしたいです。\n${note ? `\n相談内容：${note}` : ""}`.trim();

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
<div className="ss-panel">
<div className="ss-panel-icon">◉</div>
<div className="ss-panel-title">15分カウンセリング（ZOOM）</div>
<div className="ss-panel-desc">何をやっても上手くいかない時に\n思い切って相談・脳内整理。\n\n相談したいことをざっくり書いてから送信してください。</div>
<div className="ss-label">相談したいこと（任意）</div>
<textarea className=“ss-input” value={note} onChange={e => setNote(e.target.value)} placeholder=“ざっくりでOKです…” style={{ minHeight: 80 }} />
<button className=“ss-btn ss-btn-line” style={{ marginTop: 18 }} onClick={() => openLine(msg)}>🟢 LINEで送信する</button>
<button className="ss-btn ss-btn-ghost" onClick={back}>← 戻る</button>
</div>
</div>
);
}

// ============================================================
// NISA銘柄チェッカー
// ============================================================
function NisaScreen({ back }) {
const [rows, setRows] = useState([{ brand: “”, amount: “” }]);

const addRow = () => setRows(r => […r, { brand: “”, amount: “” }]);
const updateRow = (i, key, val) => setRows(r => r.map((row, idx) => idx === i ? { …row, [key]: val } : row));
const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
const validRows = rows.filter(r => r.brand.trim() || r.amount.trim());
const msg = `【NISA銘柄チェッカー希望】\n以下の積立状況を確認・最適化してください。\n\n${validRows.map(r => `・${r.brand}：月${r.amount}円`).join("\n")}`;

return (
<div>
<button className="ss-back" onClick={back}>← 戻る</button>
<div className="ss-panel">
<div className="ss-panel-icon">◈</div>
<div className="ss-panel-title">NISA銘柄チェッカー</div>
<div className="ss-panel-desc">現在の積立状況を入力してください。\n最適なプランをご提案します。</div>
<div className="ss-label">現在の積立銘柄と毎月の金額</div>
{rows.map((row, i) => (
<div key={i} style={{ display: “flex”, gap: 8, marginTop: 8, alignItems: “center” }}>
<input className=“ss-input” style={{ flex: 2, marginTop: 0 }} value={row.brand} onChange={e => updateRow(i, “brand”, e.target.value)} placeholder=“銘柄名（例：eMAXIS Slim）” />
<input className=“ss-input” style={{ flex: 1, marginTop: 0 }} value={row.amount} onChange={e => updateRow(i, “amount”, e.target.value)} placeholder=“金額（円）” type=“number” />
{rows.length > 1 && <button onClick={() => removeRow(i)} style={{ background: “none”, border: “none”, color: “#555”, fontSize: 18, cursor: “pointer”, padding: “0 4px” }}>×</button>}
</div>
))}
<div style={{ background: “#0f0f0f”, border: “1px dashed #333”, borderRadius: 10, padding: “10px”, textAlign: “center”, fontSize: 13, color: “#555”, cursor: “pointer”, marginTop: 8 }} onClick={addRow}>＋ 銘柄を追加する</div>
<button className=“ss-btn ss-btn-line” style={{ marginTop: 18 }} onClick={() => openLine(msg)} disabled={validRows.length === 0}>🟢 LINEで送信する</button>
<button className="ss-btn ss-btn-ghost" onClick={back}>← 戻る</button>
</div>
</div>
);
}
