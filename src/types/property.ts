export interface PropertyContact {
  name: string;
  role: string;
}

export interface Property {
  id: string;
  price: string;
  location: string;
  propertyType: string;
  highlight?: string;
  imageSrc: string;
  imageAlt: string;
  isVerified: boolean;
  isAvailableNow: boolean;
  contact: PropertyContact;
}
