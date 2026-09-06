export type StayType = 'Camping' | 'Glamping Tent' | 'Cottage' | 'AC Cottage' | 'Villa / Suite' | 'Room' | 'Homestay' | 'Treehouse' | 'Dormitory';

export type ThemePreset = 'luxury' | 'nature' | 'minimal' | 'adventure' | 'custom';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  path: string;
  enabled: boolean;
  order: number;
  openInNewTab?: boolean;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  isPublished: boolean;
}

export interface WhyChooseUsStoryHighlight {
  id?: string;
  icon: string;
  title: string;
}

export interface WhyChooseUsConfig {
  enabled?: boolean;
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  closingStatement: string;
  image: string;
  highlights: WhyChooseUsStoryHighlight[];
  trustTitle: string;
  trustDescription: string;
  googleReviewCount?: string;
  googleMapsUrl?: string;
  ctaHeading: string;
  ctaSubtitle: string;
  ctaExploreText: string;
  ctaWhatsappText: string;
}

export type PricingType = 'Included' | 'Paid' | 'Price on Request';
export type PriceUnit =
  | 'Per Person'
  | 'Per Night'
  | 'Per Stay'
  | 'Per Hour'
  | 'Per Session'
  | 'Per Plate'
  | 'Per Group'
  | 'Per Vehicle'
  | 'Per Ride'
  | 'Per Set'
  | 'Custom';

export interface ServiceSectionSettings {
  id?: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  description: string;
  sectionImage?: string;
  ctaText?: string;
  ctaLink?: string;
  enabled?: boolean;
  gridLayout?: '2-cols' | '3-cols' | '4-cols' | 'auto';
  maxVisible?: number; // 0 for all
  backgroundStyle?: 'default' | 'card' | 'dark' | 'transparent';
  updatedAt?: string;
}

export interface SiteSettings {
  businessName: string;
  businessType: string; // e.g. "Glamping & Camping", "Mountain Resort", "Lakeview Villa", "Beach Hotel"
  brandLogo?: string;
  tagline: string;
  shortDescription?: string;
  aboutDescription?: string;
  phone: string;
  whatsappNumber: string; // formatted e.g. "918793020527"
  whatsappDisplayPhone: string; // formatted e.g. "+91 8793020527"
  email: string;
  locationAddress: string;
  locationCoords: {
    lat: number;
    lng: number;
  };
  googleMapsEmbedUrl: string;
  checkInDefault: string;
  checkOutDefault: string;
  businessHours?: string;
  announcementText?: string;

  // Hero Section Config
  heroHeading: string;
  heroSubheading: string;
  heroImages: string[];
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;

  // Why Choose Us / Brand Story
  whyChooseUs?: WhyChooseUsConfig;

  // Services & Facilities Section Settings
  serviceSectionSettings?: ServiceSectionSettings;

  // Homepage Settings
  featuredAccommodationEnabled?: boolean;
  featuredAccommodationTitle?: string;
  featuredAccommodationSubtitle?: string;
  featuredAccommodationDescription?: string;
  featuredAccommodationCTA?: string;
  featuredAccommodationCTALink?: string;
  featuredAccommodationBgStyle?: 'default' | 'card' | 'dark' | 'transparent';
  featuredAccommodationMaxCards?: number;

  popularPackagesEnabled?: boolean;
  popularPackagesTitle?: string;
  popularPackagesSubtitle?: string;
  popularPackagesDescription?: string;
  popularPackagesCTA?: string;
  popularPackagesCTALink?: string;
  popularPackagesMaxCards?: number;

  // Theme & Branding Customization
  themePreset: ThemePreset;
  themeColors: ThemeColors;
  themeBorderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  themeButtonStyle: 'solid' | 'gradient' | 'outline' | 'pill';
  themeFontFamily: 'sans' | 'serif' | 'mono';

  // Social Links
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    googleBusiness?: string;
  };

  // Dynamic Builders
  homepageSections: HomepageSectionConfig[];
  navigationMenu: NavigationMenuItem[];

  // SEO & Schema
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  // Payments Architecture
  enableOnlinePayment?: boolean;
  razorpayKeyId?: string;
  currency?: string;
  gallery?: GalleryItem[];
}

export interface Stay {
  id: string;
  name: string;
  slug: string;
  type: StayType;
  tagline: string;
  description: string;
  location: string;
  capacity: {
    minGuests: number;
    maxGuests: number;
    idealFor: string; // e.g. "Couples & Small Families"
  };
  price: {
    amount: number | null; // null if Price on Request
    originalAmount?: number;
    currency: string;
    period: string; // e.g., "per person / night" or "per cottage / night"
    isPriceOnRequest: boolean;
  };
  rating?: number;
  reviewsCount?: number;
  mainImage: string;
  galleryImages: string[];
  amenities: string[]; // List of amenity names or IDs
  whatsIncluded: string[];
  houseRules: string[];
  cancellationPolicy?: string | string[];
  checkInTime: string;
  checkOutTime: string;
  isFeatured?: boolean;
  isLakeView?: boolean;
  isPrivate?: boolean;
  isCoupleFriendly?: boolean;
  isFamilyFriendly?: boolean;
  displayOrder?: number;
  featuredImage?: string;
  status?: 'Active' | 'Inactive';
  mealIncluded?: string;
  facilities?: string[];
  includedServices?: string[];
  ctaText?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  fullDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageInclusion {
  title: string;
  description: string;
  icon?: string;
}

export interface StayPackage {
  id: string;
  name: string;
  slug: string;
  category: 'Couple Getaway' | 'Family Weekend' | 'Friends Getaway' | 'Camping Experience' | 'Luxury Stay' | 'Adventure Package';
  coverImage: string;
  galleryImages: string[];
  shortDescription: string;
  fullDescription: string;
  duration: string; // e.g., "2 Days / 1 Night"
  price: {
    amount: number | null;
    currency: string;
    unit: string; // e.g., "per couple" or "per group"
    isPriceOnRequest: boolean;
  };
  inclusions: PackageInclusion[];
  mealsIncluded: string[]; // e.g. ["Welcome Drink", "Evening Snacks & Tea", "Unlimited BBQ", "Buffet Dinner", "Breakfast"]
  activities: string[];
  itinerary: {
    time: string;
    title: string;
    description: string;
  }[];
  thingsToCarry: string[];
  importantInfo: string[];
  cancellationPolicy: string | string[];
  isPopular?: boolean;
  status?: 'Active' | 'Inactive';
  displayOrder?: number;
  exclusions?: string[];
  isFeatured?: boolean;
  mainImage?: string;
  accommodationType?: string;
  facilities?: string[];
  mealInformation?: string;
  ctaText?: string;
  ctaLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  duration?: string;
  highlights: string[];
  timing?: string;
  isCurrentlyOffered: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  pricingType: PricingType;
  price?: number | null;
  priceUnit?: string;
  shortDescription: string;
  fullDescription?: string;
  mainImage: string;
  galleryImages?: string[];
  icon?: string;
  featured?: boolean;
  status: 'Active' | 'Inactive';
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'Stays' | 'Lake' | 'Camping' | 'Food' | 'Bonfire' | 'Activities' | 'Guests' | 'Sunset' | 'Events' | 'All';
  isVisible?: boolean;
  sourceType?: 'manual' | 'accommodation' | 'package' | 'service' | 'homepage' | 'blog';
  sourceId?: string;
  displayOrder?: number;
  altText?: string;
  caption?: string;
}

export interface FAQItem {
  id: string;
  category: 'Booking' | 'Stay' | 'Camping' | 'Location' | 'Policies' | 'Food & Activities';
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location?: string;
  rating: number;
  review: string;
  date?: string;
  stayName?: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  contentImages?: string[];
  author: string;
  publishedDate: string;
  readingTime?: string;
  readTime?: string;
  status: 'Published' | 'Draft';
  featured?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  stayTypeOrName: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
  sourcePage?: string;
}

export type BookingEnquiry = Enquiry;


export interface SearchFilters {
  stayType?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  lakeViewOnly?: boolean;
  privateOnly?: boolean;
  familyFriendlyOnly?: boolean;
  coupleFriendlyOnly?: boolean;
  selectedAmenities?: string[];
  searchQuery?: string;
  sortBy?: 'recommended' | 'price_low' | 'price_high' | 'popular';
}
