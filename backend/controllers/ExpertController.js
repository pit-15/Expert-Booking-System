import mongoose from "mongoose";
import errorResponse from "../middlewares/errorResponse.js";
import Expert from "../models/Expert.js";
import asyncHandler from "../utils/asyncHandler.js";


// Get request without expert's ID
export const getExperts= asyncHandler(async(req,res)=>
{
        const { page=1,limit=10,name,category} = req.query;

        let query ={}
        if(name)
        {
             query.name={$regex : name ,$options:'i'}
        }
        if(category)
        {
            query.category = category
        }
        const experts = await Expert.find(query).limit(limit*1).skip((page-1)*limit).exec();
        
        const count = await Expert.countDocuments(query);
        
        res.json({
            experts,
            totalPages:Math.ceil(count/limit),
            currentPage:page
        })

})


//Get request with expert's ID
export const getExpertsbyID = asyncHandler(async(req,res)=>
{
    if(!mongoose.Types.ObjectID.isValid(req.params.id))
    {
        throw new errorResponse("Invalid ID format",400);
    }
    
    const expert = await Expert.findById(req.params.id);
    if(!expert)
    {
        throw new errorResponse("Expert not Found",404)
    }
    res.json(expert)
})
