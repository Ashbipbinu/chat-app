import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloud.js";

export const signUpController = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters!" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exist!!" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data !!" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logInController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      return res.status(400).json({ message: "Invalid Credentials !!" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials !!" });
    }

    generateToken(isUserExist._id, res);

    const limitedUserDetails = Object.fromEntries(
      Object.entries(isUserExist._doc).filter(
        ([key, val]) => key !== "password"
      )
    );

    res.status(200).json({ ...limitedUserDetails });
    return;
  } catch (error) {
    console.log("Something went wrong in Login controller !!", error);
    return;
  }
};

export const logOutController = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Successfully logged Out !!" });
  } catch (error) {
    console.log("Something went wrong in log out controller !!");
  }
  return;
};

export const updateProfile = async (req, res) => {
  try {

    const {profilePic} = req.body

    if(!profilePic){
      return res.status(400).json({message: "Profile picture required"})
    }

    const profileResponse = await cloudinary.uploader.upload(profilePic);

    const userId = req.user._id

    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: profileResponse.secure_url}, {new: true})
    
    const filteredData = Object.fromEntries(Object.entries(updatedUser).filter(([key, val]) => key !== 'password'))

    res.status(200).josn(filteredData)

  } catch (error) {
    console.log("Something went wrong in updated profile !!")
    res.status(500).json({message: error})
  }
}

export const checkAuth = async(req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in check auth !!") 
  }
}
