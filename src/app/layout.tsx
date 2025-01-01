import Navbar from "../components/Navbar";
import AppKit from "./auth";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppKit>
          {" "}
          <Navbar />
          {children}
        </AppKit>
      </body>
    </html>
  );
}