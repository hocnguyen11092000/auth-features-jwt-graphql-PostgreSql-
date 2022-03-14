import { Context } from "./../types/Context";
import { checkAuth } from "./../middleware/checkAuth";
import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class GreetingResolver {
  @Query(() => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() { user }: Context): Promise<string> {
    const existUser = await User.findOne(user.userId);
    return `hello ${existUser ? existUser.username : "word"}`;
  }
}
