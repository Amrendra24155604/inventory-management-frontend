import { NavLink } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Copyright */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()} InventoryPro. All rights reserved.
        </div>

        {/* Center: External Links with Icons */}
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          <a
            href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A14611540&keywords=iot%20lab%2C%20kiit&origin=RICH_QUERY_SUGGESTION&position=0&searchId=5234f57b-9ba0-4f5b-937c-1e571fc9803d&sid=B.I&spellCorrectionEnabled=false"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <FaLinkedin /> LinkedIn
          </a>
          <a
            href="https://www.instagram.com/your-page"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-pink-500 transition"
          >
            <FaInstagram /> Instagram
          </a>
          <a
            href="https://twitter.com/your-handle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <FaTwitter /> Twitter
          </a>
          <a
            href="iot.lab@kiit.ac.in"
            className="flex items-center gap-2 hover:text-green-600 transition"
          >
            <FaEnvelope /> Email
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;