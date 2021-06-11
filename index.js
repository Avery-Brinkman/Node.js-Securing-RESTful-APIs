import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb+srv://averybrinkman:averybrinkmanPassword@learning-node.58nv1.mongodb.net/Securing_RESTful_APIs?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// bodyparser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// jwt setup
app.use((req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            'RESTFULAPIs',
            (err, decode) => {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
});

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));
