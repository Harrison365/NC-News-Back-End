# Welcome To NC News (Back-End)!

## Overview

- Please use this link to see the complete, hosted verion of this back-end project > https://nc-news-back-end-zg12.onrender.com/

- This project was produced as a showcase of my back-end development skills including test-driven development, the use of Model-View-Controller (MVC) software design, SQL, error handling and more.

## Set-Up

- To explore the backend code, simply create a local repository using "git clone https://github.com/Harrison365/NC-News-Back-End.git".

- You will then need to create 2 new files in the root of the project, one called ".env.test" and the other ".env.development". Each file should contain the following code, respectively.

```
PGDATABASE=nc_news_test
```

```
PGDATABASE=nc_news
```

- Next, install dependancies and seed the database locally using "npm i" followed by "npm run seed".

- "npm t" can then be used to run the tests.

## Front-End

- This back-end provides article and comment information for my front-end news website project > https://nc-news-front-end-hr.netlify.app/

- GitHub Repo > https://github.com/Harrison365/fe-nc-news

## Prerequisites

-Node.js version 16.0.0 and Postgres version 14 are required for this project.
