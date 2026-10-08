import "./globals.css";

export const metadata = {
  title: "قضايا HYPHEN",
  description: "ألعاب تحقيق جماعية باللهجة الكويتية. افتحوا موبايل المفقود، وحلّوا القضية خلال ساعة.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
