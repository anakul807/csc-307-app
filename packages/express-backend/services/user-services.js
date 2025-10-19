import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb+srv://anakul807:<db_password>@cluster0.2pvjuwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

/**
 * Get users with optional filters.
 * - no filters: returns all users
 * - name only: returns users matching name
 * - job only: returns users matching job
 * - both name and job: returns users matching BOTH
 */
function getUsers(name, job) {
  if (name && job) {
    return userModel.find({ name: name, job: job });
  } else if (name && !job) {
    return findUserByName(name);
  } else if (job && !name) {
    return findUserByJob(job);
  } else {
    return userModel.find();
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById,
};
