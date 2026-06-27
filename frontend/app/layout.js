import "./globals.css";

export const metadata = {
  title: "Level Inspired",
  description: "Live-price crypto trading portfolio dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
