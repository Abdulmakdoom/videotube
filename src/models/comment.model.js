import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)  // ki hum usay sab comments nhi day sakty, ya toh unho bo load krega ---- jaha ak saath show karana ha sab baha hum iskay use nhi karengy

export const Comment = mongoose.model("Comment", commentSchema) // Comment -- jo ki database main jakar plural jo jaega like commnets