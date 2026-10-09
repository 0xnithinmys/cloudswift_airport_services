import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttrs }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
