const fs = require("fs");
const net = require("net");
console.log("Logs from the program will appear here..");

const args = {};
process.argv.forEach((arg, index) => {
  if (arg.startsWith("--")) {
    args[arg.replace(/^--/, "")] = process.argv[index + 1];
  }
});
1;
const FILES_DIR = args["directory"];

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const request = data.toString();
        const url = request.split(' ')[1];
        const headers = request.split('\r\n');
        const [method, path] = request.split(" ");
        ////////////////////////////////////////////

        if(url == "/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else if(url.includes("/echo/")){
            const content = url.split('/echo/')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
        } else if(url == '/user-agent') {
            const userAgent = headers[2].split('User-Agent: ')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
        }  else if(url.includes("/files/") && data.toString().split(" ")[0] === "GET"){
            const fileName = url.split('/files/')[1];
            fs.readFile(`/tmp/data/codecrafters.io/http-server-tester/${fileName}`, (err, data) => {
                if(err) {
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                }
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`);
            });
        } else if(url.includes("/files/") && data.toString().split(" ")[0] === "POST") {
            const fileName = url.split('/files/')[2];
            const filePath = FILES_DIR + fileName;
            const file = fileName.toString("utf-8").split("\r\n\r\n")[1];

            fs.writeFileSync(filePath, file);

            socket.write("HTTP/1.1 201 CREATED\r\n\r\n");
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