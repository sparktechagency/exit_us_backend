import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscripton.interface";

const subscriptionSchema = new Schema<ISubscription,SubscriptionModel>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  txId: {
    type: String,
    required: true,
  },
});

export const  Subscription = model<ISubscription, SubscriptionModel>('Subscription', subscriptionSchema);