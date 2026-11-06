import { Header, Footer } from "../components/Site";
import { getLang } from "../../lib/lang";

export function generateMetadata() {
  return getLang() === "en"
    ? { title: "Terms & Conditions", description: "Terms of use and purchase policy for HYPHEN Cases.", alternates: { canonical: "/en/terms" } }
    : { title: "الشروط والأحكام", description: "شروط استخدام ألعاب قضايا HYPHEN وسياسة الشراء.", alternates: { canonical: "/terms" } };
}

const IG = <a href="https://instagram.com/hyphen.events" target="_blank" rel="noreferrer">@hyphen.events</a>;

export default function Terms() {
  const lang = getLang();
  if (lang === "en") return (
    <main className="wrap">
      <Header lang="en" />
      <article className="prose">
        <h1>Terms & Conditions</h1>
        <h2>The product</h2>
        <p>“HYPHEN Cases” is a digital product: when you buy, you receive a team code that opens the game in the browser. Nothing is shipped and there is no physical product.</p>
        <h2>The code</h2>
        <ul>
          <li>One code is one team. It opens on up to <b>6 phones</b> that share the same progress; new phones can join during the first 3 hours after the team starts.</li>
          <li>An unused code never expires. From the moment the team starts playing, it has <b>4 days</b> to finish, on any of the team’s phones.</li>
          <li>A code cannot be shared with a second team; each team needs its own code. Once a case is solved, the code is spent.</li>
          <li>Each code includes both the Arabic and the English edition of its case.</li>
        </ul>
        <h2>Refunds</h2>
        <p><b>No refunds or exchanges after purchase</b>, because the product is digital and delivered instantly. If a technical fault stops you from opening the game at all, contact us within 7 days at {IG} and we will sort it out.</p>
        <h2>Payment</h2>
        <p>Payment by KNET or bank card through a payment gateway licensed in Kuwait. We never store card details.</p>
        <h2>Intellectual property</h2>
        <p>The story, characters, images and recordings belong to HYPHEN Events. Copying, republishing or commercial use without written permission is prohibited.</p>
        <h2>Privacy</h2>
        <p>We keep your phone number and email (if given) only to deliver your code and support you, and never share them with third parties.</p>
        <p className="muted">Last updated: November 2026</p>
      </article>
      <Footer lang="en" />
    </main>
  );
  return (
    <main className="wrap">
      <Header />
      <article className="prose">
        <h1>الشروط والأحكام</h1>
        <h2>المنتج</h2>
        <p>«قضايا HYPHEN» منتج رقمي: عند الشراء تستلمون كود فريق يفتح اللعبة في المتصفح. ما فيه شحن ولا منتج مادي.</p>
        <h2>الكود</h2>
        <ul>
          <li>الكود لفريق واحد، ويفتح على <b>٦ موبايلات</b> تشوف نفس التقدّم؛ الموبايلات الجديدة تقدر تنضم خلال أول ٣ ساعات من بداية الفريق.</li>
          <li>الكود ما له تاريخ انتهاء قبل الاستخدام، ومن أول ما يبدأ الفريق اللعب عنده <b>٤ أيام</b> يكمّلها من أي موبايل من موبايلات الفريق.</li>
          <li>مشاركة الكود مع فريق ثاني ما تشتغل؛ لكل فريق كود. وأول ما تنحل القضية يخلص الكود.</li>
          <li>كل كود يشمل النسخة العربية والإنجليزية من قضيته.</li>
        </ul>
        <h2>الاسترجاع</h2>
        <p><b>لا يوجد استرجاع أو استبدال بعد إتمام الشراء</b>، لأن المنتج رقمي ويُسلَّم فوراً. إذا صار خلل تقني يمنعكم من فتح اللعبة نهائياً، تواصلوا معنا خلال ٧ أيام على {IG} ونحلّها.</p>
        <h2>الدفع</h2>
        <p>الدفع عبر KNET أو البطاقات البنكية من خلال بوابة دفع مرخّصة في الكويت. ما نخزّن أي بيانات بطاقات.</p>
        <h2>الملكية الفكرية</h2>
        <p>القصة والشخصيات والصور والتسجيلات ملك لـ HYPHEN Events. ممنوع نسخها أو إعادة نشرها أو استخدامها تجارياً بدون إذن كتابي.</p>
        <h2>الخصوصية</h2>
        <p>نحتفظ برقم الموبايل والإيميل (إذا كتبتوه) لإرسال الكود ودعمكم فقط، ولا نشاركها مع أي طرف ثالث.</p>
        <p className="muted">آخر تحديث: نوفمبر ٢٠٢٦</p>
      </article>
      <Footer />
    </main>
  );
}
