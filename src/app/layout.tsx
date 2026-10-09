import type { Metadata } from "next";
import { Bricolage_Grotesque, Cinzel, Instrument_Serif, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import { INTRO_KEY } from "@/lib/logo";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

// Roman-capital wordmark face for the "ELOHIM" brand name.
const brand = Cinzel({
  variable: "--font-brand",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — Meet & Greet, VIP Fast Track & Transit`,
    template: `%s | ${site.fullName}`,
  },
  description: site.description,
};

// Some browser extensions (e.g. Bitdefender adds `bis_skin_checked`) stamp attributes onto every element
// before React hydrates, which triggers hydration-mismatch errors. Strip them as they appear, during
// HTML parsing and before hydration, then stop watching once the page has settled.
const stripExtensionAttrs = `(function(){
  var A=["bis_skin_checked","bis_register","__processed_"];
  var sel=A.map(function(a){return "["+a+"]";}).join(",");
  function clean(el){for(var i=0;i<A.length;i++)el.removeAttribute(A[i]);}
  function strip(n){if(n.nodeType!==1)return;clean(n);var l=n.querySelectorAll(sel);for(var i=0;i<l.length;i++)clean(l[i]);}
  var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];
    if(m.type==="attributes")m.target.removeAttribute(m.attributeName);
    else for(var j=0;j<m.addedNodes.length;j++)strip(m.addedNodes[j]);}});
  mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:A});
  strip(document.documentElement);
  setTimeout(function(){mo.disconnect();},10000);
  // ignore promise rejections thrown from inside browser-extension scripts (not our code)
  window.addEventListener("unhandledrejection",function(e){
    var s=(e.reason&&e.reason.stack)||"";
    if(s.indexOf("chrome-extension://")>-1||s.indexOf("moz-extension://")>-1)e.preventDefault();
  });
})();`;

// Skip the intro before first paint on repeat visits in the same session and for reduced-motion users.
// Kept in the same <script> as the attribute stripper: React warns about each extra <script> it has to create on the client.
const introSeen = `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro-seen","")}catch(e){};`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${brand.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeen + stripExtensionAttrs }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <Providers>
          <Intro />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
