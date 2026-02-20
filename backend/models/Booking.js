import mongoose from "mongoose";

const BookingSchema= new mongoose.Schema(
    {
        expertID:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Expert",
            required:true
        },
        clientName:
        {
            type:String,
            required:true
        },
        clientEmail:
        {
            type:String,
            required:true
        },
        clientPhoneNumber:
        {
            type:String,
            required:true
        }, 
        date:
        {
            type:String,
            required:true
        },
        timeSlot:
        {
            type:String,
            required:true
        },
        notes:
        {
            type:String
        },
        status:
        {
            type:String,
            enum:["Pending","Confirmed","Completed"],
            default:"Pending",
        }
    },
    {
        timestapmps:true
    }
)

const Booking = mongoose.model("Booking",BookingSchema)
export default Booking;