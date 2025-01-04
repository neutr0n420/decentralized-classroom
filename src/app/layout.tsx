import Navbar from "../components/Navbar";
import AppKit from "./auth";
import HuddleClientComponent from "../context/huddle";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-purple-900 h-screen relative">
        <AppKit>
          {" "}
          <div className="absolute top-0 right-0 left-0">
            <Navbar />
          </div>
          <HuddleClientComponent>{children}</HuddleClientComponent>
        </AppKit>
      </body>
    </html>
  );
}
