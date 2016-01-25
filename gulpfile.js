//----------------------------------------------------------------------
// Plugins
//----------------------------------------------------------------------
var gulp 		= require("gulp"),
	sass 		= require("gulp-sass"),
	concat 		= require("gulp-concat"),
	watch 		= require("gulp-watch"),
	plumber 	= require("gulp-plumber"),
	minify_css 	= require("gulp-minify-css"),
	uglify 		= require("gulp-uglify"),
	sourcemaps 	= require("gulp-sourcemaps"),
	notify 		= require("gulp-notify");
	prefix		= require("gulp-autoprefixer"),
	imagemin 	= require("gulp-imagemin"),
	jshint 		= require("gulp-jshint"),
	pngquant 	= require("imagemin-pngquant"),
	browserSync	= require("browser-sync");

//----------------------------------------------------------------------
// Settings
//----------------------------------------------------------------------
var src = {
	sass: "src/sass/**/*.scss",
	js: "src/js/**/*.js",
	img: "src/img/*"
};

var output = {
	css: "output/css",
	js: "output/js",
	img: "output/img/",
	html: "output/index.html",
	min_css: "app.min.css",
	min_js: "app.min.js"
}

//----------------------------------------------------------------------
// Error Handler
//----------------------------------------------------------------------
var onError = function(err) {
	console.log(err);
	this.imit('end');
};


//----------------------------------------------------------------------
//SASS to CSS

gulp.task('sass', function() {
	return gulp.src(src.sass)
		.pipe(plumber({
			errorHangler: onError,
		}))
		.pipe(sass())
		.pipe(prefix('last 2 versions'))
		.pipe(concat(output.min_css))
		.pipe(gulp.dest(output.css))
		.pipe(minify_css())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.css))
		.pipe(browserSync.reload({stram: true}));
		// .pipe(notify({message: "Hello world we are done"}));
});


//----------------------------------------------------------------------
//Compile JS

gulp.task('js', function() {
	return  gulp.src(src.js)
		.pipe(plumber({
			errorHangler: onError,
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(output.min_js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js))
		.pipe(browserSync.reload({stram: true}));
});


//----------------------------------------------------------------------
//Images

gulp.task('img', function() {
	return gulp.src(src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(output.js));
});


//----------------------------------------------------------------------
//Watch

gulp.task('watch', function() {
	browserSync.init({
		// proxy: 'dommlotto.dev'
		server: './output'
	});
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.js, ['js']);
	gulp.watch(src.img, ['img']);
	gulp.watch(output.html).on('change', browserSync.reload);
});

//----------------------------------------------------------------------
//Default


gulp.task('default', ['watch', 'sass', 'js', 'img']);