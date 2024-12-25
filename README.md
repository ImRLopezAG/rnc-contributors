# RNC Contributors

RNC Contributors is an open-source api that allows users to view the contributors of `Registro Nacional de Contribuyentes` (RNC) in the Dominican Republic. The api is built using [Next.js](https://nextjs.org/) as server and [Hono](https://hono.dev/) as api.

The data is fetched from the [DGII's](https://dgii.gov.do/) RNC contributors file then uploaded to a [SQLite](https://turso.tech/) database but you can use any database that [DRIZZLE ORM](https://orm.drizzle.team/) supports.


## Getting Started

To get started with the project, you need to clone the repository and install the dependencies.

```bash
git clone https://github.com/ImRLopezAG/rnc-contributors
cd rnc-contributors
```
create a `.env` file in the root of the project and add the following environment variables:

```bash
DATABASE_URL=file:./src/server/db/data.db # on production should be a real database url
DB_AUTH_TOKEN=your_auth_token # if production
```
## Installation

To install the project, you need to have [Node.js](https://nodejs.org/en/) installed in your machine. Then >= 20.0.0 version of Node.js is required.

```bash
npm install
```
```bash
pnpm install
```
```bash
bun install
```

```bash
yarn install
```

## Usage

### Database setup
To start the project, you need to run the following command base on the package manager you are using.:

```bash
npm run db:push
# or
yarn db:push
# or
pnpm db:push
# or
bun db:push
```
if you want to use any other database that [DRIZZLE ORM](https://orm.drizzle.team/) supports, you need to install the database driver and update the `DATABASE_URL` environment variable in the `.env` file and the contributors model on [Model](/src/server/db/contributors.model.ts) file.

### Development
this command will create the database and the tables needed to store the data.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Download the [DGII's](https://dgii.gov.do/app/WebApps/Consultas/RNC/DGII_RNC.zip) RNC contributors file and upload it to the database with the api endpoint `http://localhost:3000/api/contributors/update`.

## Tools
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Hono](https://img.shields.io/badge/Hono-000000?style=for-the-badge&logo=hono&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white) ![DRIZZLE ORM](https://img.shields.io/badge/DRIZZLE%20ORM-000000?style=for-the-badge&logo=drizzle&logoColor=white)

## Authors

[![ImRLopezAG](https://img.shields.io/badge/ImRLopezAG-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ImRLopezAG)

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://imrlopez.vercel.app)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/angel-gabriel-lopez/)