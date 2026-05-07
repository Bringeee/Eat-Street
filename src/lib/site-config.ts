// Edit these placeholders with your real restaurant details.
export const SITE = {
  name: "Eat Street Restaurant",
  tagline: "A modern ode to timeless Indian flavours.",
  founder: "Mr. Durgesh Singh",
  established: 2016,

  story:
    "Established in 2016, our restaurant was created with a passion for bringing authentic flavours and genuine hospitality together under one roof. Inspired by traditional recipes and the rich heritage of Indian cuisine, we set out to create a place where people could enjoy comforting meals, warm conversations, and memorable moments with family and friends. Every dish we serve reflects our dedication to quality, freshness, and timeless taste.",
  restro:
    "From hand-crafted breads and aromatic curries to flavourful street-style favourites, our kitchen carefully prepares every meal using fresh ingredients and traditional cooking techniques. While staying rooted in tradition, we also embrace a modern dining experience that makes every visit special. Whether it’s a casual lunch, a family gathering, or a festive celebration, our goal is to make every guest feel at home and leave with a meal worth remembering.",

  speciality:
    "Known for its vibrant ambience and flavour-packed cuisine, Eat Street offers buffet dining, birthday and anniversary celebrations, family gatherings, private party hosting, takeaway services, and comfortable dine-in experiences with modern amenities.",

  phone: "+91 9770152992",
  whatsapp: "919770152992", // digits only, with country code, used for wa.me link

  instagram: "eat_street_restaurant_gwalior",
  instagramUrl:
    "https://www.instagram.com/eat_street_restaurant_gwalior?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",

  address: "B-4 BSF COLONY AIRPORT ROAD, Gwalior, Madhya Pradesh-474020",

  mapsUrl: "https://maps.app.goo.gl/oxgSs7hS91YwVm6p6",

  adminPassword: "DurgeshSingh@EatStreet",
};
export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
