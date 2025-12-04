import {Meteors} from "../meteors/meteors.jsx";

// function Contact() {
//   return (
//     <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
//       {/* Meteors Background */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <Meteors />
//       </div>

//       {/* Foreground Content */}
//       <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
//         <h1 className="text-4xl font-bold mb-4">
//           Get in <span className="text-blue-600 dark:text-blue-400">Touch</span>
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//           Have questions, suggestions, or need support? We're here to help you build smarter.
//         </p>

//         {/* Contact Form */}
//         <form className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-left">
//           <div className="mb-6">
//             <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Name</label>
//             <input
//               type="text"
//               placeholder="Your full name"
//               className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Email</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Message</label>
//             <textarea
//               rows="5"
//               placeholder="Tell us what’s on your mind..."
//               className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             ></textarea>
//           </div>
//           <button
//             type="submit"
//             className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
//           >
//             Send Message
//           </button>
//         </form>

//         {/* Contact Info */}
//         <div className="mt-12 text-gray-600 dark:text-gray-400 text-left space-y-2">
//           <p><strong>Location:</strong> IOT LABS, Bhubaneswar, Odisha</p>
//           <p><strong>Email:</strong> iot.lab@kiit.ac.in</p>
//           <p><strong>Phone:</strong> +91 00000 00000</p>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default Contact;
import { useRef } from "react";
import emailjs from "emailjs-com";

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_nabix63",   // from EmailJS
        "template_5ta0i7k",  // from EmailJS
        form.current,
        "MYjA4I_zQtRwXLWhQ"    // from EmailJS
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
        },
        (error) => {
          alert("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Meteors />
      </div>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          Get in <span className="text-blue-600 dark:text-blue-400">Touch</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Have questions, suggestions, or need support? We're here to help you build smarter.
        </p>

        {/* Contact Form */}
       <form
  ref={form}
  onSubmit={sendEmail}
  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-left space-y-6"
>
  <div>
    <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
      Name
    </label>
    <input
      type="text"
      name="user_name"
      placeholder="Your full name"
      required
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div>
    <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
      Email
    </label>
    <input
      type="email"
      name="user_email"
      placeholder="you@example.com"
      required
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div>
    <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
      Message
    </label>
    <textarea
      name="message"
      rows="5"
      placeholder="Tell us what’s on your mind..."
      required
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>
  <button
    type="submit"
    className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
  >
    Send Message
  </button>
</form>

        {/* Contact Info */}
        <div className="mt-12 text-gray-600 dark:text-gray-400 text-left space-y-2">
          <p><strong>Location:</strong> IOT LABS, Bhubaneswar, Odisha</p>
          <p><strong>Email:</strong> iot.lab@kiit.ac.in</p>
          <p><strong>Phone:</strong> +91 00000 00000</p>
        </div>
      </section>
    </main>
  );
}

export default Contact;