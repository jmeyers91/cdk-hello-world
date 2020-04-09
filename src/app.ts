import * as Koa from "koa";
import * as Knex from "knex";
const port = parseInt(process.env.PORT || "3000", 10);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing env var: DATABASE_URL");
}

console.log(`Connecting to database: ${databaseUrl}`);
const db = Knex({
  client: "pg",
  connection: databaseUrl,
});

const app = new Koa().use(async (context) => {
  try {
    context.response.body = {
      hello: "world",
      queryResult: await db.raw("SELECT 10 + 15"),
    };
  } catch (error) {
    context.response.body = {
      error: { ...error, message: error.message },
    };
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
