import app from "./app";
import pool from "./database/connection";

const port = 5000 || process.env.PORT;

app.listen(port, () => console.log(`Listening on port ${port}`));
