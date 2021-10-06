import 'firebase/auth';

import firebaseClient from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDkTrgg_T-kQOpibv1kSnuUfKLNZ427GyA',
  authDomain: 'ultimate-saas-ts.firebaseapp.com',
  projectId: 'ultimate-saas-ts',
  storageBucket: 'ultimate-saas-ts.appspot.com',
  messagingSenderId: '340610171597',
  appId: '1:340610171597:web:867521d18b64ce9f7d9f84',
};

if (typeof window !== 'undefined' && !(firebaseClient as any).apps.length) {
  firebaseClient.initializeApp(firebaseConfig);
  // (firebaseClient as any)
  //   .auth()
  //   .setPersistence((firebaseClient as any).auth.Auth.Persistence.SESSION);
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
