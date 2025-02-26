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

export interface ICarEquipment {
  equipment: { type: string; text: string; icon: boolean }[];
  highlight: { type: string; text: string; icon: boolean }[];
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
  equipment: ICarEquipment;
}
