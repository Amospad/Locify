import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/**
 * Poppins es la tipografía del wordmark y del sistema de UI (identidad LOCIFY,
 * SIL OFL 1.1). Sus pesos los eligen los componentes (400/500/600; el 600 es el
 * peso del wordmark). La variable --font-poppins se conecta al token
 * --font-sans en globals.css.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOCIFY — Encuentra tu parqueadero en segundos",
  description:
    "Reserva garantizada con check-in por QR y pago automático, o reserva exprés antes de llegar. Celdas reales en tiempo real.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/**
 * El color del tema pinta la barra del navegador/instalador de la PWA con el
 * Azul Acero de la marca (complementa theme_color del manifest).
 */
export const viewport: Viewport = {
  themeColor: "#2F5D9F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fondo font-sans text-grafito">
        {children}
      </body>
    </html>
  );
}
