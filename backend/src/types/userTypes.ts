import { UserTypes } from "../models/user.model";
import { Request } from "express";

export interface UserRequest extends Request {
  user?: UserTypes;
}
