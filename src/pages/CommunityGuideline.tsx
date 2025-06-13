import React from 'react';

const CommunityGuideline: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h1 className="text-3xl font-bold mb-6 text-myanmar-maroon">Community Guidelines</h1>
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 text-base leading-relaxed space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Welcome to the Myanmar Scholar Community</h2>
          <p>
            Our community is dedicated to supporting Myanmar students and scholars in their pursuit of international education and opportunities. To ensure a safe, respectful, and productive environment for all, we kindly ask you to follow these guidelines.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">1. Be Respectful</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Treat all members with courtesy and respect, regardless of background, beliefs, or opinions.</li>
            <li>Personal attacks, harassment, hate speech, or discrimination of any kind will not be tolerated.</li>
            <li>Use polite language and avoid inflammatory or offensive remarks.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">2. Stay On Topic</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Keep discussions relevant to scholarships, study abroad, academic life, and related topics.</li>
            <li>Avoid spamming, advertising, or posting unrelated content.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">3. Protect Privacy</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Do not share personal information (yours or others') such as addresses, phone numbers, or private messages without consent.</li>
            <li>Respect the confidentiality of scholarship applications and sensitive documents.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">4. Share Constructively</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Offer helpful advice, encouragement, and constructive feedback.</li>
            <li>When sharing resources, ensure they are accurate, up-to-date, and from reputable sources.</li>
            <li>Give credit to original authors and avoid plagiarism.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">5. Report Issues</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>If you encounter inappropriate behaviour or content, please report it to the moderators or site administrators.</li>
            <li>We are committed to maintaining a positive and inclusive community for everyone.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">6. Follow the Law</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Do not post or request illegal content, including but not limited to pirated materials or fraudulent documents.</li>
            <li>Respect copyright and intellectual property rights at all times.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Thank You</h3>
          <p>
            Thank you for being a valued member of our community. By participating, you help create a welcoming and supportive space for all Myanmar scholars. Let us work together to inspire, empower, and uplift each other.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CommunityGuideline;
