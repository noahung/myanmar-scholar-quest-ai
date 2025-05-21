import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { AiAssistant } from '@/components/ai-assistant';
import { motion } from 'framer-motion';
import { AICompanionChatOnly } from '@/components/ai-companion-chat-only';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 }
};
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const faqs = [
  {
    question: 'What is Scholar-M?',
    answer: 'Scholar-M is a platform dedicated to connecting Myanmar students with international scholarship opportunities, AI-powered guidance, and a supportive community.'
  },
  {
    question: 'Is Scholar-M free to use?',
    answer: 'Yes, Scholar-M is completely free for Myanmar students. There are no fees or charges for using our core services.'
  },
  {
    question: 'How do I find scholarships on Scholar-M?',
    answer: 'Browse the Scholarships page and use filters to narrow down by country, field, or degree. Each listing includes details and deadlines.'
  },
  {
    question: 'How does the AI Assistant help me?',
    answer: 'The AI Assistant answers your questions, helps you find scholarships, and provides tips for applications—all in English or Myanmar.'
  },
  {
    question: 'How do I join the community?',
    answer: 'Visit the Community page to join discussions, ask questions, and connect with other Myanmar students and alumni.'
  },
  {
    question: 'How is my data protected?',
    answer: 'We use secure authentication and industry best practices to protect your data. Your information is never sold to third parties.'
  },
  {
    question: 'Can I save notes or AI answers?',
    answer: 'Yes, you can save your own notes and AI responses for future reference—perfect for tracking your application journey.'
  },
];

export default function StaticPage() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading slash
    const pathToTitle: Record<string, string> = {
      'about': 'About Us',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'faq': 'Frequently Asked Questions'
    };

    setTitle(pathToTitle[path] || 'Page');
    fetchPageContent(path);
  }, [location]);

  async function fetchPageContent(pageId: string) {
    setLoading(true);

    try {
      // Check if we have this page in the database
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('page_id', pageId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No content found, show default content
          setContent(getDefaultContent(pageId));
        } else {
          console.error('Error fetching page content:', error);
          toast({
            title: 'Error',
            description: 'Failed to load page content.',
            variant: 'destructive',
          });
          setContent('Content not available at this time.');
        }
      } else {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error in fetchPageContent:', error);
      setContent('Content not available at this time.');
    } finally {
      setLoading(false);
    }
  }

  function getDefaultContent(pageId: string): string {
    switch (pageId) {
      case 'about':
        return `
          <h1>About Scholar-M</h1>
          <p>Scholar-M is a comprehensive platform dedicated to connecting Myanmar students with international scholarship opportunities. Our mission is to make quality education accessible to talented students from Myanmar by providing accurate information, guidance, and community support.</p>
          
          <h2>Our Mission</h2>
          <p>To empower Myanmar students to pursue higher education abroad by breaking down information barriers and building a supportive community of scholars.</p>
          
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Curated Scholarships:</strong> We research and compile scholarship opportunities specifically available to Myanmar students.</li>
            <li><strong>Application Guides:</strong> Step-by-step guidance on the application process for various scholarships and programs.</li>
            <li><strong>Community Support:</strong> Connect with fellow Myanmar scholars who can share their experiences and advice.</li>
            <li><strong>AI Assistance:</strong> Get instant answers to your questions through our AI assistant trained on scholarship information.</li>
          </ul>
          
          <h2>Our Team</h2>
          <p>Scholar-M was founded by a group of Myanmar scholars who experienced firsthand the challenges of finding and applying for international scholarships. Our team includes alumni from various international universities who are passionate about giving back to the community.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions or suggestions, please feel free to contact us at <a href="mailto:contact@scholar-m.org">contact@scholar-m.org</a>.</p>
        `;
      case 'privacy':
        return `
          <h1>Privacy Policy</h1>
          <p>Last updated: May 8, 2025</p>
          
          <p>This Privacy Policy describes how Scholar-M ("we," "us," or "our") collects, uses, and discloses your information when you use our website at scholar-m.org (the "Service").</p>
          
          <h2>Information We Collect</h2>
          <p>We collect several types of information from and about users of our Service, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> This includes your name, email address, and profile information if you create an account.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our Service, such as pages visited and search queries.</li>
            <li><strong>Device Information:</strong> Information about the device you use to access our Service.</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Personalize your experience</li>
            <li>Improve our Service</li>
            <li>Communicate with you</li>
            <li>Ensure the security of our Service</li>
          </ul>
          
          <h2>Sharing Your Information</h2>
          <p>We do not sell your personal information to third parties. We may share your information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
          </ul>
          
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access the personal information we have about you</li>
            <li>Correct inaccuracies in your personal information</li>
            <li>Delete your personal information</li>
            <li>Object to or restrict processing of your personal information</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@scholar-m.org">privacy@scholar-m.org</a>.</p>
        `;
      case 'terms':
        return `
          <h1>Terms of Service</h1>
          <p>Last updated: May 8, 2025</p>
          
          <p>Please read these Terms of Service ("Terms") carefully before using the Scholar-M website (the "Service") operated by Scholar-M ("us", "we", or "our").</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.</p>
          
          <h2>2. Use of the Service</h2>
          <p>The Scholar-M service is provided for informational purposes only. While we strive to keep information accurate and up-to-date, we make no guarantees regarding the completeness, accuracy, or reliability of any scholarship information provided.</p>
          
          <h2>3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.</p>
          
          <h2>4. User Content</h2>
          <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post on or through the Service.</p>
          
          <h2>5. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Scholar-M. The Service is protected by copyright, trademark, and other laws.</p>
          
          <h2>6. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          
          <h2>7. Limitation of Liability</h2>
          <p>In no event shall Scholar-M, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
          
          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@scholar-m.org">legal@scholar-m.org</a>.</p>
        `;
      case 'faq':
        return `
          <h1>Frequently Asked Questions</h1>
          
          <div class="faq-item">
            <h3>What is Scholar-M?</h3>
            <p>Scholar-M is a platform dedicated to connecting Myanmar students with international scholarship opportunities. We provide information on scholarships, application guides, and a community forum to support students in their education journey.</p>
          </div>
          
          <div class="faq-item">
            <h3>Is Scholar-M free to use?</h3>
            <p>Yes, Scholar-M is completely free for Myanmar students. Our mission is to make educational opportunities more accessible, so there are no fees or charges for using our core services.</p>
          </div>
          
          <div class="faq-item">
            <h3>How do I find scholarships on Scholar-M?</h3>
            <p>You can browse all available scholarships on our Scholarships page. Use the filters to narrow down options by country, field of study, or degree level. Each scholarship listing includes detailed information about eligibility, benefits, and application requirements.</p>
          </div>
          
          <div class="faq-item">
            <h3>Can Scholar-M help me with my scholarship application?</h3>
            <p>While we don't offer personalized application services, we provide comprehensive guides for different scholarship programs. Our community forum is also a great place to connect with peers and alumni who can share their experiences and advice.</p>
          </div>
          
          <div class="faq-item">
            <h3>How accurate is the scholarship information?</h3>
            <p>We strive to provide the most accurate and up-to-date information possible. However, scholarship details such as deadlines and requirements may change. We always recommend verifying information on the official scholarship website before applying.</p>
          </div>
          
          <div class="faq-item">
            <h3>What is the AI Assistant and how does it work?</h3>
            <p>Our AI Assistant is a chatbot that can answer questions about scholarships, application processes, and studying abroad. It's trained on our scholarship database and general information about higher education. While it's a helpful resource, complex or specific questions might still require human expertise.</p>
          </div>
          
          <div class="faq-item">
            <h3>Can I contribute to Scholar-M?</h3>
            <p>Yes! We welcome contributions from the community. You can share your scholarship experience in the Community section, suggest new scholarships to be added to our database, or report any outdated information you find.</p>
          </div>
          
          <div class="faq-item">
            <h3>How do I contact the Scholar-M team?</h3>
            <p>You can reach out to us via email at contact@scholar-m.org. We aim to respond to all inquiries within 48 hours.</p>
          </div>
        `;
      default:
        return '<p>Content not available for this page.</p>';
    }
  }

  // Custom FAQ layout for /faq
  if (location.pathname === '/faq') {
    return (
      <div className="bg-white flex flex-col">
        <motion.div
          className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12 py-16 px-4"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Left: FAQ */}
          <div className="flex-1 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-myanmar-maroon">How can we help you?</h1>
            <Accordion type="single" collapsible className="w-full divide-y divide-gray-100 border rounded-xl shadow-sm">
              {faqs.map((faq, idx) => (
                <AccordionItem key={faq.question} value={`faq-${idx}`} className="border-0">
                  <AccordionTrigger className="text-lg font-semibold text-myanmar-maroon px-6 py-5 hover:bg-gray-50 focus:bg-gray-50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-myanmar-maroon/80 px-6 pb-5 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          {/* Right: AI Chat */}
          <motion.div
            className="w-full md:w-[400px] flex-shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-0 border border-gray-100 overflow-hidden">
                {/* Render only the chat container from AICompanion, not the welcome header */}
                <AICompanionChatOnly />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Default: render as before
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-1/4 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-8">{title}</h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
