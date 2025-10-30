import mongoose from "mongoose";

const db=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected sucessfully!!")

    }catch(err){
        console.log("Error in connecting to database : ",err);
        process.exit(1)
    }

}

export default db;