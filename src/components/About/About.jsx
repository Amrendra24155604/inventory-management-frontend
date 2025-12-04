import { Link } from "react-router-dom"; // Make sure this is at the top of your file

function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          About <span className="text-blue-600 dark:text-blue-400">InventoryPro</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          InventoryPro is a student-driven platform designed to simplify how college societies manage shared resources — enabling members to borrow, return, and track components with ease.
        </p>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-10 text-left mt-12">
          {[
            {
              title: "Our Mission",
              desc: "To support student innovation by making technical components accessible, organized, and easy to manage — so ideas can turn into impact without logistical hurdles.",
            },
            {
              title: "Why It Matters",
              desc: "Society tools and components often go underutilized or get misplaced. InventoryPro ensures every item is accounted for, empowering teams to build confidently and collaboratively.",
            },
            {
              title: "Built by Students",
              desc: "Created at IOT LABS, this system reflects the needs of real student builders — with intuitive design, role-based access, and a focus on hands-on learning.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of the Build Culture</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Whether you're prototyping a robot, organizing a tech fest, or just borrowing a multimeter — InventoryPro helps your society stay organized, efficient, and ready to build.
          </p>
         
<Link
  to="/inventory"
  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
>
  Explore Features
</Link>

        </div>
      </section>
    </main>
  );
}

export default About;