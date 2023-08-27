import Fontmin from 'fontmin';
import fs from 'fs';

let files, content = [];
let walk = function (dir, exclude) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file))
        } else {
            if (/.(vue|html|js)$/.test(file)) {
                results.push(file)
            }
        }
    });
    return results
};

((dir) => {
    files = walk(dir);
    files.forEach(file => {
        let text = fs.readFileSync(file);
        text.toString().split('').forEach(letter => {
            if (/[a-zA-Z0-9\u4e00-\u9fa5&\.:!;]/.test(letter) && content.indexOf(letter) == -1) {
                content.push(letter);
            }
        })
    })
    console.log(content.join(""))
    const fontmin = new Fontmin()
        .src('fonts/*.ttf')
        .use(Fontmin.glyph({
            text: content.join(""),
            hinting: false
        }))
        .use(Fontmin.ttf2eot())
        .use(Fontmin.ttf2svg())
        .use(Fontmin.ttf2woff({
            deflate: true
        }))
        .use(Fontmin.ttf2woff2())
        .use(Fontmin.css({
            fontFamily: "mysimsun",
            // base64: true
        }))
        .dest('src/assets/fonts');

    fontmin.run(function (err, files) {
        if (err) {
            throw err;
        }

        console.log(files[0]);
    });
})("./src");//src就是你的项目目录地址，视情况而定
