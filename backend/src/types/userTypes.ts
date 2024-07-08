import { Request } from "express";

import { UserTypes } from "../models/user.model";

export interface UserRequest extends Request {
  user?: UserTypes;
}
