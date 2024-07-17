const fs = require("fs");
const net = require("net");
console.log("Logs from the program will appear here..");

// const args = {};
// process.argv.forEach((arg, index) => {
//   if (arg.startsWith("--")) {
//     args[arg.replace(/^--/, "")] = process.argv[index + 1];
//   }
// });
// 1;
// const FILES_DIR = args["directory"];
//          else if(url.includes("/files/")){
//             const fileName = url.split('/files/')[1];
//             fs.readFile(`/tmp/data/codecrafters.io/http-server-tester/${fileName}`, (err, data) => {
//                 if(err) {
//                     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//                 }
//                 socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`);
//             });
//          } else if(url.includes("/files/") && data.toString().split(" ")[0] === "POST") {
//             let fileName = url.split('/')[2];
//             console.log(`filename:${fileName}`);
//             const filePath = FILES_DIR + fileName;
//             const file = fileName.toString("utf-8").split("\r\n\r\n")[1];

//             fs.writeFileSync(filePath, file);

//             socket.write("HTTP/1.1 201 CREATED\r\n\r\n");
//          } 

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        // const headers = request.split('\r\n');
        const request = data.toString().split("\r\n");
        const url = data.toString().split(' ')[1];
        const [method, path, protocol] = request[0].split(" ");
        const headers = {};
        request.slice(1).forEach((header) => {
            const [key, value] = header.split(" ");
            if (key && value) {
            headers[key] = value;
            }
        });
        ////////////////////////////////////////////

        if(url == "/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n");

        } else if(url.includes("/echo/")){
            const content = url.split('/echo/')[1];
            if(headers["Accept-Encoding"] == "gzip") {
                console.log(headers["Accept-Encoding"], "here");
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
            }
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);

        } else if(url == '/user-agent') {
            const userAgent = request[2].split('User-Agent: ')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);

        } else if (path.startsWith("/files/") && method === "GET") {
            const fileName = path.replace("/files/", "").trim();
            const filePath = process.argv[3] + fileName;
            const isExist = fs.readdirSync(process.argv[3]).some((file) => {
                return file === fileName;
            });
            if (isExist) {
            const content = fs.readFileSync(filePath);
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
            } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            }

        } else if (path.startsWith("/files/") && method === "POST") {
            const filename = process.argv[3] + "/" + path.substring(7);
            const req = data.toString().split("\r\n");
            const body = req[req.length - 1];
            fs.writeFileSync(filename, body);
            socket.write(`HTTP/1.1 201 Created\r\n\r\n`);

        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
    });

    socket.on("error", (e) => {
        console.error("Error: " + e);
        socket.end();
    });

    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost", () => {
    process.stdout.write("listening on 4221");
});