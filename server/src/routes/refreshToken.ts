import { sendRefeshToken, createToken } from "./../utils/auth";
import { User } from "./../entities/User";
import { UserAuthPayload } from "./../types/UserAuthPayload";
import { Secret, verify } from "jsonwebtoken";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE as string];

  if (!refreshToken) return res.sendStatus(401);
  try {
    const decodeUser = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as UserAuthPayload;

    const existUser = await User.findOne(decodeUser.userId);

    if (!existUser || existUser.tokenVerison !== decodeUser.tokenVersion) {
      return res.sendStatus(401);
    }

    sendRefeshToken(res, existUser);
    return res.json({
      success: true,
      accessToken: createToken("accessToken", existUser),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
});

export default router;
