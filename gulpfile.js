const gulp = require('gulp');
const renderNun = require('gulp-nunjucks-render');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const del = require("del");
const beautify = require('gulp-beautify-code');
const plumber = require('gulp-plumber');
const nunjucks = require('gulp-nunjucks');
const notify = require('gulp-notify');





function clean() {
    return del(['.tmp', 'dist/*', '!dist/.git']);
}

function customPlumber([errTitle]) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
            sound: "Glass"
        })
    });
}


// render scss to css
function renderStyleSheet() {
    return gulp.src('app/assets/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/assets/style'))
}

// render nunjucks to html
function renderHtmlTemplate() {
    return gulp.src('app/*.njk')
        .pipe(renderNun({
            path: ['/app/partials/']
        }))
        .pipe(beautify({
            indent_size: 2,
            indent_char: ' ',
            max_preserve_newlines: 0,
            unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
        }))
        .pipe(customPlumber('Error Running Nunjucks'))
        .pipe(gulp.dest('dist/'));

}

// render images
function importImages() {
    return gulp.src('app/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'));
}

// imports js files
function importJsFiles() {
    return gulp.src('app/assets/js/**/*.js')
        .pipe(gulp.dest('dist/assets/js'));
}

const build = gulp.parallel(renderHtmlTemplate, renderStyleSheet, importImages, importJsFiles);

exports.default = build;
exports.renderHtmlTemplate = renderHtmlTemplate;
exports.renderStyleSheet = renderStyleSheet;
exports.importImages = importImages;
exports.importJsFiles = importJsFiles;
exports.clean = clean;