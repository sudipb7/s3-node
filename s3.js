const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config({ path: ".env" });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});

async function getObject(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 120 });
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Error in getting file");
  }
}

async function putObject(key, body, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.log(error);
    throw new Error("Error in uploading file");
  }
}

module.exports = { getObject, putObject };
