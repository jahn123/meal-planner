This is an app that acts as a digital recipe book. Features to generate meal plans based off of recipes will be coming soon!

## Table of Contents
- [Installation](#installation)
- [Set Up](#set-up)

## Installation

First, install necessary packages:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Set Up

First, create an account with Vercel and import your clone of this repo to create a project. Name your project and then press deploy.

On the dashboard page for your project, click the Storage tab on top menu.

Then click on 'Create Database' and select 'Neon - Serverless Postgres'. Select the default options and name your server.

After setting up your server, click on the '.env.local' tab and then the 'Copy Snippet'. Paste the text into a new file called '.env' in your 'meal-planner' root directory.

Then in your browser, go to [http://localhost:3000/seed](http://localhost:3000/seed) to create database tables.

On your project's main page, the domains section will provide you with the link to access the app.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.
