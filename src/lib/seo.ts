// SEO, Metadata and Structured Data Manager for Abed Furniture & Interior

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: Record<string, any>[];
}

export const SITE_BASE_URL = 'https://abedfurniture.com';
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&h=630&q=80';

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': `${SITE_BASE_URL}/#organization`,
  name: 'আবেদ ফার্ণিচার ও ইন্টেরিয়র',
  alternateName: 'Abed Furniture & Interior',
  url: `${SITE_BASE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_BASE_URL}/logo.png`,
    caption: 'Abed Furniture & Interior Logo'
  },
  image: DEFAULT_OG_IMAGE,
  description: 'প্রিমিয়াম মেহগনি ও সেগুন কাঠের ফার্ণিচার এবং আধুনিক হোম ও অফিস ইন্টেরিয়র ডিজাইন সার্ভিস। গেন্ডারিয়া, ঢাকা।',
  telephone: '+8801816234157',
  email: 'litona644@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া',
    addressLocality: 'ঢাকা',
    addressRegion: 'ঢাকা বিভাগ',
    postalCode: '1204',
    addressCountry: 'BD'
  },
  founder: {
    '@type': 'Person',
    name: 'Liton Ali',
    alternateName: 'লিটন আলী',
    jobTitle: 'Chief Design Consultant & Woodcraft Lead',
    description: 'Master wood craftsman with 15+ years experience, including 8 years with Arab Tech in Dubai, UAE.'
  }
};

export const LOCAL_BUSINESS_SCHEMA = {
  '@type': ['FurnitureStore', 'HomeAndConstructionBusiness', 'LocalBusiness'],
  '@id': `${SITE_BASE_URL}/#business`,
  parentOrganization: { '@id': `${SITE_BASE_URL}/#organization` },
  name: 'আবেদ ফার্ণিচার ও ইন্টেরিয়র',
  alternateName: 'Abed Furniture & Interior',
  url: `${SITE_BASE_URL}/`,
  logo: `${SITE_BASE_URL}/logo.png`,
  image: DEFAULT_OG_IMAGE,
  telephone: '+8801816234157',
  priceRange: '৳৳',
  currenciesAccepted: 'BDT',
  paymentAccepted: 'Cash, Bank Transfer, bKash, Nagad',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '22:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '14:30',
      closes: '22:00'
    }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া',
    addressLocality: 'ঢাকা',
    addressRegion: 'ঢাকা বিভাগ',
    postalCode: '1204',
    addressCountry: 'BD'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.7088,
    longitude: 90.4285
  }
};

export const SEO_PAGES: Record<string, PageSeoConfig> = {
  home: {
    title: 'আবেদ ফার্ণিচার ও ইন্টেরিয়র | Abed Furniture & Interior Design Dhaka',
    description: 'প্রিমিয়াম মেহগনি ও সেগুন কাঠের ফার্ণিচার এবং আধুনিক হোম ইন্টেরিয়র ডিজাইন সার্ভিস। গেন্ডারিয়া, ঢাকা। ১৫ বছরের বিশ্বস্ত কাঠের কারিগর লিটন আলী।',
    canonicalPath: '/',
    keywords: 'আবেদ ফার্ণিচার, আবেদ ইন্টেরিয়র, Abed Furniture, Abed Interior, Furniture Shop Dhaka, Interior Design Bangladesh, সেগুন কাঠের ফার্ণিচার, মেহগনি ফার্নিচার, Gandaria Dhaka Furniture, Modern Interior Design, Wood Craftsman Liton Ali, Luxury Furniture Dhaka',
    structuredData: [
      ORGANIZATION_SCHEMA,
      LOCAL_BUSINESS_SCHEMA,
      {
        '@type': 'WebSite',
        '@id': `${SITE_BASE_URL}/#website`,
        url: `${SITE_BASE_URL}/`,
        name: 'Abed Furniture & Interior',
        publisher: { '@id': `${SITE_BASE_URL}/#organization` }
      }
    ]
  },
  furniture: {
    title: 'সেগুন ও মেহগনি কাঠের ফার্ণিচার সংগ্রহ | Abed Furniture Collections Dhaka',
    description: 'চিটাগাং সেগুন ও যশোর মেহগনি কাঠের তৈরি রাজকীয় খাট, সোফা সেট, ডাইনিং টেবিল, আলমারি, ড্রেসিং টেবিল ও শোকেস। ১০০% সিজনড কাঠ ও লাইফটাইম ঘুণের গ্যারান্টি।',
    canonicalPath: '/furniture',
    keywords: 'সেগুন কাঠের খাট, সেগুন সোফা সেট, ডাইনিং টেবিল, কাঠের আলমারি, ড্রেসিং টেবিল, মেহগনি ফার্নিচার, Furniture Dhaka, Teak Furniture Bangladesh, Abed Furniture',
    structuredData: [
      ORGANIZATION_SCHEMA,
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_BASE_URL}/furniture#webpage`,
        url: `${SITE_BASE_URL}/furniture`,
        name: 'সেগুন ও মেহগনি কাঠের ফার্ণিচার সংগ্রহ | Abed Furniture Collections',
        description: 'খাঁটি চিটাগাং সেগুন ও মেহগনি কাঠের তৈরি টেকসই আসবাবপত্র সম্ভার।',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Furniture', item: `${SITE_BASE_URL}/furniture` }
          ]
        }
      }
    ]
  },
  'interior-design': {
    title: 'আধুনিক ও রাজকীয় হোম ইন্টেরিয়র ডিজাইন সার্ভিস ঢাকা | Abed Interior',
    description: 'ডুপ্লেক্স হোম, ড্রয়িংরুম ওয়াল প্যানেলিং, মডুলার কিচেন ক্যাবিনেট ও মাস্টার বেডরুমের লাক্সারি ইন্টেরিয়র ডিজাইন। ১৫+ বছরের অভিজ্ঞ ডিজাইনার লিটন আলীর সরাসরি পরামর্শ।',
    canonicalPath: '/interior-design',
    keywords: 'ইন্টেরিয়র ডিজাইন সার্ভিস ঢাকা, Interior Design Dhaka, Modular Kitchen Cabinet Bangladesh, Home Renovation Dhaka, Duplex Interior Dhaka, False Ceiling Design, Abed Interior',
    structuredData: [
      ORGANIZATION_SCHEMA,
      {
        '@type': 'Service',
        '@id': `${SITE_BASE_URL}/interior-design#service`,
        name: 'হোম ও অফিস ইন্টেরিয়র ডিজাইন সার্ভিস',
        serviceType: 'Residential & Commercial Interior Design',
        provider: { '@id': `${SITE_BASE_URL}/#organization` },
        areaServed: {
          '@type': 'City',
          name: 'Dhaka',
          containedInPlace: { '@type': 'Country', name: 'Bangladesh' }
        },
        description: 'প্রিমিয়াম সেগুন কাঠের ওয়াল প্যানেলিং, মডুলার কিচেন ও সিলিং লাইটিং সহ সম্পূর্ণ ইন্টেরিয়র ডিজাইন সেবা।'
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/interior-design#webpage`,
        url: `${SITE_BASE_URL}/interior-design`,
        name: 'ইন্টেরিয়র ডিজাইন সার্ভিস | Abed Interior Design Dhaka',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Interior Design', item: `${SITE_BASE_URL}/interior-design` }
          ]
        }
      }
    ]
  },
  'custom-furniture': {
    title: 'কাস্টমাইজড ফার্নিচার মেকিং ও কাঠের কারুশিল্প | Custom Furniture Dhaka',
    description: 'আপনার রুমের নির্দিষ্ট মাপে ও পছন্দের সিজনড সেগুন বা মেহগনি কাঠে কাস্টমাইজড ফার্নিচার তৈরি করুন। ফ্রি মেজারমেন্ট ও থ্রিডি ড্রয়িং পরামর্শ।',
    canonicalPath: '/custom-furniture',
    keywords: 'কাস্টম ফার্নিচার ঢাকা, Custom Furniture Dhaka, Bespoke Woodwork Bangladesh, কাস্টম কাঠের খাট, মেজারমেন্ট ফার্নিচার, Made to Order Furniture, Abed Custom Furniture',
    structuredData: [
      ORGANIZATION_SCHEMA,
      {
        '@type': 'Service',
        '@id': `${SITE_BASE_URL}/custom-furniture#service`,
        name: 'কাস্টম ফার্নিচার মেকিং সার্ভিস',
        serviceType: 'Custom Woodcraft & Furniture Manufacturing',
        provider: { '@id': `${SITE_BASE_URL}/#organization` },
        description: 'গ্রাহকের পছন্দসই কাঠের রঙ, সাইজ ও ড্রয়িং অনুযায়ী হাতে খোদাই করা কাস্টম ফার্নিচার নির্মাণ।'
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/custom-furniture#webpage`,
        url: `${SITE_BASE_URL}/custom-furniture`,
        name: 'কাস্টমাইজড ফার্নিচার মেকিং | Custom Furniture Dhaka',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Custom Furniture', item: `${SITE_BASE_URL}/custom-furniture` }
          ]
        }
      }
    ]
  },
  about: {
    title: 'আমাদের পরিচিতি ও ঐতিহ্য | About Abed Furniture & Craftsman Liton Ali',
    description: '২০১০ সাল থেকে ঢাকায় খাঁটি সেগুন কাঠের নির্ভরযোগ্য প্রতিষ্ঠান আবেদ ফার্ণিচার। প্রধান ডিজাইনার ও কারুশিল্পী লিটন আলীর ১৫+ বছরের অভিজ্ঞতা (দুবাই আরব টেক ৮ বছর)।',
    canonicalPath: '/about',
    keywords: 'আবেদ ফার্ণিচার পরিচিতি, About Abed Furniture, Wood Craftsman Liton Ali, ফার্নিচার শপ গেন্ডারিয়া, কাঠের কারখানা ঢাকা, লিটন আলী কারিগর',
    structuredData: [
      ORGANIZATION_SCHEMA,
      {
        '@type': 'AboutPage',
        '@id': `${SITE_BASE_URL}/about#webpage`,
        url: `${SITE_BASE_URL}/about`,
        name: 'আমাদের পরিচিতি | About Abed Furniture & Interior',
        description: 'আবেদ ফার্ণিচার ও ইন্টেরিয়র এর ১৫ বছরের কারিগরি ঐতিহ্য ও অভিজ্ঞতা।',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_BASE_URL}/about` }
          ]
        }
      }
    ]
  },
  contact: {
    title: 'যোগাযোগ ও শোরুমের ঠিকানা | Contact Abed Furniture & Interior Dhaka',
    description: 'আবেদ ফার্ণিচার শোরুম: ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া, ঢাকা-১২০৪। সরাসরি শোরুমে আসুন অথবা কল ও হোয়াটসঅ্যাপ করুন: ০১৮১৬-২৩৪১৫৭, ০১৯৭৭-৭৫৫৩১৩।',
    canonicalPath: '/contact',
    keywords: 'আবেদ ফার্ণিচার ঠিকানা, Abed Furniture Contact, Furniture Showroom Gandaria Dhaka, ধূপখোলা মাঠ ফার্নিচার, লিটন আলী ফোন নম্বর, ফার্নিচার শপ ঢাকা যোগাযোগ',
    structuredData: [
      ORGANIZATION_SCHEMA,
      LOCAL_BUSINESS_SCHEMA,
      {
        '@type': 'ContactPage',
        '@id': `${SITE_BASE_URL}/contact#webpage`,
        url: `${SITE_BASE_URL}/contact`,
        name: 'যোগাযোগ ও শোরুম ঠিকানা | Contact Abed Furniture & Interior',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${SITE_BASE_URL}/contact` }
          ]
        }
      }
    ]
  },
  'handover-projects': {
    title: 'হস্তান্তরিত প্রজেক্ট অ্যালবাম | Handover Projects Gallery - Abed Furniture',
    description: 'আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম সেগুন কাঠের আসবাব ও আধুনিক হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।',
    canonicalPath: '/handover-projects',
    keywords: 'হ্যান্ডওভার প্রজেক্ট, Completed Projects Abed Furniture, Delivered Furniture Dhaka, বাস্তব ফার্নিচার ছবি, ইন্টেরিয়র প্রজেক্ট ভিডিও',
    structuredData: [
      ORGANIZATION_SCHEMA,
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_BASE_URL}/handover-projects#webpage`,
        url: `${SITE_BASE_URL}/handover-projects`,
        name: 'হস্তান্তরিত প্রজেক্ট গ্যালারি | Handover Projects Gallery',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Handover Projects', item: `${SITE_BASE_URL}/handover-projects` }
          ]
        }
      }
    ]
  }
};

/**
 * Dynamically updates document title, meta description, canonical URL,
 * OpenGraph, Twitter cards, and Schema.org JSON-LD structured data.
 */
export function applyPageSeo(routeKey: string): void {
  if (typeof document === 'undefined') return;

  const config = SEO_PAGES[routeKey] || SEO_PAGES.home;

  // 1. Update Title
  document.title = config.title;

  // Helper to set or create meta tags
  const setMeta = (nameAttr: 'name' | 'property', attrValue: string, contentValue: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', contentValue);
  };

  // 2. Primary Meta Tags
  setMeta('name', 'description', config.description);
  if (config.keywords) {
    setMeta('name', 'keywords', config.keywords);
  }
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // 3. Canonical URL
  const canonicalUrl = `${SITE_BASE_URL}${config.canonicalPath}`;
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Tags
  setMeta('property', 'og:type', config.ogType || 'website');
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:title', config.title);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:image', config.ogImage || DEFAULT_OG_IMAGE);

  // 5. Twitter Card Tags
  setMeta('name', 'twitter:title', config.title);
  setMeta('name', 'twitter:description', config.description);
  setMeta('name', 'twitter:image', config.ogImage || DEFAULT_OG_IMAGE);

  // 6. Schema.org JSON-LD Structured Data
  const SCRIPT_ID = 'route-structured-data-jsonld';
  let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = SCRIPT_ID;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const structuredGraph = config.structuredData || [ORGANIZATION_SCHEMA, LOCAL_BUSINESS_SCHEMA];
  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': structuredGraph
  }, null, 2);
}
