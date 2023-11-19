# TheCat-FE

## Project structure

### Requirements

- Node.js 18+ and yarn

### Getting started

Run the following command on your local environment:

```shell
git clone https://github.com/boomshakar/thecat-fe.git
cd ct-dashboard-new
yarn
# or
yarn install
```

Then, you can run locally in development mode:

```shell
yarn dev
# or
yarn dev --host  # to expose to your network
```

Open http://localhost:5173 with your favourite browser to see the project.

```shell

├── public                          # Public assets folder
├── src                             # Base folder of the application
│   ├── assets                      # Scoped assets folder
│   ├── components                  # Global components
│   ├── constants                   # Reusable static variables
│   ├── hooks                       # Extendable hooks folder
│   ├── pages                       # Defined pages based on folder name
│   ├── styles                      # SCSS Styles
│   ├── types                       # Folde for typed annoations
│   ├── utils                       # Reuseable snippets
│   ├── App.tsx                     # Sub entry point of the app
│   └── main.tsx                    # Entry point of the app
├── .env.example                    # enviroment variables sample
├── .env.local                      # enviroment variables locally used but git ignored
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # gitignore
├── .prettierrc.json                # Prettier configuration
├── .index.html                     # Prettier configuration
├── .package.json                   # Pakeges used in the app
├── README.md                       # This file*
├── .tsconfig.json                  # Typescript configuration
├── .tsconfig.node.json             # Extended Typescript configuration
├── .vite.config.js                 # Vite app configuration
└── .yarn.lock

```
