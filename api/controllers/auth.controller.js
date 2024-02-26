import user from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("user creat succesfuly");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const valideuser = await user.findOne({ email });
    if (!valideuser) return next(errorHandler(404, "user not found !"));

    const validepassword = bcryptjs.compareSync(password, valideuser.password);
    if (!validepassword) return next(errorHandler(401, "wrong credential !"));

    const token = jwt.sign({ id: valideuser._id }, process.env.JWT_SECRET);
    const {password: pass, ...rest}=valideuser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
