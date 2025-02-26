//src/interface/

export interface IStockStatus {
  buyable: boolean;
  name: string;
}

export interface ICarAttribute {
  id: number;
  name: string;
  value: string;
}

export interface ICar {
  id: number;
  sku: string;
  name: string;
  price: number;
  regularPrice: number;
  campaign: boolean;
  monthlyCost: number;
  leasingCost: number;
  vatValue: number;
  stockStatus: IStockStatus;
  quantity: number;
  brand: string;
  image: string;
  attributes: ICarAttribute[];
  equipment: {
    highlights: { text: string; icon: boolean }[];
    equipment: { text: string; icon: boolean }[];
  }; // Define the structure for equipment
}
