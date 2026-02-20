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
        experience:
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
                default:false
            }
        }]
    })

const Expert = mongoose.model("Expert",expertSchema);
export default Expert;