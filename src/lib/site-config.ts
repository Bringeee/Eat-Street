// Edit these placeholders with your real restaurant details.
export const SITE = {
  name: "Eat Street Restaurant",
  tagline: "A modern ode to timeless Indian flavours.",
  founder: "Mr. Durgesh Singh",
  established: 2016,
  story:
    "Born in the bustling lanes of Old Delhi in 1987, Eat Street was founded by Chef Arjun Kapoor with a single mission — to honour the ancestral recipes of his grandmother while serving them in a setting fit for a modern feast. Three generations later, our kitchen still slow-cooks every dal overnight, hand-rolls every roti, and grinds every spice fresh at dawn.",
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
