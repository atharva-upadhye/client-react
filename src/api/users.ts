import { errorMsg } from "@/utils/funcs";
import { userSchema } from "@/schemas/user";
import { z } from "zod";

export const getUsers = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    return z.array(userSchema).parse(await res.json());
  } catch (error) {
    throw new Error(errorMsg(error));
  }
};
