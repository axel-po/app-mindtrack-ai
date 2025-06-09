import { UserModel } from "@/data/models/user-model";

export type User = UserModel;

export type CreateUser = Pick<User, "email" | "name">;

export type UpdateUser = Omit<User, "emailVerified">;

export type UserDTO = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};
