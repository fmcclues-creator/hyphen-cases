import Link from "next/link";

export default function Home() {
  const price = process.env.PRICE_KWD || 6;
  return (
    <main className="wrap">
      <nav className="nav"><span><b>HYPHEN</b> CASES</span><Link href="/play" style={{letterSpacing:0}}>عندي رمز</Link></nav>

      <section className="hero">
        <div>
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

      <section className="steps">
        <div className="step"><div className="n">١</div><b>اشتروا رمز الفريق</b><span>رمز واحد لكل فريق، يوصلكم فوراً.</span></div>
        <div className="step"><div className="n">٢</div><b>شغّلوه على التلفزيون</b><span>افتحوا اللعبة من الموبايل واعرضوا الشاشة.</span></div>
        <div className="step"><div className="n">٣</div><b>افتحوا موبايل خالد</b><span>طلّعوا الرقم السري من ملف القضية.</span></div>
        <div className="step"><div className="n">٤</div><b>سمّوا الجاني</b><span>محادثات، صور، مكالمات… ومكالمة تجيكم.</span></div>
      </section>

      <footer><span>© HYPHEN Events · الكويت</span><span>@hyphen.events</span></footer>
    </main>
  );
}
