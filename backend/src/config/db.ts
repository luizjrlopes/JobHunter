import mongoose from "mongoose";

export const connectToDatabase = async (uri: string) => {
  await mongoose.connect(uri);
  return mongoose.connection;
};
