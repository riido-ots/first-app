var Profile = require("./profile.js");
var renderer = require("./renderer");
const querystring = require("querystring");

const commonHeaders = { 'Content-Type': 'text/html' };

//Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
    //if url == "/" && GET
    if (request.url === "/") {
        if (request.method.toLowerCase() === "get") {
            //show search
            response.writeHead(200, commonHeaders);
            //response.write(request.method + "\n");
            //response.write(request.headers + "\n");
            //response.write(request.rawHeaders + "\n");
            //response.write(request.url + "\n");

            renderer.view("header", {}, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        }
        if (request.method.toLowerCase() === "post") {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            request.on('end', () => {
                const queryObject = querystring.parse(body);
                console.log(queryObject.username);
                let user = queryObject.username;
                
                response.writeHead(301, {"Location": `/${user}`});
                response.end('ok');
            });
        }
    }

    //if url == "/" && POST

    //redirect to /:username 
}

//Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
    //if url == "/..."
    const username = request.url.replace("/", "");
    if (username.length > 0) {
        response.writeHead(200, commonHeaders);
        renderer.view("header", {}, response);

        //get json from Treehouse     
        const studentProfile = new Profile(username);
        //on "end"
        studentProfile.on("end", function (profileJSON) {
            //show profile

            //Store the values which we need
            const values = {
                avatarUrl: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }
            //Simple response
            renderer.view("profile", values, response);
            renderer.view("footer", {}, response);
            response.end();
        });

        //on "error"
        studentProfile.on("error", function (error) {
            //show error
            console.error("error");
            renderer.view("error", { errorMessage: error.message }, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        });
    }
}

module.exports.home = home;
module.exports.user = user;

