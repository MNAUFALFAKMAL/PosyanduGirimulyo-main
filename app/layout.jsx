import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

export const metadata = {
  title: "Posyandu Girimulyo",
  description: "Portal informasi dan kalkulator gizi untuk pencegahan stunting.",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
