import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { FaPlus, FaBoxes, FaHandHolding, FaUndo, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white relative overflow-hidden">
      {/* Blurable Content */}
      <div className={`transition duration-300 ${menuOpen ? "blur-sm scale-[0.98]" : "blur-0 scale-100"}`}>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-blue-600 dark:text-blue-400">
              <Typewriter
                words={[
                  "IOT LABS",
                  "Welcomes you to InventoryPro",
                  "Borrow. Build. Achieve.",
                  "Share , Build , Grow.",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
             Streamlining access to shared components so students can focus on building, experimenting, and innovating together.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/inventory" className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
              Get Started
            </Link>
            <Link to="/learn" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition">
              Learn More
            </Link>
          </div>
        </section>
        {/* Features Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16 relative z-10">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
            {[
  {
    icon: <FaBoxes className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
    title: "Borrow & Return System",
    desc: "Easily request, borrow, and return society-owned components for your technical projects.",
  },
  {
    icon: <FaUndo className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
    title: "Usage Insights",
    desc: "Track borrowing history, popular items, and usage patterns to optimize resource planning.",
  },
  {
    icon: <FaUsers className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
    title: "Member Roles & Access",
    desc: "Assign roles to team leads, coordinators, and members to manage inventory securely and efficiently.",
  },
].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-gray-900 rounded shadow hover:shadow-md transition">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

  
    </main>
  );
}

export default Home;    {/* Floating Action Button + Menu */}
      {/* <div className="fixed bottom-6 right-6 z-50"> */}
        {/* Menu Options */}
        {/* <div
          className={`absolute bottom-20 right-0 flex flex-col items-end gap-4 transition-all duration-500 ${
            menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-4 pointer-events-none"
          }`}
        >
          {[
            { icon: <FaBoxes />, label: "Inventory", path: "/inventory" },
            { icon: <FaHandHolding />, label: "Borrow", path: "/borrow" },
            { icon: <FaUndo />, label: "Return", path: "/return" },
            { icon: <FaUsers />, label: "Teams", path: "/Teams" },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="bg-white dark:bg-gray-700 shadow rounded-full px-4 py-2 flex items-center gap-2 hover:scale-105 hover:shadow-lg transition text-gray-800 dark:text-white"
            >
              <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div> */}

        {/* Main FAB */}
        {/* <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition ${
            menuOpen ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          <FaPlus size={24} />
        </button> */}
      {/* </div> */}