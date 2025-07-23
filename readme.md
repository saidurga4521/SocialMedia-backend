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

#### 4.isAuthorised middleware

        - The authMiddleware is mainly used to check whether the user is authorized before allowing access to any protected page or API. If the user has a valid token (JWT), they are allowed; otherwise, access is denied
        - Checks for token in the request header (Authorization) to verify if the user is logged in.

        - Extracts and verifies the JWT token using your secret key to get the user's info.

        - Attaches user info (id, email) to req.user for use in the next middleware or route.

        - Blocks access if token is missing, invalid, or the user doesn't exist in the database.

#### 5.creating the post model

        - Post Schema stores user posts, including text (caption), image, and optional gallery images.

        - user field links the post to the creator using ObjectId referencing the User model.

        - text is required, so each post must have a caption.

        - likes is an array of users (ObjectId) who liked the post, and likesCount tracks the total number of likes.
        - ImageId is used for whenever you want delete the image,it should remove from both database and external storage for that reason we need this ImageId

#### 6.multer setup

        -  Stores files in /uploads folder using diskStorage configuration.

        - Renames files using the current timestamp plus original file name to avoid name clashes.

        - Only allows image files, checked using the mimetype.

        - Limits file size to 2MB, ensuring no large files are uploaded.

        -❌ "/uploads" refers to the root of your computer, which can cause errors because it likely doesn’t exist or isn’t accessible.

        - ✅ path.join(__dirname, "/uploads") ensures files are saved inside your project folder, making it reliable and safe for all environments.

#### 7.Automatic folder setup

        - It checks if the uploads folder exists in the current directory using fs.existsSync.

        - If the folder doesn't exist, it creates it automatically using fs.mkdirSync with recursive: true to ensure parent folders are created if needed.

#### 8.Add multiple images to disk storage

        - Similar to uploading the single image.
        - But here we use upload.array(images)

#### 9.Cloudinary Configuration

        - It configures Cloudinary using environment variables (.env) for security, so your API credentials aren't hardcoded.

        - It exports the configured cloudinary instance, so you can use it anywhere in your app to upload or manage images.

#### 10.Upload Image file to cloudinary

        -  It uploads the file to Cloudinary using the file path provided by multer.

        - After uploading, it extracts the image URL and public ID from Cloudinary's response.

        - It sends back a JSON response with image and imageId so you can use them later (e.g., for displaying or deleting the image).

#### 11.Uplaoding Multiple Images to cloudinary

        -  req.files contains all the uploaded images received through multer.array().

        - Each image file is uploaded to Cloudinary using cloudinary.uploader.upload(file.path).

        - Promise.all() runs all uploads in parallel and waits until all of them finish.

        - The response sends back an array of image URLs and imageIds for each uploaded file.

#### 12. create utils/sendResponse

        - It takes res, success, message, data, and an optional statusCode (default is 200).

        - res.status(statusCode).send(...) sets the response status and sends the JSON data.

        -  Helps avoid repeating response structure in every controller — makes your code cleaner.

#### 13. create Post

        - Extracts post data (text, image, imageId) from req.body and user id from req.user.

        - Creates a new Post object using the extracted data and links it to the logged-in user.

        - Saves the new post to the database using await newPost.save().

        - Sends a response with a success message and the saved post, or sends an error message if something fails.

#### 14.edit the post

        - ✅ Find the Post: It uses the id from the URL (req.params.id) to find the post in the database.

        - Authorization Check: It checks whether the logged-in user is the owner of the post before allowing edits.

        - Edit Fields: If text, image, or imageId are sent in the request, it updates only those fields.

        - Validation: If no text is provided or if the post doesn't exist, it sends an appropriate error message.

        - Save and Respond: After editing, it saves the post and sends a success response with the updated data.

#### 15.delete the post by Id

        - 🔍 Find Post by ID: It finds the post using the id from the URL (req.params.id).

        - Handle Not Found: If the post doesn’t exist, it returns a “Post not found” response.

        - User Authorization: Checks if the logged-in user is the owner of the post before deleting.

        - Delete Image from Cloudinary: Uses the imageId to remove the image from Cloudinary storage.

        - Delete from DB and Respond: Deletes the post from the database and sends a success message.
