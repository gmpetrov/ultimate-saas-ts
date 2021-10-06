# 🚀⚡️🧑‍💻 *Ultimate SAAS template Firebase/Typescript/Next.js/Prisma/TypeGraphql/Stripe/Tailwindcss/Postgresql/ReactHookForm* 

*My template to quickstart a SAAS project*

>Stop losing time implementing authentication and payment over and over again.  
Focus on what brings value to your customers

## Demo
https://utlimate-saas-firebase-ts.vercel.app

## Features
- Authentication Firebase Authentication 🔥
  - Email with password
  - Github 
  - Confirm email flow
  - Reset password flow
- Payment with Stripe
  - Stripe checkout
  - Stripe billing portal
  - Stripe webhooks (products / prices are synced)
- Graphql [perfect to bypass Vercel's limit of 12 serveless functions 😀](https://vercel.com/docs/concepts/limits/overview#general-limit-examples)
- Ent-to-end typing thanks to TypeGraphql + Graphql code generator
- Hosted on [vercel](https://vercel.com/) for free 

## Stripe
Check the stripe section of this [repo](https://github.com/vercel/nextjs-subscription-payments) as the steps are very similar

## Postgresql
A postgresql db is needed to deploy the app.  
You can have a very small instance for free on [heroku](https://www.heroku.com/pricing#data-services)  
****

## Made with
- Typescript
- Next.js
- Firebase Authentication
- Prisma
- TypeGraphql
- GraphQL Code Generator
- Apollo
- Postgresql
- Stripe
- Tailwindcss
## Develop

```
# create .env.local
cp .env.example .env.local

# Go in the firebase console and get your private service account
# Then minify the json (https://www.cleancss.com/json-minify/ for exanple) and store it in FIREBASE_SERVICE_ACCOUNT
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"ultimate-saas-ts","private_key_id":"XXXX","private_key":"XXX","client_email":"XX","client_id":"XXX","auth_uri":"XXX","token_uri":"XXX","auth_provider_x509_cert_url":"XXX","client_x509_cert_url":"XXX"}

# In the firebase console get a public firebase config and replace the content of firebaseConfig.json
# https://firebase.google.com/docs/web/learn-more#config-object 

# install dependencies
yarn

# Launch pgsql and maildev
yarn docker:start

# migrate and seed the database
yarn prisma:migrate:dev

yarn prisma:seed

# install stripe cli 
https://stripe.com/docs/webhooks/test

stripe login

stripe listen --forward-to  http://localhost:3000/api/stripe/webhook

# start server
yarn dev

```

## Inspirations
- https://github.com/vercel/nextjs-subscription-payments
- https://github.com/hexrcs/prisma-next-auth
- https://colinhacks.com/essays/nextjs-firebase-authentication
