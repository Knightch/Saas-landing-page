// const gulp = require('gulp');
// const renderNun = require('gulp-nunjucks-render');
// const sass = require('gulp-sass')(require('sass'));
// const imagemin = require('gulp-imagemin');
// const del = require("del");
// const beautify = require('gulp-beautify-code');
// const plumber = require('gulp-plumber');
// const nunjucks = require('gulp-nunjucks');
// const notify = require('gulp-notify');





// function clean() {
//     return del(['.tmp', 'dist/*', '!dist/.git']);
// }

// function customPlumber([errTitle]) {
//     return plumber({
//         errorHandler: notify.onError({
//             title: errTitle || "Error running Gulp",
//             message: "Error: <%= error.message %>",
//             sound: "Glass"
//         })
//     });
// }


// // render scss to css
// function renderStyleSheet() {
//     return gulp.src('app/assets/scss/style.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('dist/assets/style'))
// }

// // render nunjucks to html
// function renderHtmlTemplate() {
//     return gulp.src('app/*.njk')
//         .pipe(renderNun({
//             path: ['/app/partials/']
//         }))
//         .pipe(beautify({
//             indent_size: 2,
//             indent_char: ' ',
//             max_preserve_newlines: 0,
//             unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
//         }))
//         .pipe(customPlumber('Error Running Nunjucks'))
//         .pipe(gulp.dest('dist/'));

// }

// // render images
// function importImages() {
//     return gulp.src('app/assets/images/**/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/assets/images'));
// }

// // imports js files
// function importJsFiles() {
//     return gulp.src('app/assets/js/**/*.js')
//         .pipe(gulp.dest('dist/assets/js'));
// }

// const build = gulp.parallel(renderHtmlTemplate, renderStyleSheet, importImages, importJsFiles);

// exports.default = build;
// exports.renderHtmlTemplate = renderHtmlTemplate;
// exports.renderStyleSheet = renderStyleSheet;
// exports.importImages = importImages;
// exports.importJsFiles = importJsFiles;
// exports.clean = clean;

var gulp = require('gulp'),
    del = require('del'),
    nunjucks = require('gulp-nunjucks'),
    rendeNun = require('gulp-nunjucks-render'),
    beautify = require('gulp-beautify'),
    sass = require("gulp-sass")(require('sass')),
    chanaged = require('gulp-changed'),
    browserSyn = require("browser-sync").create(),
    reload = browserSyn.reload,
    argv = require('minimist')(process.argv.slice(2));

const destination = (argv.clean) ? 'dist/demo/' : (argv.pub) ? 'dist/publish/' : 'dist/';
// const port = (argv.demo) ? 4002 : (argv.pub) ? 4003 : 4001;



function convertNunjucksToHtml() {
    return gulp.src('./app/*.njk')
        .pipe(rendeNun('./app/partials/'))
        .pipe(beautify.html({
            indent_size: 2,
            indent_char: ' ',
            max_preserve_newline: 0,
            unformated: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
        }))
        .pipe(gulp.dest('./dist'))
}

function convertScssToCss() {
    return gulp.src('./app/assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/assets/style/'))
}

function javascriptConvert() {
    return gulp.src('./app/assets/js/**/*.js')
        .pipe(chanaged('./dist/assets/js/*.*'))
        .pipe(gulp.dest('./dist/assets/js'))
}

function imgConvert() {
    return gulp.src('./app/assets/images/**/*.*')
        .pipe(chanaged('./dist/assets/images/*.*'))
        .pipe(gulp.dest('./dist/assets/images'))
}

function clean() {
    return del([destination]);
}

function browserReload(done) {
    browserSyn.init({
        server: {
            baseDir: destination + '/'
        },
        port: port
    });
    done();
}

function watchFiles() {
    gulp.watch('/app/*.(html|njk)', convertNunjucksToHtml);
    gulp.watch('/app/partials/', convertNunjucksToHtml);
    gulp.watch('/app/assets/scss/**/*.scss', convertScssToCss);
    gulp.watch('./', gulp.series(clean, build));
}

const build = gulp.series(clean, gulp.parallel(convertNunjucksToHtml, convertScssToCss, javascriptConvert, imgConvert))
// const buildwatch = gulp.series(build, browserReload, gulp.parallel(watchFiles));

exports.html = convertNunjucksToHtml;
exports.scss = convertScssToCss;
exports.js = javascriptConvert;
exports.img = imgConvert
exports.clean = clean;
exports.reload = browserReload;
exports.default = build;