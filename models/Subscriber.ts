import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISubscriber extends Document {
    email: string
    status: "subscribed" | "unsubscribed"
    subscribedAt: Date
}

const SubscriberSchema = new Schema<ISubscriber>(
    {
        email: { type: String, required: true, unique: true },
        status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
        subscribedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
)

// Prevent overwriting model if already compiled
const Subscriber: Model<ISubscriber> =
    mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema)

export default Subscriber
