var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    sass = require("gulp-sass"),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('scss', function () {
    return gulp.src('src/scss/reviews.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest("dist/css"));
});

gulp.task("min:css", ['scss'], function () {
    return gulp.src(['dist/css/reviews.css'])
		.pipe(concat('dist/css/reviews.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min:js", function () {
    return gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'src/js/reviews.js'
		])
        .pipe(concat('dist/js/reviews.js'))
    // .pipe(uglify())
		.pipe(gulp.dest('.'));
});

gulp.task('fonts', function () {
    return gulp.src(['bower_components/font-awesome/fonts/*'])
            .pipe(gulp.dest('dist/fonts/font-awesome'));
});

gulp.task('build', ['min:css', 'min:js', 'fonts']);

gulp.task('watch', function () {
    gulp.watch(
            "src/scss/**/*.scss",
            ['min:css']
    );
    gulp.watch(
            "src/js/**/*.js",
            ['min:js']
    );
});
