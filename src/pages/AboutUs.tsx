import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 }
};
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
};

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff]/60 to-[#e0f7fa]/60">
      {/* Hero Section */}
      <motion.section
        className="max-w-4xl mx-auto pt-16 pb-8 px-4 flex flex-col md:flex-row items-center gap-10"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="flex-1 flex flex-col items-start justify-center text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-myanmar-maroon">Hello, I'm Thar Htet Aung</h1>
          <p className="text-lg md:text-xl text-myanmar-maroon/80 mb-6 max-w-xl">
            I'm a Myanmar-born developer, writer, and founder based in the UK. I created Scholar-M to empower Myanmar students with global opportunities, community, and AI-powered guidance. I also founded Curiosity Science Magazine (<a href="https://curiosityessays.com" className="underline text-myanmar-maroon font-semibold" target="_blank" rel="noopener noreferrer">curiosityessays.com</a>).
          </p>
          <a href="mailto:noah.aung@outlook.com" className="inline-block bg-myanmar-maroon text-white font-bold px-8 py-3 rounded-full shadow hover:bg-myanmar-gold/90 hover:text-myanmar-maroon transition-all">Send me an Email</a>
        </div>
        <div className="flex-shrink-0">
          <img src="https://curiosityessays.com/wp-content/uploads/2023/09/366380351_215020391540551_7239895495502079946_n.jpg?w=1024" alt="Thar Htet Aung" className="rounded-2xl shadow-lg object-cover w-[320px] h-[400px]" />
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-2xl mx-auto mb-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div className="flex-1 bg-white/80 rounded-2xl shadow p-6 flex flex-col items-center" variants={fadeInUp}>
          <span className="text-3xl font-bold text-myanmar-maroon mb-1">7+</span>
          <span className="text-myanmar-maroon/70 font-medium">Years Experience</span>
        </motion.div>
        <motion.div className="flex-1 bg-white/80 rounded-2xl shadow p-6 flex flex-col items-center" variants={fadeInUp}>
          <span className="text-3xl font-bold text-myanmar-maroon mb-1">30+</span>
          <span className="text-myanmar-maroon/70 font-medium">Projects Launched</span>
        </motion.div>
        <motion.div className="flex-1 bg-white/80 rounded-2xl shadow p-6 flex flex-col items-center" variants={fadeInUp}>
          <span className="text-3xl font-bold text-myanmar-maroon mb-1">2</span>
          <span className="text-myanmar-maroon/70 font-medium">Startups Founded</span>
        </motion.div>
      </motion.div>

      {/* About Scholar-M Section */}
      <motion.section
        className="max-w-4xl mx-auto mb-16 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 p-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-myanmar-maroon mb-2">About Scholar-M</h2>
            <p className="text-myanmar-maroon/80 mb-4">
              Scholar-M is a modern platform dedicated to connecting Myanmar students with global scholarship opportunities, practical resources, and a supportive community. Our mission is to break down barriers to international education and empower the next generation of Myanmar scholars.
            </p>
            <ul className="list-disc pl-6 text-myanmar-maroon/80 mb-4 space-y-2">
              <li><span className="font-bold text-myanmar-maroon">AI-Powered Guidance:</span> Get instant, personalized answers and recommendations for your study abroad journey.</li>
              <li><span className="font-bold text-myanmar-maroon">Curated Scholarships:</span> Discover up-to-date, relevant opportunities tailored for Myanmar students.</li>
              <li><span className="font-bold text-myanmar-maroon">Community Forum:</span> Connect, ask questions, and share experiences with peers and alumni.</li>
              <li><span className="font-bold text-myanmar-maroon">Bilingual Support:</span> Access resources and guidance in both English and Myanmar language.</li>
              <li><span className="font-bold text-myanmar-maroon">User Notes & Tools:</span> Save notes, track applications, and organize your journey in one place.</li>
            </ul>
            <div className="flex gap-3 mt-2">
              <a href="https://facebook.com/tharhtetaung" target="_blank" rel="noopener noreferrer" className="bg-myanmar-maroon/10 text-myanmar-maroon hover:bg-myanmar-maroon hover:text-white rounded-full p-2 transition-colors"><FaFacebookF /></a>
              <a href="https://linkedin.com/in/tharhtetaung" target="_blank" rel="noopener noreferrer" className="bg-myanmar-maroon/10 text-myanmar-maroon hover:bg-myanmar-maroon hover:text-white rounded-full p-2 transition-colors"><FaLinkedinIn /></a>
              <a href="https://twitter.com/tharhtetaung" target="_blank" rel="noopener noreferrer" className="bg-myanmar-maroon/10 text-myanmar-maroon hover:bg-myanmar-maroon hover:text-white rounded-full p-2 transition-colors"><FaTwitter /></a>
              <a href="https://curiosityessays.com" target="_blank" rel="noopener noreferrer" className="bg-myanmar-maroon/10 text-myanmar-maroon hover:bg-myanmar-maroon hover:text-white rounded-full p-2 transition-colors"><FaGlobe /></a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Work Process Section */}
      <motion.section id="work-process" className="py-16 px-4 bg-[#f8fafc]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-myanmar-maroon mb-8">Work Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <span className="inline-block bg-myanmar-gold/20 text-myanmar-maroon rounded-xl p-2 text-xl font-bold">1</span>,
                title: "Research",
                desc: "I dive deep into user needs, trends, and technology to inform every project."
              },
              {
                icon: <span className="inline-block bg-myanmar-gold/20 text-myanmar-maroon rounded-xl p-2 text-xl font-bold">2</span>,
                title: "Design",
                desc: "I create clean, modern, and accessible designs focused on real impact."
              },
              {
                icon: <span className="inline-block bg-myanmar-gold/20 text-myanmar-maroon rounded-xl p-2 text-xl font-bold">3</span>,
                title: "Develop",
                desc: "I build robust, scalable web apps and tools for students and communities."
              },
              {
                icon: <span className="inline-block bg-myanmar-gold/20 text-myanmar-maroon rounded-xl p-2 text-xl font-bold">4</span>,
                title: "Launch",
                desc: "I test, launch, and support projects to ensure lasting value and growth."
              },
            ].map((step, idx) => (
              <motion.div key={step.title} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * idx }}>
                <div className="mb-3">{step.icon}</div>
                <h4 className="font-bold text-lg text-myanmar-maroon mb-2">{step.title}</h4>
                <p className="text-myanmar-maroon/70 text-base">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
} 