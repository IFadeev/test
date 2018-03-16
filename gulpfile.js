//подключение модулей
var gulp 		= require('gulp'),
	del			= require('del'),
	sass 		= require('gulp-sass'),
	cache		= require('gulp-cache'),
	concat 		= require('gulp-concat'),
	rigger 		= require('gulp-rigger'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	cssnano 	= require('gulp-cssnano'),
	browserSync = require('browser-sync'),
	imagemin	= require('gulp-imagemin'),
	autopref	= require('gulp-autoprefixer'),
	pngquant	= require('imagemin-pngquant');

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
	.pipe(autopref(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
//	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path.build.css))
	.pipe(browserSync.reload({stream: true}));
});

//
gulp.task('scripts', function() {
	return gulp.src(path.src.js)
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path.build.js))
	.pipe(browserSync.reload({stream: true}));
});

//обработка изображений
gulp.task('img', function() {
	return gulp.src(path.src.img)
	.pipe(cache((imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))))
	.pipe(gulp.dest(path.build.img))
	.pipe(browserSync.reload({stream: true}));
});

//
gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

//gulp del dist
gulp.task('clean', function() {
	return del.sync('dist');
});

//
gulp.task('cache-cleaner', function() {
	return cache.clearAll();
});

gulp.task('build', ['clean', 'html-rigger', 'sass', 'scripts', 'img', 'fonts']);

//таск для автоматического обновления страницы при изменении файлов
gulp.task('browser-sync', function() {
	browserSync(config);
});

//таск мониторинга изменений 
gulp.task('watch', ['build', 'browser-sync'], function() {
	gulp.watch(path.src.sass, ['sass']);
	gulp.watch(path.src.html, browserSync.reload);
	gulp.watch(path.src.js, browserSync.reload);
	gulp.watch(path.src.img, browserSync.reload);
});