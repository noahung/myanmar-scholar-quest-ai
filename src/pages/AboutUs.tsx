import React from "react";

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif">Empowering Myanmar Scholars, Building Global Connections</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">Scholar-M is dedicated to supporting Myanmar students and young professionals in their pursuit of education, opportunity, and community—wherever they are in the world.</p>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Empowering Students" className="rounded-2xl shadow-lg mx-auto w-full max-w-xl" />
      </section>

      {/* What We Do */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm uppercase text-myanmar-maroon font-bold mb-2">What we do</h2>
            <h3 className="text-3xl font-extrabold mb-4 font-serif">Making a Difference, One Scholar at a Time.</h3>
            <p className="text-gray-700 mb-6">We connect, inform, and empower Myanmar students and professionals through:
            </p>
            <ul className="space-y-4 text-left">
              <li><span className="font-bold">Scholarship Discovery:</span> Curated listings and guidance to help you find and win scholarships worldwide.</li>
              <li><span className="font-bold">Community Support:</span> Forums and events to connect with peers, mentors, and alumni.</li>
              <li><span className="font-bold">Career & Study Resources:</span> Practical guides, tips, and real stories to help you succeed abroad and at home.</li>
              <li><span className="font-bold">Inspiration & Advocacy:</span> Sharing journeys, amplifying voices, and building hope for Myanmar's future.</li>
            </ul>
          </div>
          <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Community Support" className="rounded-2xl shadow-lg w-full" />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-extrabold font-serif mb-8">Our Vision & Mission</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold text-lg mb-2">Our Mission</h3>
              <p className="text-gray-700">To empower Myanmar's next generation by providing access to global opportunities, knowledge, and a supportive community.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Our Vision</h3>
              <p className="text-gray-700">A world where every Myanmar student can dream big, achieve more, and give back—no matter where they are.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Global Community</h3>
              <p className="text-gray-700">Connecting Myanmar scholars, alumni, and supporters across continents to share, uplift, and inspire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Friends. Family. Communities. */}
      <section className="bg-purple-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-purple-600 mb-6">Friends. Family. Communities.</h2>
          <p className="text-lg text-gray-700 mb-8">Together, we build bridges—across borders, backgrounds, and generations. Scholar-M is more than a platform; it's a movement for hope, learning, and belonging.</p>
          <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" alt="Community" className="rounded-2xl shadow-lg mx-auto w-full max-w-xl" />
        </div>
      </section>

      {/* Founder Bio */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thar Htet Aung (Noah)" className="w-32 h-32 rounded-full object-cover shadow-lg" />
          <div>
            <h3 className="text-xl font-bold mb-2">Meet the Founder</h3>
            <p className="font-serif text-lg mb-2">Thar Htet Aung (Noah)</p>
            <p className="text-gray-700">Based in the UK, Noah founded Scholar-M to give back to the Myanmar community and help students unlock their full potential. With a passion for education and global citizenship, he believes in the power of connection and opportunity to transform lives.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 