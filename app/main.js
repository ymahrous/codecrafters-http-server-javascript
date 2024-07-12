const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const request = data.toString();
        const [method, path] = request.split(" ");
        const url = request.split(' ')[1];
        if(url == "/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else if(url.includes("/echo/")){
            const content = url.split('/echo/')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
        }else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        // if (method === "GET" && path === "/") {
        //     socket.write("HTTP/1.1 200 OK\r\n\r\n");
        // } else {
        //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        // }
    })
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
server.listen(4221, "localhost", () => {
    process.stdout.write("Listening on localhost:4221");
});