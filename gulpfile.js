//подключение модулей
var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	concat 		= require('gulp-concat'),
	rigger 		= require('gulp-rigger'),
	rename 		= require('gulp-rename'),
	cssnano 	= require('gulp-cssnano'),
	browserSync = require('browser-sync');

//конфигурация для browserSync
var config = {
	server: {
		baseDir: 'dist'
	}
}
//путь файлов
var path = {
    src: {		
        html: 'app/*.html',
        sass: 'app/sass/main.scss',
        js: 'app/**/*.js',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
   },
    build: {
        html: 'dist/',
        css: 'dist/css/',
        js: 'dist/js/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    }};


//таск сб
gulp.task('html-rigger', function () {
	return gulp.src(path.src.html)
	.pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.reload({stream: true}));
});

//таск преобразования препроцессора sass и минимизация файла
gulp.task('sass', function() {
	return gulp.src(path.src.sass)
	.pipe(sass())
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path.build.css))
	.pipe(browserSync.reload({stream: true}));
});

//таск для автоматического обновления страницы при изменении файлов
gulp.task('browser-sync', function() {
	browserSync(config);
});

//таск мониторинга изменений 
gulp.task('watch', ['html-rigger', 'browser-sync', 'sass'], function() {
	gulp.watch(path.src.sass, ['sass']);
	gulp.watch(path.src.html, browserSync.reload);
	gulp.watch(path.src.js, browserSync.reload);
});
