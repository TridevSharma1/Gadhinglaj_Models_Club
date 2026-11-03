const hero1 = "/assets/hero1.jpg";
const hero2 = "/assets/hero2.jpg";
const hero3 = "/assets/hero3.jpg";
const aboutImg = "/assets/about.jpg";
const offerImg = "/assets/offer.jpg";
const cat1 = "/assets/cat1.jpg";
const cat2 = "/assets/cat2.jpg";
const cat3 = "/assets/cat3.jpg";
const cat4 = "/assets/cat4.jpg";
const cat5 = "/assets/cat5.jpg";
const cat6 = "/assets/cat6.jpg";
const cat7 = "/assets/cat7.jpg";
const cat8 = "/assets/cat8.jpg";
const p1 = "/assets/p1.jpg";
const p2 = "/assets/p2.jpg";
const p3 = "/assets/p3.jpg";
const p4 = "/assets/p4.jpg";
const p5 = "/assets/p5.jpg";
const p6 = "/assets/p6.jpg";
const p7 = "/assets/p7.jpg";
const p8 = "/assets/p8.jpg";
const p9 = "/assets/p9.jpg";
const p10 = "/assets/p10.jpg";
const p11 = "/assets/p11.jpg";
const p12 = "/assets/p12.jpg";
const p13 = "/assets/p13.jpg";
const p14 = "/assets/p14.jpg";
const p15 = "/assets/p15.jpg";
const p16 = "/assets/p16.jpg";
const p17 = "/assets/p17.jpg";
const p18 = "/assets/p18.jpg";
const p19 = "/assets/p19.jpg";
const p20 = "/assets/p20.jpg";
const p21 = "/assets/p21.jpg";
const p22 = "/assets/p22.jpg";
const p23 = "/assets/p23.jpg";
const p24 = "/assets/p24.jpg";

export { aboutImg, offerImg };

export type ProductType = "readymade" | "rental";

export type ProductSizeStock = {
  size: string;
  stock: number;
};

export type ProductColorVariant = {
  id: string;
  name: string;
  stock: number;
  image?: string;
  images?: string[];
  hasSizes?: boolean;
  sizes?: string[];
  sizeStocks?: ProductSizeStock[];
};

export type Product = {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  type: ProductType;
  price: number;
  mrp: number;
  rentalPrice: number;
  deposit: number;
  rentalDuration: string;
  rating: number;
  reviews: number;
  sizes: string[];
  color: string;
  fabric: string;
  sareeLength?: string;
  offerText?: string;
  tags?: string[];
  occasion: string;
  stock: number;
  featured: boolean;
  newArrival: boolean;
  isPremium?: boolean;
  isTrending?: boolean;
  isLiveSpecial?: boolean;
  isLimitedOffer?: boolean;
  prebookingEnabled?: boolean;
  colors?: ProductColorVariant[];
  active: boolean;
  available: boolean;
  image: string;
  images?: string[];
  description: string;
};

const mk = (
  id: number,
  name: string,
  category: string,
  type: ProductType,
  price: number,
  mrp: number,
  rentalPrice: number,
  image: string,
  color: string,
  fabric: string,
  occasion: string,
  rating: number,
  sizes: string[],
  flags: { featured?: boolean; newArrival?: boolean } = {},
): Product => ({
  id,
  name,
  category,
  type,
  price,
  mrp,
  rentalPrice,
  deposit: Math.round(rentalPrice * 2),
  rentalDuration: "3 days (extendable)",
  rating,
  reviews: 12 + ((id * 7) % 96),
  sizes,
  color,
  fabric,
  occasion,
  stock: type === "rental" ? 2 + (id % 4) : 6 + (id % 12),
  featured: flags.featured ?? false,
  newArrival: flags.newArrival ?? false,
  active: true,
  available: true,
  image,
  description: `${name} — a thoughtfully curated piece from the Gadhinglaj Models Club atelier. Crafted in ${fabric.toLowerCase()} with a flattering silhouette, styled for ${occasion.toLowerCase()}.`,
});

const S = ["XS", "S", "M", "L", "XL"];

export const products: Product[] = [];

export type Category = {
  id: number;
  name: string;
  slug?: string;
  image: string;
  blurb: string;
  description?: string;
  active: boolean;
};

export const categories: Category[] = [];

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  active: boolean;
};

export type PageHeader = {
  id?: number;
  pageKey: string;
  pageName: string;
  route: string;
  imageUrl: string;
  subtitle?: string;
  active: boolean;
};

export const defaultPageHeaders: PageHeader[] = [
  { pageKey: "shop", pageName: "Shop All Outfits", route: "/shop", imageUrl: "/assets/hero1.jpg", active: true },
  { pageKey: "rental", pageName: "Dress Rental Studio", route: "/rental", imageUrl: "/assets/hero3.jpg", active: true },
  { pageKey: "readymade", pageName: "Ready-Made Collection", route: "/readymade", imageUrl: "/assets/hero2.jpg", active: true },
  { pageKey: "categories", pageName: "Curated Categories", route: "/categories", imageUrl: "/assets/cat1.jpg", active: true },
  { pageKey: "rental-booking", pageName: "Custom Rental Reservation", route: "/rental-booking", imageUrl: "/assets/cat2.jpg", active: true },
  { pageKey: "offers", pageName: "Vouchers & Offers", route: "/offers", imageUrl: "/assets/offer.jpg", active: true },
  { pageKey: "about", pageName: "Our Atelier Story", route: "/about", imageUrl: "/assets/about.jpg", active: true },
  { pageKey: "contact", pageName: "Contact & Studio", route: "/contact", imageUrl: "/assets/cat3.jpg", active: true },
  { pageKey: "reviews", pageName: "Customer Testimonials", route: "/reviews", imageUrl: "/assets/cat4.jpg", active: true },
  { pageKey: "faq", pageName: "Frequently Asked Questions", route: "/faq", imageUrl: "/assets/cat5.jpg", active: true },
  { pageKey: "terms", pageName: "Terms & Rental Policies", route: "/terms", imageUrl: "/assets/cat6.jpg", active: true },
  { pageKey: "privacy", pageName: "Privacy Policy", route: "/privacy", imageUrl: "/assets/cat7.jpg", active: true },
  { pageKey: "cart", pageName: "Shopping Bag", route: "/cart", imageUrl: "/assets/p1.jpg", active: true },
  { pageKey: "wishlist", pageName: "Wishlist Wardrobe", route: "/wishlist", imageUrl: "/assets/p2.jpg", active: true },
  { pageKey: "account", pageName: "Patron Account", route: "/account", imageUrl: "/assets/p3.jpg", active: true },
  { pageKey: "checkout", pageName: "Checkout Desk", route: "/checkout", imageUrl: "/assets/p4.jpg", active: true },
  { pageKey: "default", pageName: "Global Default Banner", route: "/*", imageUrl: "/assets/hero1.jpg", active: true },
];

export const banners: Banner[] = [
  { id: 1, title: "Wear the Moment. Own the Look.", subtitle: "Premium designer outfits for your most memorable occasions.", cta: "Explore Collection", link: "/shop", image: hero1, active: true },
  { id: 2, title: "Luxury Looks, Made to Impress", subtitle: "Discover premium ethnic wear and designer fashion.", cta: "Shop Now", link: "/readymade", image: hero2, active: true },
  { id: 3, title: "Your Perfect Photoshoot Look Awaits", subtitle: "Premium rental outfits for pre-wedding, post-wedding and maternity photography.", cta: "Explore Rentals", link: "/rental", image: hero3, active: true },
];

export type Review = {
  id: number | string;
  productId?: number;
  productName?: string;
  productImage?: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
};

export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    productName: "Royal Crimson Zardosi Bridal Lehenga",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623363/gmc_products/p1_wh2unl.jpg",
    name: "Sneha Patil",
    initials: "SP",
    rating: 5,
    text: "Beautiful collection and amazing quality. The bridal lehenga looked stunning during our wedding ceremony and received countless compliments!",
    date: "2026-01-12",
    approved: true,
  },
  {
    id: 2,
    productId: 2,
    productName: "Emerald Empress Shimmer Ballgown",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623368/gmc_products/p2_qe1bqc.jpg",
    name: "Aishwarya Kulkarni",
    initials: "AK",
    rating: 5,
    text: "Rented this emerald shimmer gown for my engagement. Perfect fit, luxurious fabric, and Priyanka ma'am styled me personally at the studio.",
    date: "2026-02-03",
    approved: true,
  },
  {
    id: 3,
    productId: 5,
    productName: "Traditional Golden Yeola Paithani Saree",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623401/gmc_products/p5_wi66lq.jpg",
    name: "Rutuja Shinde",
    initials: "RS",
    rating: 5,
    text: "Authentic weave, rich pallu zari, and heavenly drape. The Yeola Paithani made the family festive ceremony truly unforgettable.",
    date: "2026-02-21",
    approved: true,
  },
  {
    id: 4,
    productId: 4,
    productName: "Pastel Rose Blossom Maternity Trail Gown",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623381/gmc_products/p4_eycaoh.jpg",
    name: "Manasi Jadhav",
    initials: "MJ",
    rating: 5,
    text: "The maternity trail gown made my outdoor sunrise shoot feel like a fairy tale. Extremely comfortable, breathable, and flowed effortlessly in the breeze.",
    date: "2026-03-08",
    approved: true,
  },
  {
    id: 5,
    productId: 6,
    productName: "Mirror-Work Lavender Georgette Crop Top & Skirt",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623404/gmc_products/p6_jvnlhx.jpg",
    name: "Pooja Kamble",
    initials: "PK",
    rating: 5,
    text: "Best boutique collection in Gadhinglaj! The mirror-work sparkle and lavender flair stood out beautifully for our sangeet night.",
    date: "2026-03-19",
    approved: true,
  },
  {
    id: 6,
    productId: 3,
    productName: "Sunset Scarlet 10-Meter Flying Trail Gown",
    productImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1793623373/gmc_products/p3_xiuv4z.jpg",
    name: "Shruti Deshpande",
    initials: "SD",
    rating: 5,
    text: "Smooth rental booking process and the 10-meter scarlet trail was professionally steamed and ready on arrival. The photos turned out breathtaking!",
    date: "2026-04-02",
    approved: false,
  },
];

export type Offer = {
  id: number;
  title: string;
  discount: string;
  description: string;
  start: string;
  end: string;
  active: boolean;
};

export const offers: Offer[] = [
  { id: 1, title: "Designer Gown Festival", discount: "30% OFF", description: "Flat 30% off on selected designer gowns from the new season edit.", start: "2026-08-01", end: "2026-09-15", active: true },
  { id: 2, title: "Rental Duo Package", discount: "₹2,000 OFF", description: "Book any two rental outfits for a pre-wedding shoot and save instantly.", start: "2026-08-10", end: "2026-10-01", active: true },
  { id: 3, title: "Maternity Glow Offer", discount: "20% OFF", description: "20% off on the entire maternity photoshoot collection.", start: "2026-08-01", end: "2026-12-31", active: true },
  { id: 4, title: "Ethnic Week Special", discount: "15% OFF", description: "15% off on ethnic wear and traditional drapes.", start: "2026-07-01", end: "2026-07-31", active: false },
];

export type Order = {
  id: string;
  userId?: string;
  customer: string;
  phone: string;
  email?: string;
  date: string;
  items: {
    productId?: number;
    name: string;
    qty: number;
    size: string;
    color?: string;
    price: number;
    image?: string;
  }[];
  amount: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  tax?: number;
  payment: string;
  paymentStatus?: "Pending" | "Paid" | "Failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  status: string;
  notes?: string;
};

export const orderStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export const seedOrders: Order[] = [];

export type Booking = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  outfit: string;
  size: string;
  color?: string;
  start: string;
  end: string;
  occasion: string;
  notes: string;
  rental: number;
  deposit: number;
  status: string;
  isCustomDesign?: boolean;
  bust?: string;
  waist?: string;
  height?: string;
  createdAt?: string;
};

export const bookingStatuses = ["Pending", "Confirmed", "Ready", "Rented", "Returned", "Cancelled"];

export const seedBookings: Booking[] = [];

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders: number;
  bookings: number;
  spent: number;
  status: string;
};

export const customers: Customer[] = [];

export const siteContent = {
  businessName: "Gadhinglaj Models Club",
  owner: "Priyanka Desai (Gilbile)",
  phone: "+91 96996 20950",
  email: "support.gadhinglajmodelsclub@gmail.com",
  address: "Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502",
  tagline: "Premium ready-made apparel and high-end designer dress rental in Gadhinglaj.",
  aboutText:
    "Gadhinglaj Models Club is a women-owned premium boutique offering designer outfits, heavy ethnic gowns, trendy crop tops and a curated rental wardrobe. Managed personally by Priyanka Desai (Gilbile), every visit is a styling session — from choosing fabrics that flatter you to fitting an outfit that photographs beautifully.",
  footerText:
    "A premium fashion boutique and designer dress rental studio in Gadhinglaj, Maharashtra — styling weddings, celebrations and photoshoots since day one.",
  // Top Header Ad & Announcement Ribbon
  topAdEnabled: true,
  topAdPrefix: "Gadhinglaj Models Club",
  topAdText: "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai",
  topAdLink: "/rental",
  topAdFeature: "Complimentary Fitting",
  topAdShowFeature: true,
  topAdPhone: "+91 96996 20950",
  topAdShowPhone: true,
  topAdBtnText: "Stylist Concierge",
  topAdWhatsAppMessage:
    "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club.",
  topAdTheme: "burgundy", // burgundy, noir, gold, emerald, ruby
};

export const settings = {
  businessName: "Gadhinglaj Models Club",
  phone: "+91 96996 20950",
  email: "support.gadhinglajmodelsclub@gmail.com",
  address: "Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502",
  currency: "INR",
  tax: 5,
  delivery: 99,
  depositMultiplier: 2,
};

export const whyChooseUs = [
  { title: "Premium Quality", text: "Carefully selected premium fabrics and designer outfits." },
  { title: "Curated Collection", text: "Unique styles for weddings, parties and photoshoots." },
  { title: "Premium Rental", text: "Designer outfits available for special occasions." },
  { title: "Customer First", text: "Personalized assistance for every customer." },
  { title: "Trusted Experience", text: "A premium 5-star rated customer experience." },
];

export const photoshootTypes = [
  { name: "Pre-Wedding", image: p15 },
  { name: "Post-Wedding", image: p23 },
  { name: "Maternity", image: p21 },
  { name: "Engagement", image: p18 },
  { name: "Fashion Photography", image: p22 },
];

export const adminCredentials = {
  email: "admin@gadhinglajmodelsclub.com",
  password: "admin123",
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;


export type SubCategory = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  slug?: string;
  image?: string;
  description?: string;
  sizeTemplate?: string;
  active: boolean;
};

export const seedSubCategories: SubCategory[] = [];

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
  date: string;
  status: "New" | "Contacted" | "Resolved";
  notes?: string;
  source?: string;
};

export const seedInquiries: Inquiry[] = [
  {
    id: "INQ-301",
    name: "Meera Patil",
    phone: "+91 98224 55667",
    email: "meera.patil@example.com",
    subject: "Pre-Wedding Shoot Gown Rental",
    message: "Hello Priyanka ji, looking for a trail gown for our pre-wedding shoot in Mahabaleshwar next month. Can we visit this Saturday for trial fitting?",
    date: "2026-08-28",
    status: "New",
  },
  {
    id: "INQ-302",
    name: "Aarti Deshmukh",
    phone: "+91 97650 12345",
    email: "aarti.d@example.com",
    subject: "Bridal Lehenga Custom Alteration",
    message: "Interested in the Regal Red Bridal Lehenga for my wedding reception on Nov 15th. Do you offer custom blouse tailoring?",
    date: "2026-08-26",
    status: "Contacted",
  },
  {
    id: "INQ-303",
    name: "Kavita Jadhav",
    phone: "+91 94220 98765",
    email: "kavita.j@example.com",
    subject: "Maternity Photoshoot Gown",
    message: "Wanted to know rental rates and availability for the Blush Tulle Maternity Gown for a baby shower shoot in Kolhapur.",
    date: "2026-08-24",
    status: "Resolved",
  },
];
