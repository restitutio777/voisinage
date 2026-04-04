import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../lib/usePageTitle';
import { Logo } from '../../components/Logo';
import { FooterLinks } from '../../components/FooterLinks';

interface FAQ {
  question: string;
  answer: string;
}

interface ContentSection {
  title: string;
  text: string;
}

interface SeoLandingPageProps {
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  h1: string;
  subtitle: string;
  sections: ContentSection[];
  faqs: FAQ[];
  ctaTitle: string;
  ctaText: string;
}

export function SeoLandingPage({
  pageTitle,
  metaTitle,
  metaDescription,
  canonicalPath,
  h1,
  subtitle,
  sections,
  faqs,
  ctaTitle,
  ctaText,
}: SeoLandingPageProps) {
  usePageTitle(pageTitle);
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (postalCode.length === 5) {
      navigate(`/?cp=${postalCode}`);
    } else {
      navigate('/');
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://voisinage.app${canonicalPath}`} />
        <link rel="canonical" href={`https://voisinage.app${canonicalPath}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft size={24} />
            <span className="text-lg">Retour</span>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm font-bold text-stone-800" style={{ fontFamily: "'Nunito', sans-serif" }}>Voisinage</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 pt-10 pb-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-3 leading-tight">{h1}</h1>
        <p className="text-sm text-stone-500 leading-relaxed max-w-md mx-auto mb-8">{subtitle}</p>

        <form onSubmit={handleSearch} className="max-w-sm mx-auto">
          <div className="flex items-stretch bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <div className="flex items-center flex-1 px-4">
              <MapPin className="text-stone-400 flex-shrink-0" size={18} />
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Votre code postal"
                className="flex-1 ml-3 py-3 text-stone-800 placeholder:text-stone-300 bg-transparent outline-none text-base"
                maxLength={5}
                inputMode="numeric"
              />
            </div>
            <button
              type="submit"
              className="bg-sun hover:bg-sun-dark text-white px-5 flex items-center justify-center transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Content sections */}
      <div className="px-4 pb-6">
        <div className="space-y-6 max-w-lg mx-auto">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-stone-800 mb-2">{section.title}</h2>
              <p className="text-sm text-stone-500 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-stone-800 mb-4 text-center">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-stone-50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-stone-800 mb-1">{faq.question}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 p-6 text-center">
          <h2 className="text-xl font-bold text-stone-900 mb-2">{ctaTitle}</h2>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">{ctaText}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/creer" className="btn-primary">Publier une annonce</Link>
            <Link to="/" className="btn-secondary">Voir les annonces</Link>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8">
        <FooterLinks />
      </div>
    </div>
  );
}
