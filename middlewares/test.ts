import nextConnect from 'next-connect';

import passport from '@app/utils/ssr/passport';

const auth = nextConnect().use(passport.initialize());

export default auth;
