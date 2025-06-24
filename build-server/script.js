const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis =  require('ioredis');
// Enter Redis instance Url Here
const publisher = new Redis('')
 function publishLog(log){
    publisher.publish(`logs:${PROJECT_ID}`,JSON.stringify({log})) ;
 }
//  Correct S3 Client initialization
const s3Client = new S3Client({
    region: "ap-south-1", // "Region" should be lowercase
    credentials: { 
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

//  Environment variable setup
const PROJECT_ID = process.env.PROJECT_ID;
if (!PROJECT_ID) {
    console.error("PROJECT_ID is missing. Exiting...");
    process.exit(1);
}

// Initialize build process
async function init() {
    console.log("Executing script.js...");
publishLog("Build Started...")
    const outDirPath = path.join(__dirname, 'output');
    console.log(outDirPath);
    console.log("Running npm install and build...");
    const buildProcess = exec(`cd ${outDirPath} && npm install && npm run build`);

    buildProcess.stdout.on('data', (data) => {
        console.log(data.toString())
        publishLog(data.toString());
    });
    buildProcess.stderr.on('data', (data) => {
        
        console.error('Error:', data.toString())
        publishLog(`Error : ${data.toString()}`)
    });

    buildProcess.on("close", async (code) => {
        if (code !== 0) {
            console.error(`Build failed with exit code ${code}`);
            return;
        }

        console.log("Build complete. Preparing to upload...");

        try {
            const distFolderPath = path.join(outDirPath, 'dist');
            const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

            for (const filePath of distFolderContents) {
                const fullFilePath = path.join(distFolderPath, filePath);

                if (fs.lstatSync(fullFilePath).isDirectory()) continue;

                console.log("Uploading:", filePath);

                const command = new PutObjectCommand({
                    Bucket: "launchit",
                    Key: `__outputs/${PROJECT_ID}/${filePath}`,
                    Body: fs.createReadStream(fullFilePath),
                    ContentType: mime.lookup(fullFilePath) || "application/octet-stream"
                });

                await s3Client.send(command);
                console.log("Uploaded:", filePath);
            }

            console.log("All files uploaded successfully!");
            publishLog(`Build Process Completed...`);
        } catch (err) {
            console.error("Failed to upload files:", err);
        }
    });
}

init();
