const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const dotEnv = require('dotenv').config();
const { Server } = require('socket.io')
const Redis = require('ioredis')
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 9000
const subscriber = new Redis('')


const io = new Server({ cors: '*' })
io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `{Joined ${channel}}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

const config = {
    CLUSTER: "",
    TASK: "builder-task" // Use family name without ARN
}
app.use(cors());
app.use(express.json())

app.post("/project", async (req, res) => {
    
    const { gitURL, slug } = req.body
    const projectSlug = slug ? slug : generateSlug()
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK, // Using family name instead of full ARN
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    "subnet-00dceb87768b796aa",
                    "subnet-0bdaac5dc73aa41fe",
                    "subnet-0d87986b8a094f662"
                ],
                securityGroups: [
                    "sg-03d9fa3bbf5c5f388"
                ]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: "builder-image",
                    environment: [
                        {
                            name: "GIT_REPOSITORY_URL",
                            value: gitURL
                        },
                        {
                            name: "PROJECT_ID",
                            value: projectSlug
                        },
                        {
                            name: "AWS_ACCESS_KEY_ID",
                            value: process.env.AWS_ACCESS_KEY_ID
                        },
                        {
                            name: "AWS_SECRET_ACCESS_KEY",
                            value: process.env.AWS_SECRET_ACCESS_KEY
                        }
                    ]
                }
            ]
        }
    })

    try {
        await ecsClient.send(command)
        return res.json({ status: 'Queued', data: { projectSlug, url: `http://${projectSlug}.localhost:${8000}` } })
    } catch (error) {
        console.error("ECS Task Run Error:", error);
        return res.status(500).json({ status: 'Error', message: error.message })
    }
})


async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}
initRedisSubscribe()
app.listen(PORT, () => {
    console.log(`API Server Running on ${PORT}`);
})