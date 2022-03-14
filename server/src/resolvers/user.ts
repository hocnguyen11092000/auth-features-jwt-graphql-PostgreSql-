import { sendRefeshToken } from "./../utils/auth";
import { Context } from "./../types/Context";
import argon2 from "argon2";
import { LoginInput } from "../types/LoginInput";
import { createToken } from "../utils/auth";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "./../types/UserMutationResponse";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg("registerInput")
    registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const { username, password } = registerInput;
    const existUser = await User.findOne({ username });

    if (existUser) {
      return {
        code: 400,
        success: false,
        message: "Duplicated username",
      };
    }

    const hastPass = await argon2.hash(password);
    const newUser = User.create({
      username,
      password: hastPass,
    });

    await newUser.save();

    return {
      code: 200,
      success: true,
      message: "User registration successful",
      user: newUser,
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput") { username, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existUser = await User.findOne({ username });

    if (!existUser) {
      return {
        code: 400,
        success: false,
        message: "User not found",
      };
    }

    const isPasswordValid = await argon2.verify(existUser.password, password);
    if (!isPasswordValid) {
      return {
        code: 400,
        success: false,
        message: "Wrong password",
      };
    }
    sendRefeshToken(res, existUser);

    return {
      code: 200,
      success: true,
      message: "login successfully",
      user: existUser,
      accessToken: createToken("accessToken", existUser),
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async logout(
    @Arg("userId", (_type) => ID) userId: number,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existUser = await User.findOne(userId);

    if (!existUser) {
      return {
        code: 400,
        success: false,
      };
    }

    existUser.tokenVerison += 1;

    await existUser.save();
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/refresh-token",
    });

    return {
      code: 200,
      success: true,
    };
  }
}
