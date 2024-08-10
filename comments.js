// Create web server

const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const comments = [];

const server = http.createServer((req, res) => {
    const parseUrl = url.parse(req.url);
    const parseQuery = querystring.parse(parseUrl.query);
    const pathName = parseUrl.pathname;

    if (pathName === '/comment') {
        const name = parseQuery.name;
        const comment = parseQuery.comment;
        const date = new Date();
        const commentObj = {
            name,
            comment,
            date
        };
        comments.push(commentObj);

        fs.writeFile('./data/comments.json', JSON.stringify(comments), 'utf-8', (err) => {
            if (err) {
                res.statusCode = 500;
                res.end('Server Error: ' + err);
            }
        });

        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    } else if (pathName === '/') {
        fs.readFile('./views/index.html', 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Server Error: ' + err);
            }

            let commentList = '';
            for (let i = 0; i < comments.length; i++) {
                commentList += `<li>${comments[i].name} - ${comments[i].comment} - ${comments[i].date}</li>`;
            }

            data = data.replace('<!-- comment list -->', commentList);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});