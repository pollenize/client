import cors from 'cors';
import express from 'express';
import handleAuth from './auth';
import jwt from 'jsonwebtoken';
import schema from './schema';
import {ApolloServer} from 'apollo-server-express';
import {User, sequelize} from './db';

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://pollenize.org'
        : /http:\/\/localhost:\d{4}/
  })
);

app.get('/auth', handleAuth);

const server = new ApolloServer({
  schema,
  introspection: true,
  async context({req}) {
    try {
      const matches = req.headers.authorization.match(/bearer (\S+)/i);
      const {sub} = jwt.verify(matches[1], process.env.TOKEN_SECRET);
      const user = await User.findByPk(sub);
      return {user};
    } catch (error) {
      return {};
    }
  }
});

server.applyMiddleware({app});

// async function migrateStances() {
//   const stances = await Stance.findAll();
//   for (const stance of stances) {
//     const messageEn = await Message.create({
//       text: stance.textEn
//     });

//     await messageEn.setLanguage(1);

//     const messageFr = await Message.create({
//       text: stance.textFr
//     });

//     await messageFr.setLanguage(2);

//     await stance.setMessages([messageEn, messageFr]);
//   }
// }

sequelize.sync().then(() => {
  // migrateStances();
  app.listen({port: process.env.PORT}, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT +
        server.graphqlPath}`
    );
  });
});
