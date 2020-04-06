const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      "<html><body> <form action='/message' method= 'POST'> <input type='text' name='data'><button type='submit'>submit</button> </form> </body></html"
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", chunk => {
      body.push(chunk);
    });
    req.on("end", () => {
      const message = Buffer.concat(body).toString();
      const splittedMessage = message.split("=");
      fs.writeFileSync("./message.txt", splittedMessage[1]);
    });
    res.setHeader("Location", "/");
    res.statusCode = 302;
    return res.end();
  }
};

module.exports = requestHandler;
