"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const greeting_1 = require("./resolvers/greeting");
const user_1 = require("./resolvers/user");
const refreshToken_1 = __importDefault(require("./routes/refreshToken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const main = async () => {
    (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "jwt-auth",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User_1.User],
    });
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
    app.use((0, cookie_parser_1.default)());
    app.use("/refresh-token", refreshToken_1.default);
    const httpServer = (0, http_1.createServer)(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [greeting_1.GreetingResolver, user_1.UserResolver],
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
        context: ({ req, res }) => ({ req, res }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000", credentials: true },
    });
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`);
};
main().catch((error) => console.log("Error", error));
//# sourceMappingURL=index.js.map