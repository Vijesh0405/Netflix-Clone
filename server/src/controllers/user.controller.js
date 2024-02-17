import { User } from "../models/user.model.js";
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  checkEmailFormat,
} from "../utils/index.js";

import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (user) => {
    try {
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      //save refreshToken to user
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "something went wrong while generating refreshToken and accessToken"
      );
    }
  };

  //get user
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId).select("-password");
  
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: user,
          },
          "User found Successfully"
        )
      );
    } catch (error) {
      throw new ApiError(404, "User not found ,please check id properly");
    }
  });
  
  // User registration
  const registerUser = asyncHandler(async (req, res) => {
  
    const {email,password } = req.body;
  
    //checking for null value
    if (
      [email,password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    if (!checkEmailFormat(email)) {
      throw new ApiError(400, "email format is not valid");
    }
  
    // 3. Check user already present in db or not. If yes don't save data to db and send a response to user.
    const existingUser = await User.findOne({ email: email });
  
    if (existingUser) {
      throw new ApiError(409, "email already exists");
    }
    // create a new entry in db
    const user = await User.create({
      email,
      password,
    });
  
    //checking for user created or not
    if (!user) {
      throw new ApiError(500, "Something went wrong while registering the User");
    }
  
    // remove password and refresh token from user - because our password will be hashed and we don,t want to give these to client
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User created Successfully"));
  });

  // user login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    
    if (!email) {
      throw new ApiError(400, "email is required ");
    }
    //find user
    const user = await User.findOne({
     email
    });
  
    //checking for user exists or not
    if (!user) {
      throw new ApiError(404, "User not exist with this email");
    }
  
    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
  
    if (!isPasswordCorrect) {
      throw new ApiError(401, "password is not correct");
    }
    console.log("user found : ", user);
    //generate access and refresh token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user);
    //now remove password and refresh token fields from user
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    //cookie options
    // in options ke karan hum cookies ko frontend se edit nahi kr sakte kevel server se edit kr sakte hai
    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  });
  
  //logout
  const logoutUser = asyncHandler(async (req, res) => {
    const userID = req.user._id

    //find user and remove refresh token ,tabhi to user logout hoga
    //remove cookies
    await User.findByIdAndUpdate(
        userID,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true    //iska kam itna hai ki new updated user return ho ,old wala na ho
        }
    )

    //removing cookies and sending response

    //cookie options
    const options = {
        httpOnly: true,
        sameSite:'None',
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)    //cookie name same hona chahiye jo banate time nam diya tha wahi 
        .json(new ApiResponse(200, {}, "User logged out"))  

})

//getCookie
const getCookie = asyncHandler(async (req,res)=>{
    const {accessToken,refreshToken} = req.cookies
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken
            },
            "Token fetched Successfully"
        )
    )
})

//refresh AccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        //verify refresh token 
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        //find user
        const user = await User.findById(decodedToken?._id)

        //check user exists or not
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        //verify user.refreshToken and incomingRefreshToken
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "refresh token is expired")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

        // cookie options
        const options = {
            httpOnly: true,
            sameSite: "None",
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken
                    },
                    "Access Token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }

})

//change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body
    if (!newPassword || !oldPassword) {
        throw new ApiError(400, "all fields are required")
    }
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "oldPassword is not correct")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "password is changed Successfully"
            )
        )
})

//get current User
const getCurrentUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "current user fetched Successfully"

            )
        )
})

//update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {

    try {
        const avatarLocalPath = req.file?.path  //only avatar file hai to file use krenge naki files
    
        if (!avatarLocalPath) {
            throw new ApiError(400, 'Avatar file is required')
        }
    
        //upload on cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if (!avatar) {
            throw new ApiError(500, "Something went wrong while uploading avatar file at updateUserAvatar")
        }
    
        //save new url to user and delete old one from cloudinary
    
        //delete oldAvatar from cloudinary
        const oldAvatar = req.user?.avatar
    
        const deleteResponse = await deleteFromCloudinary(oldAvatar)
    
        //save new user
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken")
    
    
        //return response
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        user,
                        deleteResponse
                    }
                    ,
                    "User avatar updated successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500,error?.message||"error at update avatar")
    }
})

//update fullname
const updateFullName =  asyncHandler(async (req, res) => {
    const { fullName } = req.body;
    console.log(fullName);
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName:fullName?fullName:req.user?.fullName,
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User fullName updated successfully"
            )
        )
});

//delete account 
const deleteUser = asyncHandler(async (req,res)=>{
    try {
      await User.findByIdAndDelete(req.user?._id)

      const options = {
        httpOnly: true,
        sameSite:'None',
        secure: true
    }
      res.status(200)
      .clearCookie('refreshToken',options)
      .clearCookie('accessToken',options)
      .json(
        new ApiResponse(
            200,
            {},
            "Account deleted Successfully"
        )
      )
       
    } catch (error) {
        res.status(500)
        .json(
            new ApiResponse(
                500,
                {},
                "Something went wrong during deleting account"
            )
        )
    }
})
export {registerUser,
    loginUser,logoutUser,
    changeCurrentPassword,
    updateUserAvatar,updateFullName,
    getCurrentUser,refreshAccessToken,
    getUser,deleteUser,getCookie
}