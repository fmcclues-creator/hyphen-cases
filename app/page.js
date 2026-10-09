import Link from "next/link";
import { Header, Footer } from "./components/Site";

export default function Home() {
  const price = process.env.PRICE_KWD || 6;
  return (
    <main className="wrap">
      <Header />

      <section className="hero">
        <div>
          <div className="kicker">القضية الأولى</div>
          <h1>قضية <span>خالد</span></h1>
          <p>اختفى صاحب مجموعة مطاعم قبل أكبر صفقة في حياته بساعات. موبايله بين يديكم، مقفل. عندكم ساعة وحدة، وخمسة مشتبهين.</p>
          <Link className="cta" href="/buy">ابدأ التحقيق <span className="price">{price} د.ك للفريق</span></Link>
          <div className="facts"><span>⏱ ساعة واحدة</span><span>👥 ٢ – ٨ لاعبين</span><span>📺 على التلفزيون</span><span>🇰🇼 باللهجة الكويتية</span></div>
        </div>
        <div className="folder"><div className="sheet">
          <div className="dept">إدارة البحث والتحرّي الجنائي</div>
          <small>رقم الملف K-0810</small>
          <div className="name">خالد</div>
          <small>بلاغ اختفاء</small>
          <div className="stamp">سرّي · عاجل</div>
        </div></div>
      </section>

      <section className="steps" id="how">
        <div className="step"><div className="n">١</div><b>اشتروا رمز الفريق</b><span>رمز واحد لكل فريق، يوصلكم فوراً.</span></div>
        <div className="step"><div className="n">٢</div><b>شغّلوه على التلفزيون</b><span>افتحوا اللعبة من الموبايل واعرضوا الشاشة.</span></div>
        <div className="step"><div className="n">٣</div><b>افتحوا موبايل خالد</b><span>طلّعوا الرقم السري من ملف القضية.</span></div>
        <div className="step"><div className="n">٤</div><b>سمّوا الجاني</b><span>محادثات، صور، مقابلات… ومكالمة تجيكم.</span></div>
      </section>

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
            <b>القضية الثانية</b>
            <span>قاعدين نكتبها… تابعونا على إنستغرام.</span>
          </div>
        </div>
      </section>

      <section className="about-strip">
        <div>
          <h2>من HYPHEN</h2>
          <p>HYPHEN Events شركة كويتية في مجال الفعاليات: إنتاج وتنفيذ، تفعيلات للعلامات التجارية، أيام مفتوحة، وألعاب جماعية نصمّمها بأنفسنا. «قضايا» أحدث مشاريعنا: قضية تحقيق كاملة بالكويتي، تجمع العايلة والربع حول التلفزيون لساعة.</p>
          <Link href="/about" className="more">اقرأ عنّا ←</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
