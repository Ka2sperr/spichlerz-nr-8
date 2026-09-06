export type LocalizedString = {
  pl: string;
  en: string;
};

export type Address = {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
};

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

export type ContactInfo = {
  phone: string;
  email: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
};

export type ChefProfile = {
  name: string;
  bio: LocalizedString;
  photo: {
    src: string;
    alt: LocalizedString;
    width: number;
    height: number;
  };
};

export type GalleryImage = {
  src: string;
  alt: LocalizedString;
  width: number;
  height: number;
};

export type SeatingPolicy = {
  maxPartySize: number;
  minAdvanceHours: number;
};

export type Restaurant = {
  name: string;
  legalName: string;
  description: LocalizedString;
  shortTagline: LocalizedString;
  address: Address;
  geo: GeoCoordinates;
  contact: ContactInfo;
  social: SocialLinks;
  chef: ChefProfile;
  gallery: GalleryImage[];
  priceRange: string;
  seating: SeatingPolicy;
  parkingInfo: LocalizedString;
  directionsInfo: LocalizedString;
};
