import { getLang } from "../../lib/lang";

export function generateMetadata() {
  return getLang() === "en"
    ? { title: "I have a code", description: "Have a team code? Type it here and go straight to your case.", alternates: { canonical: "/en/play" }, robots: { index: true, follow: true } }
    : { title: "عندي كود", description: "عندكم كود فريق؟ اكتبوه هنا وندخّلكم على قضيتكم مباشرة.", alternates: { canonical: "/play" }, robots: { index: true, follow: true } };
}

export default function PlayLayout({ children }) {
  return children;
}
