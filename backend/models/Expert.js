import mongoose from "mongoose";

const expertSchema =new  mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true,
        },
        category:
        {
            type:String,
            required:true,
        },
        Experience:
        {
            type:Number,
            required:true
        },
        availableSlots:
        [{
            date:String,
            time:String,
            isBooked:
            {
                type:Boolean,
                default:true
            }
        }]
    })

const Expert = mongoose.model("Expert",expertSchema);
export default Expert;