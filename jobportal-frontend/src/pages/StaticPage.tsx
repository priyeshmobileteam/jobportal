import React from 'react';
import { ArrowLeft, Mail, Shield, FileText, Info, AlertTriangle } from 'lucide-react';

export type StaticPageType = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

interface StaticPageProps {
  type: StaticPageType;
  onBack: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const getHeaderIcon = () => {
    switch (type) {
      case 'about':
        return <Info className="w-8 h-8 text-blue-600 dark:text-yellow-400" />;
      case 'contact':
        return <Mail className="w-8 h-8 text-blue-600 dark:text-yellow-400" />;
      case 'privacy':
        return <Shield className="w-8 h-8 text-blue-600 dark:text-yellow-400" />;
      case 'terms':
        return <FileText className="w-8 h-8 text-blue-600 dark:text-yellow-400" />;
      case 'disclaimer':
        return <AlertTriangle className="w-8 h-8 text-blue-600 dark:text-yellow-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'about':
        return 'About Us (हमारे बारे में)';
      case 'contact':
        return 'Contact Us (संपर्क करें)';
      case 'privacy':
        return 'Privacy Policy (गोपनीयता नीति)';
      case 'terms':
        return 'Terms & Conditions (नियम और शर्तें)';
      case 'disclaimer':
        return 'Disclaimer (अस्वीकरण)';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div className="space-y-6 text-sm md:text-base">
            <p>
              Welcome to <strong>Nokri.online</strong>, your number one source for all government jobs, recruitment notifications, exam results, admit cards, and answer keys. We are dedicated to providing you the very best of career updates, with a focus on accuracy, speed, and reliability.
            </p>
            <p>
              Nokri.online is a professional educational and career information platform. Here we will provide you only interesting and highly useful content, which you will like very much. We're working to turn our passion for career guidance into a booming online website.
            </p>
            <p>
              We cover all major exams and recruitment boards in India, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Railway Recruitment Board (RRB)</strong> - NTPC, Group D, ALP, JE</li>
              <li><strong>Staff Selection Commission (SSC)</strong> - CGL, CHSL, MTS, GD, CPO</li>
              <li><strong>State Police Recruitments</strong> - UP Police, Bihar Police, Delhi Police</li>
              <li><strong>Banking Exams</strong> - IBPS, SBI, RBI (PO and Clerk)</li>
              <li><strong>State PSC & UPSC</strong> - Civil services and state administrative services</li>
              <li><strong>Defense & Teacher Recruitments</strong> - Army, Navy, Air Force, CTET, UPTET</li>
            </ul>
            <p>
              We hope you find our updates helpful. If you have any questions or comments, please do not hesitate to contact us.
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Sincerely,<br />
              Team Nokri.online
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6 text-sm md:text-base">
            <p>
              If you have any queries, suggestions, feedback, or need help regarding any job notification, please feel free to reach out to us. We will try our best to respond to your queries as soon as possible.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-yellow-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</h4>
                  <a href="mailto:kaushal004vsu@gmail.com" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    kaushal004vsu@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Office Hours</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monday to Saturday: 10:00 AM to 6:00 PM (IST)</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Note: We do not charge any money for job updates. Please be aware of fake emails or calls claiming to be from Nokri.online.
            </p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 text-justify text-sm md:text-base">
            <p>
              At Nokri.online, accessible from https://nokri.online, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Nokri.online and how we use it.
            </p>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Log Files</h3>
            <p>
              Nokri.online follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Cookies and Web Beacons</h3>
            <p>
              Like any other website, Nokri.online uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Google DoubleClick DART Cookie</h3>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-605 dark:text-blue-400 hover:underline">https://policies.google.com/technologies/ads</a>.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Privacy Policies</h3>
            <p>
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Nokri.online, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p>
              Note that Nokri.online has no access to or control over these cookies that are used by third-party advertisers.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Consent</h3>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6 text-justify text-sm md:text-base">
            <p>
              By accessing this website we assume you accept these terms and conditions. Do not continue to use Nokri.online if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">License</h3>
            <p>
              Unless otherwise stated, Nokri.online and/or its licensors own the intellectual property rights for all material on Nokri.online. All intellectual property rights are reserved. You may access this from Nokri.online for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Republish material from Nokri.online</li>
              <li>Sell, rent or sub-license material from Nokri.online</li>
              <li>Reproduce, duplicate or copy material from Nokri.online</li>
              <li>Redistribute content from Nokri.online</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Content Liability</h3>
            <p>
              We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Disclaimer of Warranties</h3>
            <p>
              This website is provided "as is," with all faults, and Nokri.online expresses no representations or warranties, of any kind related to this website or the materials contained on this website. Also, nothing contained on this website shall be interpreted as advising you.
            </p>
          </div>
        );
      case 'disclaimer':
        return (
          <div className="space-y-6 text-justify text-sm md:text-base">
            <p>
              If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <strong>kaushal004vsu@gmail.com</strong>.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Disclaimers for Nokri.online</h3>
            <p>
              All the information on this website - https://nokri.online - is published in good faith and for general information purpose only. Nokri.online does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (Nokri.online), is strictly at your own risk. Nokri.online will not be liable for any losses and/or damages in connection with the use of our website.
            </p>
            <p>
              From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
            </p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">No Government Association</h3>
            <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-xl border border-red-100 dark:border-red-900/30 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-red-805 dark:text-red-400">Important Announcement / महत्वपूर्ण सूचना:</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Nokri.online is NOT affiliated with any Government Organization or Recruitment Board. We only collect recruitment updates and exam information from official government websites, newspapers, and portals. Candidates are advised to check details on official recruitment portals before submitting any forms or paying fees.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Consent</h3>
            <p>
              By using our website, you hereby consent to our disclaimer and agree to its terms.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-350 pb-16 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-wider text-blue-900 dark:text-yellow-500">NOKRI</span>
            <span className="text-xs font-bold bg-red-650 text-white px-1.5 py-0.5 rounded uppercase">Online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 md:p-10">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
            {getHeaderIcon()}
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
              {getTitle()}
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-405 leading-relaxed">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};
