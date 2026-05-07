// Edit these placeholders with your real restaurant details.
export const SITE = {
  name: "Eat Street Restaurant",
  tagline: "A modern ode to timeless Indian flavours.",
  founder: "Mr. Durgesh Singh",
  established: 2016,

  story:
    "Born in the bustling lanes of Old Delhi in 1987, Eat Street was founded with a single mission — to honour the rich heritage of Indian cuisine while serving it in a warm and modern setting. Inspired by generations of family recipes and traditional cooking methods, our kitchen still slow-cooks every dal overnight, hand-rolls fresh breads daily, and blends aromatic spices from scratch every morning. Over the years, Eat Street has become more than just a restaurant — it is a place where families gather, celebrations come alive, and every meal carries the comfort of home with the elegance of fine dining.",

  restro:
    "Established in 2016, Eat Street Restaurant was built on a passion for authentic flavours, heartfelt hospitality, and memorable dining experiences. From rich North Indian curries and sizzling starters to refreshing beverages and indulgent desserts, every dish is prepared with premium ingredients and attention to detail. Our elegant ambience, family-friendly atmosphere, buffet service, and customised arrangements for birthdays, anniversaries, and private gatherings make Eat Street the perfect destination for both casual outings and special occasions. Whether you're visiting for a quick meal or a grand celebration, we aim to make every visit unforgettable.",

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
