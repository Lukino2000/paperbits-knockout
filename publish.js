const publishing = require("./dist/server/src.node/startup.js");
const publishPromise = publishing.publish();

publishPromise.then((result) => {
    console.log("DONE");
    process.exit();
});

publishPromise.catch((error) => {
    console.log(error);
    process.exit();
});