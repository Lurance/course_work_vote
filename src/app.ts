import "reflect-metadata"

import * as mongoose from 'mongoose'

import * as Application from "koa"

import * as cors from 'koa2-cors'

import {
    BadRequestError,
    BodyParam,
    Ctx,
    Get,
    JsonController,
    Param,
    Post, Session,
    UnauthorizedError,
    useKoaServer
} from "routing-controllers"

import * as serve from "koa-static"

import ms = require("ms")

import * as md5 from "js-md5"
import * as session from "koa-session"
import {Context} from "koa"

const PORT = 2345

mongoose.connect('mongodb://127.0.0.1:27017/vote')
    .then()
    .catch(err => console.error(err))

mongoose.connection
    .once('error', err => console.error(`mongodb connect error:\n${err}`))
    .once('open', async () => {
        console.log('MongoDB Connect Success')
        console.log('Start Create Init Data')

        await Vote.deleteMany({})

        Vote.create({
            name: '复仇者联盟',
            img: `http://127.0.0.1:${PORT}/img/83db569a61f8f225bcceb6985d1ead7d.jpg`,
            categories: ['动作'],
            createBy: '漫威'
        })

        Vote.create({
            name: '美国队长',
            img: `http://127.0.0.1:${PORT}/img/a4a6a127ff2ce80274d992d04c10258b.jpg`,
            categories: ['动作'],
            createBy: '漫威'
        })

        Vote.create({
            name: '无问西东',
            img: `http://127.0.0.1:${PORT}/img/b14115bd883b1065045b8c82db3bb5f5.png`,
            categories: ['剧情', '爱情'],
            createBy: '企鹅影视'
        })

        Vote.create({
            name: '唐人街探案2',
            img: `http://127.0.0.1:${PORT}/img/d25881c851fb91460b66d8b7f056b309.jpg`,
            categories: ['悬疑', '喜剧'],
            createBy: '万达影视'
        })

        Vote.create({
            name: '华尔街之狼',
            img: `http://127.0.0.1:${PORT}/img/6672a1e282a4ed83b0dc55d607456e6f.jpeg`,
            categories: ['传记', '犯罪'],
            createBy: '派拉蒙影业'
        })

        Vote.create({
            name: '复仇者联盟',
            img: `http://127.0.0.1:${PORT}/img/83db569a61f8f225bcceb6985d1ead7d.jpg`,
            categories: ['动作'],
            createBy: '漫威'
        })

        Vote.create({
            name: '美国队长',
            img: `http://127.0.0.1:${PORT}/img/a4a6a127ff2ce80274d992d04c10258b.jpg`,
            categories: ['动作'],
            createBy: '漫威'
        })

        Vote.create({
            name: '唐人街探案2',
            img: `http://127.0.0.1:${PORT}/img/d25881c851fb91460b66d8b7f056b309.jpg`,
            categories: ['悬疑', '喜剧'],
            createBy: '万达影视'
        })

        Vote.create({
            name: '华尔街之狼',
            img: `http://127.0.0.1:${PORT}/img/6672a1e282a4ed83b0dc55d607456e6f.jpeg`,
            categories: ['传记', '犯罪'],
            createBy: '派拉蒙影业'
        })

        Vote.create({
            name: '无问西东',
            img: `http://127.0.0.1:${PORT}/img/b14115bd883b1065045b8c82db3bb5f5.png`,
            categories: ['剧情', '爱情'],
            createBy: '企鹅影视'
        })

        Vote.create({
            name: '复仇者联盟',
            img: `http://127.0.0.1:${PORT}/img/83db569a61f8f225bcceb6985d1ead7d.jpg`,
            categories: ['动作'],
            createBy: '漫威'
        })


        console.log('End Create Init Data')
    });

export interface IVote extends mongoose.Document {
    name: string,
    img: string,
    categories: string[],
    createBy: string,
    vote: number
}

export interface IUser extends mongoose.Document {
    username: string,
    password: string,
    votes: string[],
    createdAt: Date
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    votes: [String],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

userSchema.pre<IUser>('save', function (next) {
    if (this.password) {
        this.password = md5(this.password)
    }

    next()
})

const User = mongoose.model<IUser>('User', userSchema)


const voteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
    },
    createBy: {
        type: String,
        required: true
    },
    vote: {
        type: Number,
        default: 0,
        required: true
    }
})

const Vote = mongoose.model<IVote>('Voto', voteSchema)

@JsonController()
class UserController {
    @Post('/login')
    async loginUser(@BodyParam('username', {required: true}) username: string,
                    @BodyParam('password', {required: true}) password: string,
                    @Ctx() ctx: Context) {
        const u = await User.findOne({username: username, password: md5(password)})
        if (u) {
            ctx.session.user = {
                _id: u._id,
                username: u.username
            }
            return {
                status: 1,
                username: u.username,
                expiresOn: Date.now() + 86400000
            }
        } else {
            throw new UnauthorizedError()
        }
    }


    @Post('/reg')
    async reguser(@BodyParam('username', {required: true}) username: string,
                  @BodyParam('password', {required: true}) password: string) {
        if (await User.count({username: username}) > 0) {
            throw new BadRequestError()
        } else {
            User.create({
                username: username,
                password: password
            })

            return {
                status: 1
            }
        }
    }
}


@JsonController()
class VoteController {
    @Get('/page')
    async todoPage(@Session('user') user: IUser) {
        console.log(user)
        const allNum = await Vote.count({})
        if (allNum === 0) {
            return [1]
        }
        return [...Array(Math.ceil(allNum / 6)).keys()].map(v => v + 1)
    }

    @Get('/vote/:p')
    getVotes(@Param('p') p: number) {
        return Vote.find()
            .sort('_id')
            .limit(6)
            .skip((p - 1) * 6)
    }
}

export const createServer = (): Application => {
    const app = new Application()

    app.keys= ['cweopj324jcnsop30f']

    app.use(session({
        key: 'koa:sess',
        maxAge: 86400000,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false,
    }, app))

    app.use(cors())

    app.use(serve(__dirname + '/static', {
        maxAge: ms('20d')
    }))

    app.use(serve(__dirname + '/../dist'))

    useKoaServer(app, {
        routePrefix: '/api',
        controllers: [
            VoteController,
            UserController
        ],
        classTransformer: false,
        development: true
    })

    return app
}


try {
    createServer().listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`)
    })
} catch (e) {
    console.log(e)
    process.exit(1)
}