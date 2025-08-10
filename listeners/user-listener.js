const userEmitter = require("../events/user-emitter");
//listen the event
userEmitter.on("user:login", (user) => {
  console.log("user login successfully", user);
});
