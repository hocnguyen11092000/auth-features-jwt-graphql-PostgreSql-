import { Context } from "./types/Context";
require("dotenv").config();
import cors from "cors";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createServer } from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { GreetingResolver } from "./resolvers/greeting";
import { UserResolver } from "./resolvers/user";
import refreshTokenRouter from "./routes/refreshToken";
import cookieParser from "cookie-parser";

const main = async () => {
  createConnection({
    type: "postgres",
    database: "jwt-auth",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User],
  });

  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.use("/refresh-token", refreshTokenRouter);

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver, UserResolver],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }): Pick<Context, "req" | "res"> => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: { origin: "http://localhost:3000", credentials: true },
  });

  const PORT = process.env.PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );

  console.log(
    `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
};

main().catch((error) => console.log("Error", error));
