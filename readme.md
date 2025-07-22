### SocialMedia Backend

    Devloping the API's for Social Media App

### Steps to Develop the Backend

#### 1.Mongodb Connection

     - You used dotenv.config() to load environment variables, including your MongoDB URI from a .env file.

     - mongoose.connect(process.env.MONGO_URI) connects your Node.js app to MongoDB using the URI from .env.

     - mongoose.connection is used to monitor the connection; db.on("error") logs if there's an error, and db.once("open") confirms a successful connection.
