var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    sass = require("gulp-sass"),
    sourcemaps = require('gulp-sourcemaps'),
    templateCache = require('gulp-angular-templatecache')
;

gulp.task('scss', function () {
    return gulp.src('src/scss/widgets.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest("dist/css"));
});

gulp.task("min:css", ['scss'], function () {
    return gulp.src(['dist/css/widgets.css'])
		.pipe(concat('dist/css/widgets.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task('angular:templates', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe(templateCache({module:'Youzz.Widgets.Templates', standalone:true}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task("min:js", ['angular:templates'], function () {
    return gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'dist/js/templates.js',
		'src/js/api.js',
		'src/js/reviews.js',
		'src/js/widgets.js'
		])
        .pipe(concat('dist/js/widgets.js'))
    // .pipe(uglify())
		.pipe(gulp.dest('.'));
});

gulp.task('fonts:font-awesome', function () {
    return gulp.src(['bower_components/font-awesome/fonts/*'])
            .pipe(gulp.dest('dist/fonts'));
});

gulp.task('fonts:bootstrap', function () {
    return gulp.src(['bower_components/bootstrap-sass/assets/fonts/bootstrap/*'])
            .pipe(gulp.dest('dist/fonts/bootstrap'));
});

gulp.task('build', ['min:css', 'min:js', 'fonts:font-awesome', 'fonts:bootstrap']);

gulp.task('watch', function () {
    gulp.watch(
            "src/scss/**/*.scss",
            ['min:css']
    );
    gulp.watch(
            ["src/js/**/*.js", "src/templates/**/*.html"],
            ['min:js']
    );
});
