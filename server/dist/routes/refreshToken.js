"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../utils/auth");
const User_1 = require("./../entities/User");
const jsonwebtoken_1 = require("jsonwebtoken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE];
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        const decodeUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existUser = await User_1.User.findOne(decodeUser.userId);
        if (!existUser || existUser.tokenVerison !== decodeUser.tokenVersion) {
            return res.sendStatus(401);
        }
        (0, auth_1.sendRefeshToken)(res, existUser);
        return res.json({
            success: true,
            accessToken: (0, auth_1.createToken)("accessToken", existUser),
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});
exports.default = router;
//# sourceMappingURL=refreshToken.js.map