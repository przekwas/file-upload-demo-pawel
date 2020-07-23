import * as express from 'express';
import * as cors from 'cors';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(apiRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
