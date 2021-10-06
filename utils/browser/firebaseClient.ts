import { initializeApp } from 'firebase/app';

import firebaseConfig from '@app/firebaseConfig.json';

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
