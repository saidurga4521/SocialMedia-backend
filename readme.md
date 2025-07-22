### SocialMedia Backend

    Devloping the API's for Social Media App

### Steps to Develop the Backend

#### 1.Mongodb Connection

     - You used dotenv.config() to load environment variables, including your MongoDB URI from a .env file.

     - mongoose.connect(process.env.MONGO_URI) connects your Node.js app to MongoDB using the URI from .env.

     - mongoose.connection is used to monitor the connection; db.on("error") logs if there's an error, and db.once("open") confirms a successful connection.

#### 2. Authentication

##### a.creating user model:

        - Defines a Mongoose schema for User with name, email, and password as required fields; email must be unique.

        - Uses a pre-save hook to hash the password before saving to the database.

        - In the hook, bcrypt generates a salt (genSalt) and hashes the password, replacing the plain text password with the hashed one.

        - Exports the User model created from the schema for use in other parts of the application.
