import { ApolloError } from 'apollo-server-micro';
import { AuthChecker, Ctx } from 'type-graphql';

import { ApolloServerContext } from '@app/types';

enum ErrorCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
}

// export type ErrorCode = keyof typeof constants.ERROR_CODES;

export class AppError extends ApolloError {
  constructor(code: ErrorCodes, message?: string) {
    super(message || code, code);
  }
}

const authChecker: AuthChecker<ApolloServerContext> = async (
  { root, args, context, info },
  roles
) => {
  if (!context.session) {
    throw new AppError(ErrorCodes.UNAUTHORIZED);
  }

  if (roles.length > 0) {
    const user = await context?.prisma?.user.findUnique({
      where: {
        id: context.session.uid,
      },
    });

    if (!user || !roles.includes(user.role)) {
      throw new AppError(ErrorCodes.UNAUTHORIZED);
    }
  }

  return true;
};

export default authChecker;
