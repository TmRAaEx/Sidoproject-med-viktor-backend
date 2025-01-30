//src/models/car

import mongoose from "mongoose";
import {ICar} from "@interfaces/Icar";

const carSchema = new mongoose.Schema(
    {
        id: {type: Number, required: true, unique: true},
        sku: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        regularPrice: {type: Number, required: true},
        campaign: {type: Boolean, required: true},
        monthlyCost: {type: Number, required: true},
        leasingCost: {type: Number, required: true},
        vatValue: {type: Number, required: true},
        stockStatus: {
            buyable: {type: Boolean, required: true},
            name: {type: String, required: true}
        },
        quantity: {type: Number, required: true},
        brand: {type: String, required: true},
        image: {type: String, required: true},
        attributes: [{
            id: {type: Number, required: true},
            name: {type: String, required: true},
            value: {type: String, required: true}
        },]
    }
)

const Car = mongoose.model<ICar>("Car", carSchema);
export default Car;