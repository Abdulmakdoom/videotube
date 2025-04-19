import mongoose, {Schema} from "mongoose";
import { Like } from "./like.model.js";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


tweetSchema.post("findOneAndDelete", async (Post) => {
    if (Post) {
        await Like.deleteOne({ tweet: Post._id });
    }
});



export const Tweet = mongoose.model("Tweet", tweetSchema)