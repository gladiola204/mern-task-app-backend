import { app } from "./app";
import { connect } from "./client";

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

connect();