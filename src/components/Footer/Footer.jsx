import { FaLinkedin, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className=" border-t border-slate-200 bg-slate-50/95 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: brand + copy */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white text-sm font-semibold shadow-sm">
              I
            </div>
            <div className="flex flex-col text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                InventoryPro • IOT Labs
              </span>
              <span>© {year} InventoryPro. Built for student builders.</span>
            </div>
          </div>

          {/* Right: social / contact */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <a
              href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A14611540&keywords=iot%20lab%2C%20kiit&origin=RICH_QUERY_SUGGESTION&position=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-sky-600 transition"
            >
              <FaLinkedin className="text-sm" />
              <span className="hidden xs:inline">LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-pink-500 transition"
            >
              <FaInstagram className="text-sm" />
              <span className="hidden xs:inline">Instagram</span>
            </a>
            <a
              href="https://twitter.com/your-handle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-sky-400 transition"
            >
              <FaTwitter className="text-sm" />
              <span className="hidden xs:inline">Twitter</span>
            </a>
            <a
              href="mailto:iot.lab@kiit.ac.in"
              className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition"
            >
              <FaEnvelope className="text-sm" />
              <span className="hidden xs:inline">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
