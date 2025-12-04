function More() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center relative z-10">
      <div className="max-w-7xl mx-auto px-6 w-full text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-6">
          Want to <span className="text-blue-600 dark:text-blue-400">Explore More?</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover additional resources, guides, and community support to help you build smarter.
        </p>

        {/* Grid of More Options */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Documentation",
              desc: "Step-by-step guides and API references to get the most out of InventoryPro.",
              link: "/docs",
            },
            {
              title: "Community Forum",
              desc: "Join discussions, ask questions, and share your projects with peers.",
              link: "/community",
            },
            {
              title: "FAQs",
              desc: "Find quick answers to common questions about borrowing, returning, and managing resources.",
              link: "/faq",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-xl transition duration-300 text-left"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{item.desc}</p>
              </div>
              <a
                href={item.link}
                className="inline-block px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition text-center"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default More;