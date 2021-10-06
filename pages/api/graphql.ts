import 'reflect-metadata';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { buildSchema } from 'type-graphql';

import {
  applyResolversEnhanceMap,
  ResolversEnhanceMap,
} from '@app/generated/type-graphql';
import {
  StripeResolvers,
  SubscriptionResolvers,
  UserResolvers,
} from '@app/graphql/modules';
import { RouteName } from '@app/types';
import { prisma } from '@app/utils/server';
import { authChecker, getSession } from '@app/utils/server';

const cors = Cors({
  allowCredentials: true,
  origin: 'https://studio.apollographql.com',
});

const resolversEnhanceMap: ResolversEnhanceMap = {
  Price: {
    // _all: [Authorized(Role.admin)], // keeping for reference
  },
};

applyResolversEnhanceMap(resolversEnhanceMap);

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [
      // UserCrudResolver // keeping for reference
      UserResolvers,
      StripeResolvers,
      SubscriptionResolvers,
    ],
    authChecker,
    emitSchemaFile: process.env.NODE_ENV === 'development',
  });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const session = await getSession({ req });

      return {
        req,
        session,
        prisma,
      };
    },
    plugins: [
      ...(process.env.NODE_ENV === 'development'
        ? [ApolloServerPluginLandingPageGraphQLPlayground()]
        : []),
    ],
  });

  await server.start();

  return server;
};

const startServer = bootstrap();

export default cors(async (req, res) => {
  const server = await startServer;

  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  return server.createHandler({
    path: RouteName.GRAPHQL,
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
