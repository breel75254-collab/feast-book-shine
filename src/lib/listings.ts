export type Category = "Rentals" | "Jobs" | "Car Hire";

export interface Listing {
  id: string;
  title: string;
  category: Category;
  price: string;
  location: string;
  phone: string;
  description: string;
  verified: boolean;
  posted: string;
}

export const categories: { name: Category; blurb: string; icon: string }[] = [
  {
    name: "Rentals",
    blurb: "Houses, bedsitters, hostels near Maseno, shops and land.",
    icon: "🏠",
  },
  {
    name: "Jobs",
    blurb: "Formal jobs, kibarua work, internships and skilled fundis.",
    icon: "🛠️",
  },
  {
    name: "Car Hire",
    blurb: "Cars with or without a driver, pickups, lorries and matatu charter.",
    icon: "🚗",
  },
];

export const listings: Listing[] = [
  {
    id: "RN2041",
    title: "Bedsitter near Maseno University gate",
    category: "Rentals",
    price: "KES 6,500 / month",
    location: "Maseno, Kisumu County",
    phone: "0712 345 678",
    description:
      "Clean bedsitter with own bathroom, water available 24/7, 5 minutes walk to the university gate. Safe compound with a watchman.",
    verified: true,
    posted: "2 days ago",
  },
  {
    id: "RN2044",
    title: "2-bedroom house, Maseno town",
    category: "Rentals",
    price: "KES 14,000 / month",
    location: "Maseno town",
    phone: "0733 210 456",
    description:
      "Spacious 2-bedroom with kitchen and sitting room. Tiled floors, prepaid electricity token, ample parking.",
    verified: true,
    posted: "1 day ago",
  },
  {
    id: "RN2050",
    title: "Shop stall on Maseno–Kisumu road",
    category: "Rentals",
    price: "KES 8,000 / month",
    location: "Maseno junction",
    phone: "0701 887 230",
    description:
      "Busy roadside stall suitable for M-Pesa shop, salon or fast food. High foot traffic near the stage.",
    verified: false,
    posted: "5 hours ago",
  },
  {
    id: "JB1187",
    title: "Waiter / waitress wanted, Maseno",
    category: "Jobs",
    price: "KES 18,000 / month",
    location: "Maseno",
    phone: "0771 324 567",
    description:
      "Bar & restaurant opposite Maseno University hiring a waiter/waitress. Evening shifts, meals provided. Experience an added advantage.",
    verified: true,
    posted: "3 days ago",
  },
  {
    id: "JB1190",
    title: "Farm casual workers (kibarua)",
    category: "Jobs",
    price: "KES 600 / day",
    location: "Luanda, Vihiga County",
    phone: "0722 904 311",
    description:
      "Seasonal planting and weeding work, 2 weeks. Paid daily. Bring your own gumboots; lunch provided.",
    verified: false,
    posted: "1 day ago",
  },
  {
    id: "JB1195",
    title: "Fundi — electrician for house wiring",
    category: "Jobs",
    price: "Negotiable",
    location: "Kisumu, Milimani",
    phone: "0740 552 189",
    description:
      "Certified electrician available for house wiring, repairs and solar installation. References available.",
    verified: true,
    posted: "6 hours ago",
  },
  {
    id: "CH3302",
    title: "Toyota Probox for hire, with driver",
    category: "Car Hire",
    price: "KES 3,500 / day",
    location: "Maseno / Kisumu",
    phone: "0715 668 402",
    description:
      "Reliable Probox with experienced driver. Good for errands, market days and upcountry trips. Fuel excluded.",
    verified: true,
    posted: "1 day ago",
  },
  {
    id: "CH3308",
    title: "Pickup for moving goods",
    category: "Car Hire",
    price: "From KES 2,500 / trip",
    location: "Kisumu & environs",
    phone: "0798 114 760",
    description:
      "1-tonne pickup for hire — moving furniture, farm produce and building materials. Loading help available.",
    verified: false,
    posted: "4 days ago",
  },
  {
    id: "CH3311",
    title: "33-seater bus charter for events",
    category: "Car Hire",
    price: "KES 25,000 / day",
    location: "Western Kenya",
    phone: "0726 430 985",
    description:
      "Clean 33-seater for weddings, funerals and school trips. Driver included, negotiable for multi-day hire.",
    verified: true,
    posted: "2 days ago",
  },
];
