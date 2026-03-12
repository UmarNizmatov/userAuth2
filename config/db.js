import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log("DB connected"))
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } catch (error) {
    throw error;
  }
};
export default dbConnect;
