import user from './user';
import ask from './ask';

export default app => {
    app.use('/user',user);
    app.use('/ask',ask);
}