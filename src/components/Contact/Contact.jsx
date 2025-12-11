import { motion } from "framer-motion";
import { useRef } from "react";
import emailjs from "emailjs-com";

function Contact() {
  const formRef = useRef(null);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_nabix63",
        "template_5ta0i7k",
        formRef.current,
        "MYjA4I_zQtRwXLWhQ"
      )
      .then(
        () => alert("Message sent successfully!"),
        () => alert("Failed to send message. Please try again.")
      );
  };

  return (
    <div className="w-full">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px -10%", once: false }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500">
            Contact
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Plug into the{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              lab network.
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300">
            Questions, new ideas, or want to run this in another society? Drop a
            message — the coordinators read everything.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-lg overflow-hidden dark:border-slate-800 dark:bg-slate-900/90"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px -10%", once: false }}
          transition={{ duration: 0.5 }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" />
          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="relative space-y-5 text-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Share what you're building, or how we can help..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 resize-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-50"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/40 hover:bg-sky-400 transition"
            >
              Send message
            </button>
          </form>

          <div className="mt-8 grid gap-4 text-xs text-slate-600 sm:grid-cols-3 dark:text-slate-300/80">
            <p>
              <span className="font-semibold text-sky-600 dark:text-sky-300">
                Lab:
              </span>{" "}
              IOT LABS, Bhubaneswar
            </p>
            <p>
              <span className="font-semibold text-sky-600 dark:text-sky-300">
                Email:
              </span>{" "}
              iot.lab@kiit.ac.in
            </p>
            <p>
              <span className="font-semibold text-sky-600 dark:text-sky-300">
                Phone:
              </span>{" "}
              +91 00000 00000
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Contact;
