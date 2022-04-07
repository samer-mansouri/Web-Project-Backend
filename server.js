const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const UserRoutes = require('./routes/UserRoutes');
const QuestionRoutes = require('./routes/QuestionRoutes');
const CommentRoutes = require('./routes/CommentRoutes');

// server listening 

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/',  UserRoutes.router);
app.use('/',  QuestionRoutes.router);
app.use('/',  CommentRoutes.router);
