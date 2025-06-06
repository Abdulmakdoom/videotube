import mongoose, {Schema} from "mongoose"

// step 2  ---- subscribtion method process
const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, 
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing 
            ref: "User"
        }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)