import Link from "next/link";
import { Header, Footer, WA_HREF } from "./components/Site";
import { reactions } from "./reactions";

const SHOTS = [
  { src: "/shots/file.jpg", cap: "ملف القضية — بلاغ الاختفاء، أقوال المشتبهين، والأوراق اللي سلّمتها زوجته. منه تطلّعون كود الموبايل." },
  { src: "/shots/lock.jpg", cap: "موبايل خالد… مقفول. ٤ أرقام، والجواب مخبّى بين أوراق الملف." },
  { src: "/shots/chat.jpg", cap: "محادثاته كلها جدّامكم — واحد منهم كاتب شي ما يتوافق مع اللي قاله بالتحقيق." },
  { src: "/shots/interviews.jpg", cap: "مقابلات مصوّرة مع كل مشتبه. سمعوهم زين… وقارنوهم بالموبايل." },
  { src: "/shots/accuse.jpg", cap: "اللحظة الأخيرة: منو، ووين، ومتى. سمّوا الجاني وشوفوا إذا جبتوها صح." },
];

const FITS = [
  { e: "🛋️", t: "ديوانية", s: "كل واحد بموبايله، وكلكم على نفس القضية" },
  { e: "🏡", t: "زوارة أهل", s: "من ١٣ سنة يقدرون يشاركون" },
  { e: "💅", t: "عزيمة بنات", s: "قهوة، وقضية، وتهاوش على الجاني" },
  { e: "🎂", t: "عيد ميلاد", s: "فعالية حلوة حق عيد ميلاد" },
  { e: "🕵️", t: "بروحك", s: "ما عندك فريق؟ القضية تقدر تحلّها بروحك بعد" },
  // last, and the only one outlined: it is the one card that asks for a
  // conversation rather than a purchase
  { e: "💼", t: "فعالية شركة", s: "قضية مخصّصة باسم شركتكم، أو بطولة بين الفرق", href: WA_HREF },
];

const FAQ = [
  {
    q: "لازم تلفزيون؟",
    a: "لا. اللعبة كاملة على الموبايل وتنلعب بدون أي شي ثاني. التلفزيون يخلّيها أحلى للمجموعة — تعرضون عليه الملف والمكالمات والصور عشان الكل يشوف. من داخل اللعبة: ☰ القائمة ← 📺 العب على التلفزيون.",
  },
  {
    q: "جم واحد يقدر يلعب؟",
    a: "الكود لفريق واحد، ويفتح على ٦ موبايلات — كل واحد يكتب نفس الكود ويشوفون نفس التقدّم. أما عدد اللي حول الشاشة فمفتوح — ٣ أو ١٢، ما يفرق.",
  },
  {
    q: "مناسبة للمراهقين؟",
    a: "إي. ما فيها دم ولا مشاهد مخيفة — قراءة ومحادثات واستنتاج. نقترحها من ١٣ سنة وفوق، والأصغر يلعبون ضمن الفريق مع الكبار.",
  },
  {
    q: "وإذا ما خلّصنا بساعة؟",
    a: "ما يصير شي — ما فيه شي يقفل عليكم. الساعة هدف مو حد: الوقت يستمر ويتسجّل بالنتيجة النهائية، وتقدرون تكمّلون لين تسمّون الجاني. القضية مصمّمة تنحل بساعة تقريباً.",
  },
  {
    q: "نقدر نلعبها مرة ثانية؟",
    a: "القضية لها حل واحد، فأول ما تعرفون الجاني تروح متعة الإعادة على نفس الفريق. الكود صالح ٧ أيام — تقدرون تبدونها يوم وتكمّلونها يوم ثاني وتفتحونها من أكثر من موبايل. بس إذا تبون تلعبونها من الصفر مع مجموعة ثانية، تحتاجون كود ثاني.",
  },
  {
    q: "شلون يوصلنا الكود؟",
    a: "على الإيميل، فوراً بعد الدفع. تدفعون بـKNET أو بطاقة. وإذا ما وصل خلال دقايق، دوّروا عليه بالـspam أو راسلونا واتساب على ٩٤٤٢٦٤٢٦.",
  },
];

export default function Home() {
  const price = Number(process.env.PRICE_KWD || 4.75).toFixed(3);
  return (
    <main className="wrap">
      <Header />

      <section className="hero">
        <div>
          <div className="kicker">القضية الأولى</div>
          <h1>قضية <span>خالد</span></h1>
          <p>اختفى صاحب مجموعة مطاعم قبل أكبر صفقة بحياته بساعات. موبايله بين إيديكم… مقفول. عندكم ساعة وحدة، و٥ مشتبهين، وواحد منهم يچذب.</p>
          <div className="cta-row">
            <Link className="cta" href="/buy">ابدأ التحقيق <span className="price">{price} د.ك</span></Link>
            <Link className="cta lite" href="/buy?gift=1">🎁 اشتروها هدية</Link>
          </div>
          <div className="facts">
            <span>⏱ ساعة وحدة</span><span>👥 يفتح على ٦ موبايلات</span>
            <span>📺 على التلفزيون</span>
          </div>
        </div>

        {/* twenty seconds of the real thing — more convincing than any sentence */}
        <div className="phone">
          <video
            className="phone-screen"
            autoPlay muted loop playsInline preload="metadata"
            poster="/media/play-poster.jpg"
            aria-label="مقطع من اللعبة"
          >
            <source src="/media/play.webm" type="video/webm" />
            <source src="/media/play.mp4" type="video/mp4" />
          </video>
          <span className="phone-note">من داخل اللعبة</span>
        </div>
      </section>

      <section className="fits">
        <h2>مناسبة لـ</h2>
        <div className="fit-row">
          {FITS.map((f) => {
            const As = f.href ? "a" : "div";
            return (
              <As className="fit" key={f.t} {...(f.href ? { href: f.href, target: "_blank", rel: "noopener" } : {})}>
                <div className="fit-e" aria-hidden="true">{f.e}</div>
                <b>{f.t}</b>
                {f.s && <span>{f.s}</span>}
              </As>
            );
          })}
        </div>
      </section>

      <section className="steps" id="how">
        <div className="step"><div className="n">١</div><b>اشتروا كود الفريق</b><span>كود واحد لكل فريق، يوصلكم على الإيميل فوراً.</span></div>
        <div className="step"><div className="n">٢</div><b>شغّلوه على التلفزيون</b><span>فتحوا اللعبة من الموبايل وعرضوا الشاشة.</span></div>
        <div className="step"><div className="n">٣</div><b>فتحوا موبايل خالد</b><span>طلّعوا الرقم السري من ملف القضية.</span></div>
        <div className="step"><div className="n">٤</div><b>سمّوا الجاني</b><span>محادثات، صور، مقابلات… ومكالمة تجيكم.</span></div>
      </section>

      <section className="shots" id="look">
        <h2>شوفوا اللعبة</h2>
        <div className="shot-row">
          {SHOTS.map((s) => (
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

      {reactions.length > 0 && (
        <section className="says" id="says">
          <h2>اللي لعبوها</h2>
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
        <h2>القضايا</h2>
        <div className="grid">
          <Link href="/buy" className="case on">
            <div className="tag">متوفّرة</div>
            <b>قضية خالد</b>
            <span>اختفاء · ٥ مشتبهين · ساعة واحدة</span>
            <em>{price} د.ك</em>
          </Link>
          <div className="case soon">
            <div className="tag">قريباً</div>
            <b>قضية الشاليه</b>
            <span>سرقة · ٦ مشتبهين · ساعة واحدة · كشّاف على التلفزيون</span>
          </div>
          <div className="case soon">
            <div className="tag">قريباً</div>
            <b>قضية الوصية</b>
            <span>ميراث · ٦ مشتبهين · ساعة واحدة · فيها مطاردة</span>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2>أسئلة قبل ما تشترون</h2>
        {FAQ.map((f) => (
          <details className="qa" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section className="last">
        <h2>جاهزين؟</h2>
        <p>كود واحد، فريق واحد، ساعة وحدة — على ٦ موبايلات، وصالح ٧ أيام.</p>
        <div className="cta-row">
          <Link className="cta" href="/buy">ابداوا التحقيق <span className="price">{price} د.ك</span></Link>
          <Link className="cta lite" href="/buy?gift=1">🎁 اشتروها هدية</Link>
        </div>
      </section>

      <section className="about-strip">
        <div>
          <h2>من HYPHEN</h2>
          <p>HYPHEN Events شركة كويتية في مجال الفعاليات: إنتاج وتنفيذ، تفعيلات للعلامات التجارية، أيام مفتوحة، وألعاب جماعية نصمّمها بأنفسنا. أحدث إضافاتنا: ألعاب تفاعلية جماعية باللهجة الكويتية، تجمع العايلة والربع حول التلفزيون لساعة تحقيق.</p>
          <Link href="/about" className="more">اقرأ عنّا ←</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
