const app = require("../../app.js")

// app.listen(9090, () => {
//     console.log("Server is listening on port 9090...");
//   });

const { PORT = 9090 } = process.env;

app.listen(PORT, () =>
console.log(`Listening on ${PORT}...`));