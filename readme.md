### SocialMedia Backend

    Devloping the API's for Social Media App

### Steps to Develop the Backend

#### 1.Mongodb Connection

     - You used dotenv.config() to load environment variables, including your MongoDB URI from a .env file.

     - mongoose.connect(process.env.MONGO_URI) connects your Node.js app to MongoDB using the URI from .env.

     - mongoose.connection is used to monitor the connection; db.on("error") logs if there's an error, and db.once("open") confirms a successful connection.

#### 2. SignUp

##### a.creating user model:

        - Defines a Mongoose schema for User with name, email, and password as required fields; email must be unique.

        - Uses a pre-save hook to hash the password before saving to the database.

        - In the hook, bcrypt generates a salt (genSalt) and hashes the password, replacing the plain text password with the hashed one.

        - Exports the User model created from the schema for use in other parts of the application.

##### b.creating user router

        - Defines the /signup route: When a POST request hits /signup, it calls the signup function from user.controller.js.

        - Exports an Express router: This file is a modular route handler and must be connected in your main index.js or app.js using app.use("/user", userRouter).

##### c.creating user controller

        - Extracts user data (name, email, password) from the request body.

        - Inserts a new user into the database using User.insertOne(...).

        - Generates a JWT token with user info (email, name, id) and signs it using the secret key.

        - Sends response with the new user and token, along with a success message.

#### 3. Login

        -  Finds user by email using User.findOne({ email }).

        - Checks password match with bcrypt.compare() to validate login.

        - Generates JWT token with user's email, name, and _id if the credentials are valid.

        - Sends back user info and token if login is successful, otherwise sends an error message
