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

export type Product = {
  id: number;
  name: string;
  category: string;
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
  occasion: string;
  stock: number;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  available: boolean;
  image: string;
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

export const products: Product[] = [
  mk(1, "Royal Burgundy Velvet Gown", "Designer Gowns", "readymade", 6499, 8999, 1899, p1, "Burgundy", "Premium Velvet", "Receptions & Galas", 4.8, S, { featured: true, newArrival: true }),
  mk(2, "Ivory Pearl Anarkali Suit", "Ethnic Wear", "readymade", 4299, 5599, 1299, p2, "Ivory", "Georgette", "Festive Evenings", 4.7, S, { featured: true }),
  mk(3, "Rose Gold Sequin Crop Top Set", "Crop Tops", "readymade", 2699, 3499, 899, p3, "Rose Gold", "Sequin Knit", "Parties", 4.6, ["XS", "S", "M", "L"], { featured: true, newArrival: true }),
  mk(4, "Emerald Silk Party Dress", "Party Wear", "readymade", 3899, 4999, 1099, p4, "Emerald", "Mulberry Silk", "Cocktail Parties", 4.5, S),
  mk(5, "Blush Chikankari Kurta Set", "Ethnic Wear", "readymade", 3299, 4199, 999, p5, "Blush", "Cotton Chikankari", "Day Functions", 4.7, S, { featured: true }),
  mk(6, "Midnight Blue Evening Gown", "Designer Gowns", "readymade", 7299, 9499, 2099, p6, "Midnight Blue", "Sequin Net", "Evening Soirees", 4.9, S, { featured: true }),
  mk(7, "Peach Organza Lehenga", "Wedding Collection", "readymade", 9899, 12999, 2799, p7, "Peach", "Organza & Zari", "Weddings", 4.8, S, { newArrival: true }),
  mk(8, "Champagne Ruffle Co-ord Set", "Crop Tops", "readymade", 2999, 3799, 949, p8, "Champagne", "Crepe", "Brunches & Parties", 4.4, ["S", "M", "L", "XL"]),
  mk(9, "Maroon Velvet Indo-Western", "Party Wear", "readymade", 5499, 6999, 1599, p9, "Maroon", "Velvet Blend", "Sangeet & Parties", 4.6, S, { featured: true }),
  mk(10, "Sage Draped Saree Gown", "Designer Gowns", "readymade", 4799, 6299, 1399, p10, "Sage Green", "Satin Georgette", "Receptions", 4.5, S, { newArrival: true }),
  mk(11, "Coral Floral Maternity Dress", "Maternity Collection", "readymade", 2499, 3299, 799, p11, "Coral", "Soft Chiffon", "Baby Showers", 4.7, ["S", "M", "L", "XL", "XXL"]),
  mk(12, "Pastel Lilac Cocktail Dress", "Party Wear", "readymade", 3199, 4099, 999, p12, "Lilac", "Lace & Crepe", "Cocktail Evenings", 4.4, ["XS", "S", "M", "L"], { featured: true }),
  mk(13, "Regal Red Bridal Lehenga", "Wedding Collection", "rental", 42999, 52999, 5999, p13, "Red", "Raw Silk & Zardosi", "Bridal Ceremonies", 4.9, S, { featured: true }),
  mk(14, "Golden Empress Trail Gown", "Photoshoot Collection", "rental", 18999, 23999, 3499, p14, "Gold", "Metallic Lame", "Pre-Wedding Shoots", 4.8, S, { featured: true, newArrival: true }),
  mk(15, "White Feather Pre-Wedding Gown", "Photoshoot Collection", "rental", 16999, 21999, 2999, p15, "White", "Crepe & Feather", "Pre-Wedding Shoots", 4.9, S, { featured: true }),
  mk(16, "Wine Velvet Maternity Trail Gown", "Maternity Collection", "rental", 14999, 18999, 2599, p16, "Wine", "Stretch Velvet", "Maternity Shoots", 4.8, ["S", "M", "L", "XL", "XXL"], { featured: true }),
  mk(17, "Turquoise Mermaid Gown", "Designer Gowns", "rental", 15999, 19999, 2699, p17, "Turquoise", "Satin & Crystal", "Receptions", 4.6, S),
  mk(18, "Ivory Cape Engagement Gown", "Wedding Collection", "rental", 19999, 24999, 3299, p18, "Ivory", "Structured Crepe", "Engagements", 4.8, S, { newArrival: true }),
  mk(19, "Black Sequin Red Carpet Gown", "Party Wear", "rental", 17999, 21999, 2899, p19, "Black & Red", "Sequin Mesh", "Gala Nights", 4.7, S),
  mk(20, "Peacock Kanjivaram Drape", "Ethnic Wear", "rental", 21999, 26999, 3199, p20, "Peacock Blue", "Kanjivaram Silk", "Traditional Ceremonies", 4.9, ["Free Size"]),
  mk(21, "Blush Tulle Maternity Gown", "Maternity Collection", "rental", 12999, 15999, 2399, p21, "Blush", "Layered Tulle", "Maternity Shoots", 4.7, ["S", "M", "L", "XL", "XXL"], { newArrival: true }),
  mk(22, "Copper Metallic Fusion Gown", "Photoshoot Collection", "rental", 15499, 18999, 2699, p22, "Copper", "Metallic Satin", "Fashion Photography", 4.5, S),
  mk(23, "Royal Blue Ruffle Ball Gown", "Designer Gowns", "rental", 23999, 28999, 3899, p23, "Royal Blue", "Tulle", "Post-Wedding Celebrations", 4.9, S, { featured: true }),
  mk(24, "Antique Gold Nauvari Ensemble", "Ethnic Wear", "rental", 13999, 16999, 2299, p24, "Antique Gold", "Paithani Silk", "Traditional Shoots", 4.8, ["Free Size"]),
];

export type Category = {
  id: number;
  name: string;
  image: string;
  blurb: string;
  active: boolean;
};

export const categories: Category[] = [
  { id: 1, name: "Designer Gowns", image: cat1, blurb: "Sculpted silhouettes for grand evenings", active: true },
  { id: 2, name: "Ethnic Wear", image: cat2, blurb: "Handpicked weaves and embroidery", active: true },
  { id: 3, name: "Crop Tops", image: cat3, blurb: "Young, trendy and effortlessly chic", active: true },
  { id: 4, name: "Party Wear", image: cat4, blurb: "Statement pieces for every celebration", active: true },
  { id: 5, name: "Wedding Collection", image: cat5, blurb: "Bridal grandeur, made personal", active: true },
  { id: 6, name: "Photoshoot Collection", image: cat6, blurb: "Camera-ready drama and trails", active: true },
  { id: 7, name: "Maternity Collection", image: cat7, blurb: "Graceful comfort for the glow", active: true },
  { id: 8, name: "Rental Collection", image: cat8, blurb: "Luxury looks without the price tag", active: true },
];

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  active: boolean;
};

export const banners: Banner[] = [
  { id: 1, title: "Wear the Moment. Own the Look.", subtitle: "Premium designer outfits for your most memorable occasions.", cta: "Explore Collection", link: "/shop", image: hero1, active: true },
  { id: 2, title: "Luxury Looks, Made to Impress", subtitle: "Discover premium ethnic wear and designer fashion.", cta: "Shop Now", link: "/readymade", image: hero2, active: true },
  { id: 3, title: "Your Perfect Photoshoot Look Awaits", subtitle: "Premium rental outfits for pre-wedding, post-wedding and maternity photography.", cta: "Explore Rentals", link: "/rental", image: hero3, active: true },
];

export type Review = {
  id: number;
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
};

export const reviews: Review[] = [
  { id: 1, name: "Sneha Patil", initials: "SP", rating: 5, text: "Beautiful collection and amazing quality. The gown looked stunning during our photoshoot.", date: "2026-01-12", approved: true },
  { id: 2, name: "Aishwarya Kulkarni", initials: "AK", rating: 5, text: "Rented a bridal lehenga for my engagement. Perfect fit and Priyanka ma'am styled me personally.", date: "2026-02-03", approved: true },
  { id: 3, name: "Rutuja Shinde", initials: "RS", rating: 4, text: "Lovely ethnic wear at fair prices. The chikankari set is now my favourite outfit.", date: "2026-02-21", approved: true },
  { id: 4, name: "Manasi Jadhav", initials: "MJ", rating: 5, text: "The maternity trail gown made my shoot magical. Very comfortable fabric.", date: "2026-03-08", approved: true },
  { id: 5, name: "Pooja Kamble", initials: "PK", rating: 5, text: "Best boutique in Gadhinglaj. Great collection of crop tops and party dresses.", date: "2026-03-19", approved: true },
  { id: 6, name: "Shruti Deshpande", initials: "SD", rating: 4, text: "Smooth rental process and the outfit was pressed and packed beautifully.", date: "2026-04-02", approved: false },
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
  customer: string;
  phone: string;
  date: string;
  items: { name: string; qty: number; size: string; price: number }[];
  amount: number;
  payment: string;
  status: string;
};

export const orderStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export const seedOrders: Order[] = [
  { id: "GMC-1041", customer: "Sneha Patil", phone: "+91 98220 11223", date: "2026-08-04", items: [{ name: "Royal Burgundy Velvet Gown", qty: 1, size: "M", price: 6499 }], amount: 6598, payment: "UPI", status: "Delivered" },
  { id: "GMC-1042", customer: "Rutuja Shinde", phone: "+91 90280 44556", date: "2026-08-09", items: [{ name: "Blush Chikankari Kurta Set", qty: 2, size: "L", price: 3299 }], amount: 6697, payment: "Cash on Delivery", status: "Shipped" },
  { id: "GMC-1043", customer: "Pooja Kamble", phone: "+91 70301 99881", date: "2026-08-16", items: [{ name: "Rose Gold Sequin Crop Top Set", qty: 1, size: "S", price: 2699 }], amount: 2798, payment: "Card", status: "Processing" },
  { id: "GMC-1044", customer: "Manasi Jadhav", phone: "+91 88880 12345", date: "2026-08-21", items: [{ name: "Emerald Silk Party Dress", qty: 1, size: "M", price: 3899 }], amount: 3998, payment: "Digital Wallet", status: "Pending" },
];

export type Booking = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  outfit: string;
  size: string;
  start: string;
  end: string;
  occasion: string;
  notes: string;
  rental: number;
  deposit: number;
  status: string;
};

export const bookingStatuses = ["Pending", "Confirmed", "Ready", "Rented", "Returned", "Cancelled"];

export const seedBookings: Booking[] = [
  { id: "RNT-2051", customer: "Aishwarya Kulkarni", phone: "+91 98501 22334", email: "aishwarya@example.com", outfit: "Regal Red Bridal Lehenga", size: "M", start: "2026-09-02", end: "2026-09-05", occasion: "Engagement", notes: "Needs blouse alteration", rental: 5999, deposit: 11998, status: "Confirmed" },
  { id: "RNT-2052", customer: "Manasi Jadhav", phone: "+91 88880 12345", email: "manasi@example.com", outfit: "Wine Velvet Maternity Trail Gown", size: "L", start: "2026-09-11", end: "2026-09-13", occasion: "Maternity Shoot", notes: "", rental: 2599, deposit: 5198, status: "Pending" },
  { id: "RNT-2053", customer: "Sneha Patil", phone: "+91 98220 11223", email: "sneha@example.com", outfit: "Golden Empress Trail Gown", size: "S", start: "2026-08-18", end: "2026-08-20", occasion: "Pre-Wedding Shoot", notes: "Pickup from shop", rental: 3499, deposit: 6998, status: "Returned" },
];

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

export const customers: Customer[] = [
  { id: 1, name: "Sneha Patil", phone: "+91 98220 11223", email: "sneha@example.com", orders: 4, bookings: 2, spent: 28450, status: "Active" },
  { id: 2, name: "Aishwarya Kulkarni", phone: "+91 98501 22334", email: "aishwarya@example.com", orders: 2, bookings: 3, spent: 41200, status: "Active" },
  { id: 3, name: "Rutuja Shinde", phone: "+91 90280 44556", email: "rutuja@example.com", orders: 5, bookings: 0, spent: 18990, status: "Active" },
  { id: 4, name: "Manasi Jadhav", phone: "+91 88880 12345", email: "manasi@example.com", orders: 1, bookings: 2, spent: 12480, status: "Active" },
  { id: 5, name: "Pooja Kamble", phone: "+91 70301 99881", email: "pooja@example.com", orders: 3, bookings: 1, spent: 15760, status: "Inactive" },
  { id: 6, name: "Shruti Deshpande", phone: "+91 96040 77112", email: "shruti@example.com", orders: 2, bookings: 1, spent: 9800, status: "Active" },
];

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
