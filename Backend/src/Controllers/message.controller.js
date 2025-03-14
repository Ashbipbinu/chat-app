import Message from "../Models/message.model.js";
import User from "../Models/user.model.js";

import {v2 as cloudinary} from 'cloudinary';

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const filteredUsers = await User.find({
      _id: {
        $ne: loggedInUser,
      },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Something went wrong in the get users for side bar !!");
  }
};

export const getUserMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [{senderId: myId, receiverId: userToChatId}, {senderId: userToChatId, receiverId: myId}]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Something went wrong in getting user messages !!")
    }
}

export const sendMessage = async (req, res) => {
    try {
        const  { image, text } = req.body
        const {id : senderId} = req.params
        const receiverId = req.user._id

        let imageUrl;

        if (image){
          const uploadImageRes = await cloudinary.uploader.upload(image)
          imageUrl = uploadImageRes.secure_url
        }

        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          image: imageUrl
        })

        newMessage.save()

        //todo: socket.io to manage realtime chat feature
        
        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Something went wrong on send message !!")
    }
}
