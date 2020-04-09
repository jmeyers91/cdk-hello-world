import * as Koa from "koa";
const port = parseInt(process.env.PORT || "3000", 10);

const app = new Koa().use(async (context) => {
  context.response.body = { hello: "world" };
});

app.listen(port, () => console.log(`Listening on port ${port}`));
