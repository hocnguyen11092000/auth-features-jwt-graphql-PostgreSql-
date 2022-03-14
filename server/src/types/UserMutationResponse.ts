import { Field, ObjectType } from "type-graphql";
import { User } from "./../entities/User";
import { IMutationResponse } from "./MutationResponse";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
  code: number;
  success: boolean;
  message?: string | undefined;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}
