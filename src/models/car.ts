//src/models/car

import mongoose from "mongoose";
import { ICar } from "@interfaces/Icar";

const carSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    regularPrice: { type: Number, default: null },
    campaign: { type: Boolean, default: null },
    monthlyCost: { type: Number, default: null },
    leasingCost: { type: Number, default: null },
    vatValue: { type: Number, default: null },
    stockStatus: {
      buyable: { type: Boolean, required: true },
      name: { type: String, required: true },
    },
    quantity: { type: Number, required: true },
    brand: { type: String, default: null },
    image: { type: String, required: true },
    equipment: {
      highlights: [
        {
          type: { type: String },
          text: { type: String },
          icon: { type: Boolean },
        },
      ],
      equipment: [
        {
          type: { type: String },
          text: { type: String },
          icon: { type: Boolean },
        },
      ],
    },
    attributes: [
      {
        id: { type: Number, default: null },
        name: { type: String, default: null },
        value: { type: String, default: null },
      },
    ],
  },
  { timestamps: true }
);

const Car = mongoose.model<ICar>("Car", carSchema);
export default Car;
