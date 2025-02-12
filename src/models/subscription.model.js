import mongoose, {Schema} from "mongoose"

// step 2  ---- subscribtion method process
const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, // one who is subscribing --- followers  store hongy
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing -- following store hongy -- jisko hum follow krengy unky channel ki id store hongy
            ref: "User"
        }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)