const {src,dest,watch,series} = require('gulp');

const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');

const sync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const cssnano = require('gulp-cssnano');
const validator = require('gulp-w3c-html-validator');
const removeComments = require('gulp-strip-css-comments'); 
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const rigger = require('gulp-rigger');
const babel = require('gulp-babel'); 
const uglify = require('gulp-uglify');


const translateHtml = () => {
    return src('src/html/*.html')
    .pipe(validator())
    .pipe(rigger())
    .pipe(dest('app/'))
    .pipe(sync.stream());
}


const buildHtml = () => {
    return src('src/html/*.html')
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('public'))
}


// Конвертирует scss в css

const translateScss = () => {
    return src('src/scss/*.scss')
    .pipe(scss({
        outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: 'last 8 versions'
    }))
    .pipe(dest('app/css'))
    .pipe(sync.stream());
}


const buildCss = () => {
    return src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss({
        outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: 'last 8 versions'
    }))
    .pipe(removeComments({
        preserve: false,
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/css'))
}

// Генерирует svg спрайт

const sprite = () => {

    return src('src/img/spriteSVG/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            },
        }
    }))
    .pipe(dest('app/img/spriteSVG'))
}
const buildSprite = () => {

    return src('src/img/spriteSVG/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            },
        }
    }))
    .pipe(dest('public/img/spriteSVG'))
}
// минификаия картинок

const imagesCompress = () => {

    return src(['src/img/**/*.*' ,'!src/img/spriteSVG'])
    .pipe(cache(imagemin()))
    .pipe(dest('app/img'))
}

const buldimages= () => {

    return src(['src/img/**/*.*' ,'!src/img/spriteSVG'])
    .pipe(cache(imagemin()))
    .pipe(dest('public/img'))
}

// Работа с шрифтами

const  delFolder = async () => {
    del.sync('app/fonts')
}

const fonts = async () => {

    del.sync('app/fonts');

    const srcFonts = 'src/fonts/';
    const generateScssFonts = 'src/scss/global/_fonts.scss';

    // форматирование в woff
    src('src/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(dest('app/fonts'));

    // форматирование в woff2
    src('src/fonts/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));

    // просто копирует
    
    src('src/fonts/**/*.woff2')
    .pipe(dest('app/fonts'));
    // просто копирует

    src('src/fonts/**/*.woff')
    .pipe(dest('app/fonts'));

    // добавление шрифтов в fonts.scss

    const checkWeight = {
        black: 900,
        extrabold: 800,
        bold: 700,
        semibold: 600,
        medium: 500,
        regular: 400,
        light: 300,
        thin: 100
    }

    fs.writeFile(generateScssFonts, "",()=>{});

    fs.readdir(srcFonts,(err,items) =>{
        items.forEach((item)=>{
            const font_url = item.split('.')[0];
            const font_name = item.split('-')[0];
            let font_weight  = item.split('-')[1].split('.')[0].toLowerCase();
            let font_style  = item.split('-')[1].split('.')[0].toLowerCase();
            if (font_weight.includes('italic')) {
                font_weight = font_weight.split('italic')[0];
            }
            if (font_weight === '') {
                font_weight = 'regular';
            }
            if (font_style.includes('italic')) {
                font_style = 'italic';
            }
            else {
                font_style = 'normal';
            }
            fs.appendFileSync(generateScssFonts, `@include font("${font_url}","${font_name}", ${checkWeight[font_weight]}, "${font_style}"); \n`);
        });
    });
}

// Перемещение и работа js файлов



const translateJs = () => {
return src('./src/js/main.js')

.pipe(rigger())
.pipe(babel({
    presets: ["@babel/preset-env"]
  }))
.pipe(dest('app/js'))
.pipe(sync.stream());

}
const buildJs = () => {
    return src('./src/js/main.js')
    .pipe(rigger())
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(dest('public/js'))
    }





// Сервер и Отслеживание в изменениях файлов

const watcher = () => {
    sync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch('src/scss/**/*.scss',translateScss);
    watch('src/html/**/*.html',translateHtml);
    watch('src/img/default/**/*.*',imagesCompress);
    watch('src/js/*.js',translateJs);

}

const cleanPublic = () => {

    return del('public/**');

}



exports.sprite = sprite;
exports.fonts = fonts;
exports.translateScss = translateScss;
exports.translateJs = translateJs;
exports.delFolder = delFolder;
exports.imagesCompress = imagesCompress;



exports.build =  series( cleanPublic,buildHtml,buildCss,buildJs,buldimages,buildSprite);


exports.default = series(imagesCompress,translateHtml,translateScss,translateJs,watcher);