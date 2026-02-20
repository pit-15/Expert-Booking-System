import Expert from "../models/Expert.js";
import asyncHandler from "../utils/asyncHandler.js";
import errorResponse from "../middlewares/errorResponse.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// Create Booking
export const createBooking = asyncHandler(async(req,res)=>
{
    let {expertID,clientName,clientEmail,clientPhoneNumber,date,timeSlot,notes}=req.body

    if (!mongoose.Types.ObjectId.isValid(expertID)) 
    {
        throw new errorResponse("Invalid Expert ID", 400);
    }

    if(!expertID || !clientName || !clientEmail || !clientPhoneNumber || !date || ! timeSlot)
    {
        throw new errorResponse("Missing requried Fields",400)
    }

    const existingBooking = await Booking.findOne({
        expertID,
        date,
        timeSlot
    });

    if (existingBooking) {
        throw new errorResponse("This slot is already booked", 400);
    }


    const updatedExpert = await Expert.findOneAndUpdate
    (
        {
        _id:expertID,
        "availableSlots.date":date,
        "availableSlots.time":timeSlot,
        "availableSlots.isBooked":false
        },
        {
            $set:{
                "availableSlots.$.isBooked":true 
            }
        },
        {
            new:true,
        }
    )

    if(!updatedExpert)
    {
        throw new errorResponse("Slot is booked by another or slot doesnt exist",400);
    }

    const newBooking = new Booking(
        {
            expertID,
            clientName,
            clientEmail,
            clientPhoneNumber,
            date,
            timeSlot,
            notes
        });;
    await newBooking.save();

    //update that the slot i snow booked, if someone if trying to book the same solt
    const io = req.app.get('io');
    io.emit('slotBooked', { expertID, date, timeSlot });


    res.status(201).json({
        message:"Booking Confirmed Successfully",
        booking:newBooking
    })
}) 


export const getbookingbyEmail = asyncHandler(async(req,res)=>
{
    const {email} =req.query;

    if(!email)
    {
        throw new errorResponse("Email Query Parameter is required",400)
    }
    const bookings = await Booking.find({clientEmail:email}).populate('expertID','name category')
                                    .sort({createdAt:-1}) 
    
    res.json(bookings)

})

export const updateBookingStatus = asyncHandler(async (req, res) => {

        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Completed'];

        if (!validStatuses.includes(status)) {
           throw new errorResponse("Invalid status value",400);
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
           throw new errorResponse( "Booking not found" ,400);
        }

        res.json({ message: "Status updated", booking: updatedBooking });
        
})