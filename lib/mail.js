// Transactional email via Resend's REST API (no SDK, no extra dependency).
//
// Nothing here is allowed to break a purchase: every function swallows its own
// errors and reports them in the return value. A buyer who paid must always get
// their code on screen, whether or not the mail went out.

const API = "https://api.resend.com/emails";

const GAMES = {
  khalid: { name: "قضية خالد", path: "/game" },
  shaleh: { name: "قضية الشاليه", path: "/shaleh" },
  villa: { name: "قضية الفيلا", path: "/villa" },
};

export function mailEnabled() {
  return !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

const site = () => (process.env.SITE_URL || "https://cases.hyphen-eventskw.com").replace(/\/$/, "");

function arDate(iso) {
  try {
    return new Intl.DateTimeFormat("ar-KW", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(iso));
  } catch (e) {
    return String(iso || "").slice(0, 10);
  }
}

/** Send one email. Never throws. */
export async function sendMail({ to, subject, html, text, replyTo }) {
  if (!mailEnabled()) return { ok: false, skipped: "mail_not_configured" };
  if (!to) return { ok: false, skipped: "no_recipient" };
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok) return { ok: false, status: r.status, error: j?.message || "send_failed" };
    return { ok: true, id: j?.id };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

const shell = (inner) => `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8">
<body style="margin:0;background:#0d1016;padding:24px 12px;font-family:Tahoma,Arial,sans-serif">
<div style="max-width:520px;margin:0 auto;background:#161b24;border:1px solid #283040;border-radius:16px;overflow:hidden">
${inner}
<div style="padding:16px 22px;border-top:1px solid #283040;color:#8e97a8;font-size:12px;line-height:1.8">
HYPHEN Events · الكويت<br>
صار عندكم سؤال؟ ردّوا على هالإيميل أو راسلونا على واتساب
<a href="https://wa.me/94426426" style="color:#e2574b;text-decoration:none">94426426</a>
</div></div></body></html>`;

/** The buyer's copy — this is the only record they have of their code. */
export function buyerEmail({ code, game, expiresAt }) {
  const g = GAMES[game] || GAMES.khalid;
  const link = `${site()}${g.path}#code=${code}`;
  const until = expiresAt ? arDate(expiresAt) : null;
  const html = shell(`
<div style="padding:26px 22px 8px;text-align:center">
  <div style="color:#8e97a8;font-size:12px;letter-spacing:.14em;font-weight:bold">HYPHEN · CASES</div>
  <h1 style="margin:12px 0 4px;color:#e9ecf2;font-size:23px">تم الدفع ✅</h1>
  <div style="color:#8e97a8;font-size:15px">${g.name} صارت لكم</div>
</div>
<div style="padding:18px 22px">
  <div style="color:#8e97a8;font-size:13px;margin-bottom:8px">هذا كودكم — احفظوه:</div>
  <div style="background:#0b0e14;border:2px dashed #283040;border-radius:14px;padding:16px;
       text-align:center;color:#fff;font:bold 30px/1 'Courier New',monospace;letter-spacing:5px;direction:ltr">${code}</div>
  <div style="text-align:center;margin:20px 0 6px">
    <a href="${link}" style="display:inline-block;background:#c4382d;color:#fff;text-decoration:none;
       font-weight:bold;font-size:17px;padding:14px 28px;border-radius:12px">ابدأوا القضية</a>
  </div>
  <div style="color:#8e97a8;font-size:13px;line-height:1.9;margin-top:16px">
    · الكود لفريق واحد، وينفتح لين <b style="color:#e9ecf2">٦ موبايلات</b> — كل واحد يكتب نفس الكود.<br>
    · عندكم <b style="color:#e9ecf2">ساعة وحدة</b> من أول ما تضغطون ابدأ.<br>
    ${until ? `· صالح لين <b style="color:#e9ecf2">${until}</b>.<br>` : ""}
    · تبون تلعبونها على التلفزيون؟ من داخل اللعبة: ☰ القائمة ← 📺 العب على التلفزيون.
  </div>
</div>`);
  const text = `تم الدفع ✅ ${g.name}\n\nكودكم: ${code}\nابدأوا من هنا: ${link}\n\n`
    + `الكود لفريق واحد ولين ٦ موبايلات. عندكم ساعة وحدة.`
    + (until ? ` صالح لين ${until}.` : "");
  return { subject: `كودكم لـ${g.name} 🔍 — ${code}`, html, text };
}

/** Dee's copy — so a sale is something she's told about, not something she has to go looking for. */
export function ownerEmail({ code, game, order }) {
  const g = GAMES[game] || GAMES.khalid;
  const row = (k, v) =>
    `<tr><td style="padding:7px 0;color:#8e97a8;font-size:13px;white-space:nowrap">${k}</td>
     <td style="padding:7px 0 7px 14px;color:#e9ecf2;font-size:14px;direction:ltr;text-align:right">${v || "—"}</td></tr>`;
  const amount = order?.amount_kwd != null ? `${Number(order.amount_kwd).toFixed(3)} د.ك` : "—";
  const html = shell(`
<div style="padding:24px 22px 6px">
  <h1 style="margin:0;color:#e9ecf2;font-size:20px">💰 بيعة جديدة — ${g.name}</h1>
</div>
<div style="padding:4px 22px 20px">
  <table style="width:100%;border-collapse:collapse">
    ${row("المبلغ", amount)}
    ${row("الكود", `<b>${code}</b>`)}
    ${row("الإيميل", order?.email)}
    ${row("الموبايل", order?.phone)}
    ${row("كود الخصم", order?.promo)}
    ${row("رقم الطلب", order?.id)}
  </table>
  <div style="margin-top:16px">
    <a href="${site()}/admin" style="color:#e2574b;font-size:13px;text-decoration:none">فتح لوحة الطلبات ←</a>
  </div>
</div>`);
  const text = `بيعة جديدة — ${g.name}\nالمبلغ: ${amount}\nالكود: ${code}\n`
    + `الإيميل: ${order?.email || "—"}\nالموبايل: ${order?.phone || "—"}\nالطلب: ${order?.id || "—"}`;
  return { subject: `💰 بيعة جديدة — ${g.name} — ${amount}`, html, text };
}

/**
 * Fire both emails for a completed order. Returns what happened with each so the
 * webhook can log it; it never throws and never blocks the buyer's redirect.
 */
export async function sendOrderMails({ order, code, game, expiresAt }) {
  const jobs = [];
  if (order?.email) {
    const m = buyerEmail({ code, game, expiresAt });
    jobs.push(sendMail({ ...m, to: order.email }).then((r) => ["buyer", r]));
  }
  const owner = process.env.MAIL_TO_OWNER;
  if (owner) {
    const m = ownerEmail({ code, game, order });
    jobs.push(sendMail({ ...m, to: owner, replyTo: order?.email || undefined }).then((r) => ["owner", r]));
  }
  const out = await Promise.all(jobs);
  return Object.fromEntries(out);
}
