import { Image } from "../../../shared/model/image.model";

export interface Object{
  name: string;
  description: string;
  image: Image | null;
  category: 'WC' | 'Restaurant' | 'Parking' | 'Other';
}