import * as firebaseAdmin from 'firebase-admin';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import nookies from 'nookies';

import config from '@app/config';

const serviceAccount = JSON.parse(config.FIREBASE_SERVICE_ACCOUNT!);

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
  });
}

const getSession = async (
  ctx: { req: NextApiRequest } | GetServerSidePropsContext
) => {
  try {
    const cookies = nookies.get(ctx);
    return await firebaseAdmin.auth().verifyIdToken(cookies.token);
  } catch {
    return null;
  }
};

export { firebaseAdmin, getSession };
