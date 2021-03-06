var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    sass = require("gulp-sass"),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('gulp-merge-json'),
    textTransformation = require('gulp-text-simple')
    templateCache = require('gulp-angular-templatecache')
    argv = require('yargs').argv,
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    sassLint = require('gulp-sass-lint'),
    exec = require('child_process').exec,
    sequence = require('gulp-sequence'),
    env = argv.env || 'production';

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

gulp.task('angular:i18n:locales', function() {
    return gulp.src('src/i18n/*.json')
        .pipe(merge('i18n.locales.json')).pipe(gulp.dest('dist/js/'));
});

gulp.task('angular:i18n', ['angular:i18n:locales'], function() {
    return gulp.src('dist/js/i18n.locales.json')
        .pipe(textTransformation(function(text) {
            return "angular.module('Youzz.i18n', []).constant('Locales', :locales:);".replace(/:locales:/,text);
        })())
        .pipe(concat('dist/js/i18n.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('angular:templates', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe(templateCache({module:'Youzz.Widgets.Templates', standalone:true}))
    .pipe(gulp.dest('dist/js/'));
});


gulp.task('min:js:widgets', function() {
    var src = [
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-bootstrap/dist/ui-bootstrap-custom-2.2.0.js',
		'bower_components/angular-translate/angular-translate.js',
        'bower_components/angular-lazy-img/release/angular-lazy-img.js',
        'dist/js/templates.js',
		'dist/js/i18n.js',
        'src/js/environments/' + env + '.js',
		'src/js/angular/api.js',
		'src/js/angular/reviews.js',
		'src/js/angular/widgets.js',
        'src/js/widgets.js'
    ];

    return gulp.src(src)
        .pipe(concat('dist/js/widgets.js'))
		.pipe(gulp.dest('.'))
        .pipe(uglify())
        .pipe(concat('dist/js/widgets.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('min:js:widgets-inline', function() {
    return gulp.src(['src/js/environments/' + env + '.js', 'src/js/widgets.inline.js'])
        .pipe(concat('dist/js/widgets.inline.js'))
        .pipe(gulp.dest('.'))
        .pipe(uglify())
        .pipe(concat('dist/js/widgets.inline.min.js'))
        .pipe(gulp.dest('.'));
});

// TODO - Remove the version information from the generated js files
gulp.task('angular:bootstrap', function(cb) {
    exec('cd bower_components/angular-bootstrap && npm install && grunt version:: build:pagination:rating', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("min:js", sequence('angular:templates', 'angular:i18n', 'angular:bootstrap', 'min:js:widgets', 'min:js:widgets-inline'));

gulp.task('fonts:font-awesome', function () {
    return gulp.src(['bower_components/font-awesome/fonts/*'])
            .pipe(gulp.dest('dist/fonts'));
});

gulp.task('fonts:bootstrap', function () {
    return gulp.src(['bower_components/bootstrap-sass/assets/fonts/bootstrap/*'])
            .pipe(gulp.dest('dist/fonts/bootstrap'));
});

gulp.task('lint:js', function() {
    return gulp.src(["src/**/*.js"])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('lint:scss', function() {
    return gulp.src(["src/**/*.scss"])
      .pipe(sassLint({
          options: {
              formatter: 'unix'
          },
          rules: {
              'indentation': [1, { size: 4 }],
              'property-sort-order': [0, { order: 'concentric' }]
          }
      }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('lint', ['lint:js', 'lint:scss']);

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

gulp.task('default', ['build', 'watch']);
