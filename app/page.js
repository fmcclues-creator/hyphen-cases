import Link from "next/link";
import { Header, Footer, waHref } from "./components/Site";
import { HomeBoard } from "./components/Board";
import { reactions } from "./reactions";
import { L } from "../lib/i18n";
import { getLang } from "../lib/lang";

const COPY = {
  ar: {
    shots: [
      { src: "/shots/file.jpg", cap: "ملف القضية — بلاغ الاختفاء، أقوال المشتبهين، والأوراق اللي سلّمتها زوجته. منه تطلّعون كود الموبايل." },
      { src: "/shots/lock.jpg", cap: "موبايل خالد… مقفول. ٤ أرقام، والجواب مخبّى بين أوراق الملف." },
      { src: "/shots/chat.jpg", cap: "محادثاته كلها جدّامكم — واحد منهم كاتب شي ما يتوافق مع اللي قاله بالتحقيق." },
      { src: "/shots/interviews.jpg", cap: "مقابلات مصوّرة مع كل مشتبه. سمعوهم زين… وقارنوهم بالموبايل." },
      { src: "/shots/accuse.jpg", cap: "اللحظة الأخيرة: منو، ووين، ومتى. سمّوا الجاني وشوفوا إذا جبتوها صح." },
    ],
    fits: [
      { e: "🛋️", t: "ديوانية", s: "كل واحد بموبايله، وكلكم على نفس القضية" },
      { e: "🏡", t: "زوارة أهل", s: "الكل يقدر يشارك" },
      { e: "💅", t: "عزيمة بنات", s: "قهوة، وقضية، وهواش على الجاني" },
      { e: "🎂", t: "عيد ميلاد", s: "فعالية حلوة حق عيد ميلاد" },
      { e: "🕵️", t: "بروحك", s: "ما عندك فريق؟ القضية تقدر تحلّها بروحك بعد" },
      { e: "💼", t: "فعالية شركة", s: "قضية مخصّصة باسم شركتكم، أو بطولة بين الفرق", wa: true },
    ],
    faq: [
      { q: "لازم تلفزيون؟", a: "لا. اللعبة كاملة على الموبايل وتنلعب بدون أي شي ثاني. التلفزيون يخلّيها أحلى للمجموعة — تعرضون عليه الملف والمكالمات والصور عشان الكل يشوف. من داخل اللعبة: ☰ القائمة ← 📺 العب على التلفزيون." },
      { q: "جم واحد يقدر يلعب؟", a: "الكود لفريق واحد، ويفتح على ٦ موبايلات — كل واحد يكتب نفس الكود ويشوفون نفس التقدّم. أما عدد اللي حول الشاشة فمفتوح — ٣ أو ١٢، ما يفرق." },
      { q: "مناسبة للمراهقين؟", a: "إي. ما فيها دم ولا مشاهد مخيفة — قراءة ومحادثات واستنتاج. الكل يقدر يشارك، والصغار يلعبون ضمن الفريق مع الكبار." },
      { q: "وإذا ما خلّصنا بساعة؟", a: "ما يصير شي — ما فيه شي يقفل عليكم. الساعة هدف مو حد: الوقت يستمر ويتسجّل بالنتيجة النهائية، وتقدرون تكمّلون لين تسمّون الجاني. القضية مصمّمة تنحل بساعة تقريباً." },
      { q: "نقدر نلعبها مرة ثانية؟", a: "القضية لها حل واحد، فأول ما تعرفون الجاني تروح متعة الإعادة على نفس الفريق. الكود ما له تاريخ انتهاء، ومن أول ما تبدأون عندكم ٤ أيام — تقدرون تبدونها يوم وتكمّلونها يوم ثاني وتفتحونها من أكثر من موبايل. بس إذا تبون تلعبونها من الصفر مع مجموعة ثانية، تحتاجون كود ثاني." },
      { q: "شلون يوصلنا الكود؟", a: "على الإيميل، فوراً بعد الدفع. تدفعون بـKNET أو بطاقة. وإذا ما وصل خلال دقايق، دوّروا عليه بالـspam أو راسلونا واتساب على ٩٤٤٢٦٤٢٦." },
      { q: "فيه نسخة إنجليزية؟", a: "إي. القضيتين متوفّرتين بالعربي وبالإنجليزي بنفس الكود — أول ما تفتحون اللعبة تختارون اللغة، وتقدرون تبدّلونها بأي وقت من القائمة." },
    ],
    kicker: "قضيتين · كل قضية ساعة", h1a: "موبايل مقفول…", h1b: "ومنو الجاني؟",
    heroP: ["ألعاب تفاعلية على الموبايل أو التلفزيون.", "القضية الأولى: اختفاء خالد قبل أكبر صفقة بحياته.", "القضية الثانية: اختفاء ذهب الجدّة من تجوري الشاليه!"],
    heroLine: "الأدلة في الموبايل… الموبايل مقفول، والحل عندكم.",
    pick: "اختاروا قضية", both: "القضيتين مع بعض", kd: "د.ك",
    facts: ["⏱ ساعة وحدة", "👥 يفتح على ٦ موبايلات", "📺 على التلفزيون"],
    f1: { aria: "قضية خالد", dept: "إدارة البحث والتحرّي الجنائي", no: "رقم الملف K-0810", name: "خالد", kind: "بلاغ اختفاء", stamp: "سرّي · عاجل" },
    f2: { aria: "قضية الشاليه", dept: "مخفر الخيران · قسم التحرّيات", no: "رقم الملف KH-0412", name: "الشاليه", kind: "بلاغ سرقة", stamp: "سرّي · عاجل" },
    fitsH: "مناسبة لـ",
    steps: [["١", "اشتروا كود الفريق", "كود واحد لكل فريق، يوصلكم على الإيميل فوراً."], ["٢", "شغّلوه على التلفزيون", "فتحوا اللعبة من الموبايل وعرضوا الشاشة."], ["٣", "فتحوا الموبايل المقفول", "طلّعوا الكود من ملف القضية."], ["٤", "سمّوا الجاني", "محادثات، صور، مقابلات… ومكالمة تجيكم."]],
    shotsH: "شوفوا اللعبة", saysH: "اللي لعبوها", casesH: "القضايا", inGame: "من داخل اللعبة",
    k1: "القضية الأولى · اختفاء", k1h: "قضية خالد", k1p: "اختفى صاحب مجموعة مطاعم قبل أكبر صفقة بحياته بساعات. موبايله بين إيدينكم… مقفول. ٥ مشتبهين، وواحد منهم مو صادق.",
    k1facts: ["⏱ ساعة وحدة", "👥 ٦ موبايلات", "📺 على التلفزيون"], k1aria: "مقطع من قضية خالد",
    k2: "القضية الثانية · سرقة", k2h: "قضية الشاليه", k2p: "الجدّة يابت ذهبها الشاليه، دخّلته بالتجوري بنفسها. بعد ٤ ساعات: الغرفة مقلوبة والتجوري فاضي ومحد طلع أو دخل الشاليه. موبايل ولدها بين إيدينكم… والحل عندكم.",
    k2facts: ["⏱ ساعة وحدة", "👥 ٦ موبايلات", "🎮 ألعاب تفاعلية"], k2aria: "مقطع من قضية الشاليه",
    start: "ابدأوا التحقيق", gift: "🎁 هدية", best: "الأوفر", bothB: "القضيتين مع بعض", instead: (p) => `كودين — خالد والشاليه. بدال ${p} د.ك`, buyBoth: "اشتروا القضيتين",
    soon: "قريباً", soonT: "قضية الوصية الضايعة", soonS: "ميراث · ٦ مشتبهين",
    faqH: "أسئلة قبل ما تشترون", readyH: "جاهزين؟",
    readyP: ["كود واحد لكل قضية، فريق واحد، ساعة وحدة — على ٦ موبايلات، ومن أول ما تبدأون عندكم ٤ أيام تكملونها. وأسرع الفرق تدخل ", "لوحة المتصدرين", "."],
    bothShort: "القضيتين",
    aboutH: "من HYPHEN", aboutP: "HYPHEN Events شركة كويتية في مجال الفعاليات: إنتاج وتنفيذ، تفعيلات للعلامات التجارية، أيام مفتوحة، وألعاب جماعية نصمّمها بأنفسنا. أحدث إضافاتنا: ألعاب تفاعلية جماعية، تجمع العايلة والربع حول التلفزيون لساعة تحقيق.", aboutMore: "اقرأ عنّا ←",
  },
  en: {
    shots: [
      { src: "/shots/en/file.jpg", cap: "The case file — the missing-person report, the suspects’ statements and the papers his wife handed in. The phone’s passcode is hiding in there." },
      { src: "/shots/en/lock.jpg", cap: "Khalid’s phone… locked. Four digits, and the answer is somewhere in the file." },
      { src: "/shots/en/chat.jpg", cap: "All his chats in front of you — one of them wrote something that doesn’t match what he told the police." },
      { src: "/shots/en/interviews.jpg", cap: "Recorded interviews with every suspect. Listen closely… and check them against the phone." },
      { src: "/shots/en/accuse.jpg", cap: "The final moment: who, where and when. Name the culprit and see if you got it right." },
    ],
    fits: [
      { e: "🛋️", t: "Game night", s: "Everyone on their own phone, all on the same case" },
      { e: "🏡", t: "Family gathering", s: "Everyone can join in" },
      { e: "💅", t: "Girls’ night", s: "Coffee, a case, and an argument over who did it" },
      { e: "🎂", t: "Birthday", s: "A fun activity for a birthday" },
      { e: "🕵️", t: "Solo", s: "No team? You can crack the case on your own too" },
      { e: "💼", t: "Corporate event", s: "A case built around your company, or a tournament between teams", wa: true },
    ],
    faq: [
      { q: "Do we need a TV?", a: "No. The whole game runs on the phone and plays fine on its own. A TV just makes it better for a group — put the file, the calls and the photos up where everyone can see. Inside the game: ☰ Menu → 📺 Play on TV." },
      { q: "How many people can play?", a: "One code is one team, and it opens on up to 6 phones — everyone types the same code and sees the same progress. How many people sit around the screen is up to you: 3 or 12, it makes no difference." },
      { q: "Is it suitable for teenagers?", a: "Yes. No blood, no scary scenes — reading, chats and deduction. Everyone can take part, and younger ones play as part of the team with the adults." },
      { q: "What if we don’t finish in an hour?", a: "Nothing happens — nothing locks you out. The hour is a target, not a limit: the clock keeps running and is recorded in your final result, and you keep going until you name the culprit. The case is designed to take about an hour." },
      { q: "Can we play it again?", a: "Each case has one solution, so once you know who did it the replay is gone for that team. The code never expires, and from the moment you start you have 4 days — begin one day, finish another, open it on more than one phone. To play it from scratch with a different group you need another code." },
      { q: "How do we get the code?", a: "By email, straight after payment. Pay with KNET or card. If it hasn’t arrived in a few minutes, check your spam folder or message us on WhatsApp at 94426426." },
      { q: "Is there an Arabic version?", a: "Yes. Both cases come in Arabic and English on the same code — you pick the language when you open the game, and you can switch at any time from the menu." },
    ],
    kicker: "Two cases · one hour each", h1a: "A locked phone…", h1b: "and who did it?",
    heroP: ["Interactive games on the phone or the TV.", "Case one: Khalid vanishes before the biggest deal of his life.", "Case two: Grandma’s gold disappears from the chalet safe!"],
    heroLine: "The evidence is in the phone… the phone is locked, and the solution is in your hands.",
    pick: "Pick a case", both: "Both cases together", kd: "KD",
    facts: ["⏱ One hour", "👥 Opens on 6 phones", "📺 On the TV"],
    f1: { aria: "The Khalid Case", dept: "Criminal Investigation Department", no: "Case file K-0810", name: "Khalid", kind: "Missing person", stamp: "Confidential · Urgent" },
    f2: { aria: "The Chalet Case", dept: "Khiran Police Station · Investigations", no: "Case file KH-0412", name: "Chalet", kind: "Theft report", stamp: "Confidential · Urgent" },
    fitsH: "Perfect for",
    steps: [["1", "Buy a team code", "One code per team, emailed to you instantly."], ["2", "Put it on the TV", "Open the game on a phone and share the screen."], ["3", "Unlock the phone", "Dig the passcode out of the case file."], ["4", "Name the culprit", "Chats, photos, interviews… and a call that comes in."]],
    shotsH: "See the game", saysH: "From players", casesH: "The cases", inGame: "In-game footage",
    k1: "Case one · Disappearance", k1h: "The Khalid Case", k1p: "A restaurant-group owner vanishes hours before the biggest deal of his life. His phone is in your hands… locked. Five suspects, and one of them is lying.",
    k1facts: ["⏱ One hour", "👥 6 phones", "📺 On the TV"], k1aria: "A clip from The Khalid Case",
    k2: "Case two · Theft", k2h: "The Chalet Case", k2p: "Grandma brought her gold to the chalet and locked it in the safe herself. Four hours later: the room is ransacked, the safe is empty, and nobody came in or out. Her son’s phone is in your hands… and so is the solution.",
    k2facts: ["⏱ One hour", "👥 6 phones", "🎮 Interactive"], k2aria: "A clip from The Chalet Case",
    start: "Start investigating", gift: "🎁 Gift", best: "Best value", bothB: "Both cases together", instead: (p) => `Two codes — Khalid and the Chalet. Instead of KD ${p}`, buyBoth: "Get both cases",
    soon: "Coming soon", soonT: "The Lost Will", soonS: "Inheritance · 6 suspects",
    faqH: "Before you buy", readyH: "Ready?",
    readyP: ["One code per case, one team, one hour — on 6 phones, with 4 days to finish from the moment you start. The fastest teams make the ", "leaderboard", "."],
    bothShort: "Both cases",
    aboutH: "From HYPHEN", aboutP: "HYPHEN Events is a Kuwaiti events company: production and execution, brand activations, open days, and group games we design ourselves. Our latest: interactive co-op games that gather family and friends around the TV for an hour of detective work.", aboutMore: "Read about us →",
  },
};

export const revalidate = 60;

export default async function Home() {
  const lang = getLang();
  const t = COPY[lang], l = L(lang);
  const price = Number(process.env.PRICE_KWD || 4.75).toFixed(3);
  const bundle = Number(process.env.BUNDLE_KWD || 7.5).toFixed(3);
  const money = (v) => (lang === "en" ? `KD ${v}` : `${v} د.ك`);
  const media = lang === "en" ? "/media/en" : "/media"; // the preview clips are recorded from each edition
  return (
    <main className="wrap">
      <Header lang={lang} />

      <section className="hero">
        <div>
          <div className="kicker">{t.kicker}</div>
          <h1>{t.h1a} <span>{t.h1b}</span></h1>
          <p>{t.heroP[0]}<br />{t.heroP[1]}<br />{t.heroP[2]}</p>
          <p className="hero-line">{t.heroLine}</p>
          <div className="cta-row">
            <Link className="cta" href={l("/#cases")}>{t.pick} <span className="price">{money(price)}</span></Link>
            <Link className="cta lite" href={l("/buy?game=bundle")}>{t.both} <span className="price">{money(bundle)}</span></Link>
          </div>
          <div className="facts">
            {t.facts.map((f) => <span key={f}>{f}</span>)}
          </div>
        </div>

        {/* the two case files — tap one to go to its case */}
        <div className="folders">
          {[["f1", "#case-khalid", t.f1], ["f2", "#case-shaleh", t.f2]].map(([cls, hash, f]) => (
            <Link key={cls} href={l("/" + hash)} className={"folder " + cls} aria-label={f.aria}><div className="sheet">
              <div className="dept">{f.dept}</div>
              <small>{f.no}</small>
              <div className="name">{f.name}</div>
              <small>{f.kind}</small>
              <div className="stamp">{f.stamp}</div>
            </div></Link>
          ))}
        </div>
      </section>

      <section className="fits">
        <h2>{t.fitsH}</h2>
        <div className="fit-row">
          {t.fits.map((f) => {
            const As = f.wa ? "a" : "div";
            return (
              <As className="fit" key={f.t} {...(f.wa ? { href: waHref(lang), target: "_blank", rel: "noopener" } : {})}>
                <div className="fit-e" aria-hidden="true">{f.e}</div>
                <b>{f.t}</b>
                {f.s && <span>{f.s}</span>}
              </As>
            );
          })}
        </div>
      </section>

      <section className="steps" id="how">
        {t.steps.map(([n, b, s]) => (
          <div className="step" key={n}><div className="n">{n}</div><b>{b}</b><span>{s}</span></div>
        ))}
      </section>

      <section className="shots" id="look">
        <h2>{t.shotsH}</h2>
        <div className="shot-row">
          {t.shots.map((s) => (
            <figure className="shot" key={s.src}>
              {/* small on the page, full size for anyone who wants a proper look */}
              <a href={s.src} target="_blank" rel="noopener">
                <img src={s.src} alt="" loading="lazy" width="780" height="1688" />
              </a>
              <figcaption>{s.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lang === "ar" && reactions.length > 0 && (
        <section className="says" id="says">
          <h2>{t.saysH}</h2>
          <div className="say-row">
            {reactions.map((r, i) => (
              <figure className="say" key={i}>
                {r.img
                  ? <img src={`/reactions/${r.img}`} alt="" loading="lazy" />
                  : <blockquote>«{r.text}»</blockquote>}
                {(r.who || r.where) && (
                  <figcaption>{r.who}{r.where ? <span>{r.who ? " · " : ""}{r.where}</span> : null}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="cases" id="cases">
        <h2>{t.casesH}</h2>
        <div className="casebig" id="case-khalid">
          <div className="phone">
            <video className="phone-screen" autoPlay muted loop playsInline preload="metadata" poster={`${media}/play-poster.jpg`} aria-label={t.k1aria}>
              <source src={`${media}/play.webm`} type="video/webm" /><source src={`${media}/play.mp4`} type="video/mp4" />
            </video>
            <span className="phone-note">{t.inGame}</span>
          </div>
          <div>
            <div className="kicker">{t.k1}</div>
            <h3>{t.k1h}</h3>
            <p>{t.k1p}</p>
            <div className="facts">{t.k1facts.map((f) => <span key={f}>{f}</span>)}</div>
            <div className="cta-row">
              <Link className="cta" href={l("/buy?game=khalid")}>{t.start} <span className="price">{money(price)}</span></Link>
              <Link className="cta lite" href={l("/buy?game=khalid&gift=1")}>{t.gift}</Link>
            </div>
          </div>
        </div>
        <div className="casebig" id="case-shaleh">
          <div className="phone">
            <video className="phone-screen" autoPlay muted loop playsInline preload="metadata" poster={`${media}/play-shaleh-poster.jpg`} aria-label={t.k2aria}>
              <source src={`${media}/play-shaleh.webm`} type="video/webm" /><source src={`${media}/play-shaleh.mp4`} type="video/mp4" />
            </video>
            <span className="phone-note">{t.inGame}</span>
          </div>
          <div>
            <div className="kicker">{t.k2}</div>
            <h3>{t.k2h}</h3>
            <p>{t.k2p}</p>
            <div className="facts">{t.k2facts.map((f) => <span key={f}>{f}</span>)}</div>
            <div className="cta-row">
              <Link className="cta" href={l("/buy?game=shaleh")}>{t.start} <span className="price">{money(price)}</span></Link>
              <Link className="cta lite" href={l("/buy?game=shaleh&gift=1")}>{t.gift}</Link>
            </div>
          </div>
        </div>
        <div className="bundle">
          <div>
            <div className="tag">{t.best}</div>
            <b>{t.bothB}</b>
            <span>{t.instead((Number(price) * 2).toFixed(3))}</span>
          </div>
          <Link className="cta" href={l("/buy?game=bundle")}>{t.buyBoth} <span className="price">{money(bundle)}</span></Link>
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          <div className="case soon">
            <div className="tag">{t.soon}</div>
            <b>{t.soonT}</b>
            <span>{t.soonS}</span>
          </div>
        </div>
      </section>

      <HomeBoard lang={lang} />

      <section className="faq" id="faq">
        <h2>{t.faqH}</h2>
        {t.faq.map((f) => (
          <details className="qa" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section className="last">
        <h2>{t.readyH}</h2>
        <p>{t.readyP[0]}<Link href={l("/leaderboard")}>{t.readyP[1]}</Link>{t.readyP[2]}</p>
        <div className="cta-row">
          <Link className="cta" href={l("/#cases")}>{t.pick} <span className="price">{money(price)}</span></Link>
          <Link className="cta lite" href={l("/buy?game=bundle")}>{t.bothShort} <span className="price">{money(bundle)}</span></Link>
        </div>
      </section>

      <section className="about-strip">
        <div>
          <h2>{t.aboutH}</h2>
          <p>{t.aboutP}</p>
          <Link href={l("/about")} className="more">{t.aboutMore}</Link>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}
