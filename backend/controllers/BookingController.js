import Expert from "../models/Expert.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";
import errorResponse from "../middlewares/errorResponse.js";
import mongoose from "mongoose";


export const createBooking = asyncHandler(async (req, res) => {
  const {
    expertID,
    expertId,
    clientName,
    name,
    clientEmail,
    email,
    clientPhoneNumber,
    phone,
    date,
    timeSlot,
    notes,
  } = req.body;

  const eid = expertID || expertId;
  const cName = clientName || name;
  const cEmail = clientEmail || email;
  const cPhone = clientPhoneNumber || phone;

  if (!eid || !mongoose.Types.ObjectId.isValid(eid)) {
    throw new errorResponse("Invalid Expert ID", 400)
  }

  if (!cName || !cEmail || !cPhone || !date || !timeSlot) {
    throw new errorResponse("Missing required fields", 400)
  }

  const existingBooking = await Booking.findOne({
    expertID: eid,
    date,
    timeSlot,
  })
  if (existingBooking) {
    throw new errorResponse("This slot is already booked", 400)
  }

  const updatedExpert = await Expert.findOneAndUpdate(
    {
      _id: eid,
      "availableSlots.date": date,
      "availableSlots.time": timeSlot,
      "availableSlots.isBooked": false,
    },
    { $set: { 
            "availableSlots.$.isBooked": true 
            } 
    },
    {
        new: true
    }
  );

  if (!updatedExpert) {
    throw new errorResponse(
      "Slot is booked by another or slot does not exist",
      400
    );
  }

  const booking = await Booking.create({
    expertID: eid,
    clientName: cName,
    clientEmail: cEmail,
    clientPhoneNumber: cPhone,
    date,
    timeSlot,
    notes,
  });

  const io = req.app.get("io");
  io.emit("slotBooked", { expertID: eid, date, timeSlot });

  res.status(201).json({
    message: "Booking confirmed successfully",
    booking,
  });
});


export const getbookingbyEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new errorResponse("Email query parameter is required", 400);
  }

  const bookings = await Booking.find({ clientEmail: email }).populate("expertID", "name category")
    .sort({ createdAt: -1 });

  res.json(bookings);
})


export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ["Pending", "Confirmed", "Completed"]

  if (!validStatuses.includes(status)) {
    throw new errorResponse("Invalid status value", 400)
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )

  if (!updatedBooking) {
    throw new errorResponse("Booking not found", 400);
  }

  res.json({ message: "Status updated", booking: updatedBooking });
})