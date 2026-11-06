import Link from "next/link";
import { Header, Footer } from "../components/Site";
import { getLang } from "../../lib/lang";

const metadataAr = {
  title: "عن HYPHEN",
  description:
    "HYPHEN Events شركة كويتية في مجال الفعاليات: الإنتاج والتنفيذ، تفعيلات العلامات التجارية، الأيام المفتوحة، والألعاب الجماعية اللي نصمّمها بأنفسنا.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "https://cases.hyphen-eventskw.com/about",
    title: "عن HYPHEN Events",
    description:
      "شركة كويتية في مجال الفعاليات: إنتاج وتنفيذ، تفعيلات للعلامات التجارية، أيام مفتوحة، وألعاب جماعية.",
    images: [{ url: "/og/og.png", width: 1200, height: 630 }],
  },
};

export function generateMetadata() {
  if (getLang() !== "en") return metadataAr;
  return {
    title: "About HYPHEN",
    description: "HYPHEN Events is a Kuwaiti events company: production and execution, brand activations, open days, and the group games we design ourselves.",
    alternates: { canonical: "/en/about" },
    openGraph: { type: "website", url: "https://cases.hyphen-eventskw.com/en/about", title: "About HYPHEN Events", description: "A Kuwaiti events company: production, brand activations, open days and group games.", images: [{ url: "/og/og.png", width: 1200, height: 630 }] },
  };
}

export default function About() {
  const lang = getLang();
  if (lang === "en") return (
    <main className="wrap">
      <Header lang="en" />
      <article className="prose">
        <img src="/wordmark.svg?v=2" alt="HYPHEN" style={{ height: 34, width: "auto", marginBottom: 18 }} />
        <h1>About HYPHEN</h1>
        <p><b>HYPHEN Events</b> is a Kuwaiti events company. We plan and deliver the event from the first idea to the last guest out of the door — for companies, brands, government bodies and families.</p>

        <h2>What we do</h2>
        <ul>
          <li><b>Production and execution</b> — designing and building events: stage, lighting, sound, décor, and full management on the day.</li>
          <li><b>Brand activations</b> — interactive experiences that let people live the brand, not just look at it: in malls, exhibitions and seasonal events.</li>
          <li><b>Open days and internal events</b> — open days, staff events, launches and seasonal occasions.</li>
          <li><b>Games and group experiences</b> — games we design ourselves for teams and families, from live events to the living room.</li>
        </ul>

        <h2>The interactive games</h2>
        <p>Our latest: a series of interactive co-op games played from the phone on the TV screen. In each one the team receives a case file and a locked phone, works out the passcode, follows the chats, photos, calls and recorded interviews… and has one hour to name the culprit and the place.</p>
        <p>Available now in Arabic and English: <Link href="/en">The Khalid Case</Link> and <Link href="/en#case-shaleh">The Chalet Case</Link>. More cases are on the way.</p>
        <ul>
          <li>Play as a team or on your own, on one TV.</li>
          <li>One code per team — nothing to print, nothing to install.</li>
          <li>Custom editions for events and companies (multiple teams, timed challenges).</li>
        </ul>

        <h2>Get in touch</h2>
        <p>For events, activations and custom editions of the games: <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a></p>
        <p><Link className="cta" href="/en/buy">Start investigating</Link></p>
      </article>
      <Footer lang="en" />
    </main>
  );
  return (
    <main className="wrap">
      <Header />
      <article className="prose">
        <img src="/wordmark.svg?v=2" alt="HYPHEN" style={{ height: 34, width: "auto", marginBottom: 18 }} />
        <h1>عن HYPHEN</h1>
        <p><b>HYPHEN Events</b> شركة كويتية في مجال الفعاليات. نخطّط وننفّذ الفعالية من الفكرة إلى آخر ضيف يطلع من الباب — للشركات والعلامات التجارية والجهات الحكومية والعوائل.</p>

        <h2>شنو نسوّي؟</h2>
        <ul>
          <li><b>الإنتاج والتنفيذ</b> — تصميم وبناء الفعاليات: الستيج، الإضاءة، الصوت، الديكور، والإدارة الكاملة يوم الحدث.</li>
          <li><b>تفعيلات العلامات التجارية (Activations)</b> — تجارب تفاعلية تخلّي الناس تعيش العلامة، مو بس تشوفها: في المجمّعات، المعارض، والمواسم.</li>
          <li><b>الأيام المفتوحة والفعاليات الداخلية</b> — Open Days، فعاليات الموظفين، حفلات الإطلاق، والمناسبات الموسمية.</li>
          <li><b>الألعاب والتجارب الجماعية</b> — ألعاب نصمّمها بأنفسنا للفرق والعوائل، من الفعالية الحضورية إلى البيت.</li>
        </ul>

        <h2>الألعاب التفاعلية</h2>
        <p>أحدث إضافاتنا: سلسلة ألعاب تفاعلية جماعية، تُلعب من الموبايل على شاشة التلفزيون. في كل لعبة يستلم الفريق ملف تحقيق وموبايل مقفول، يستخرج الرقم السري، ويتتبّع المحادثات والصور والمكالمات والمقابلات المصوّرة… وخلال ساعة واحدة عليه تحديد الجاني والمكان.</p>
        <p>متوفّرة الحين بالعربي والإنجليزي: <Link href="/">قضية خالد</Link> و<Link href="/#case-shaleh">قضية الشاليه</Link>. وتصدر الألعاب القادمة تباعاً.</p>
        <ul>
          <li>العب بفريق أو لوحدك، على تلفزيون واحد.</li>
          <li>كود واحد لكل فريق، ما تحتاجون أي طباعة ولا تطبيق.</li>
          <li>متوفّرة بنسخ خاصة للفعاليات والشركات (فرق متعددة، تحدّي بالوقت).</li>
        </ul>

        <h2>تواصلوا معنا</h2>
        <p>للفعاليات والتفعيلات والنسخ الخاصة من الألعاب: <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a></p>
        <p><Link className="cta" href="/buy">ابدأ التحقيق</Link></p>
      </article>
      <Footer />
    </main>
  );
}
