const gulp = require('gulp'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	rename = require("gulp-rename"),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del');

gulp.task('clean:dist', function () {
	return del([
		'./dist/**/*'
	]);
});

gulp.task('babel', () =>
	gulp.src('src/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
				presets: ['env']
			}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
);

gulp.task('compress', () => {
	gulp.src('dist/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
});

gulp.task('watches6', () => {
	watch('src/*.js', batch(function (events, done) {
		gulp.start('babel', done);
	}));
});

gulp.task('serve', function(callback) {
	runSequence(
		['babel'],
		['watches6'],
		callback);
});

gulp.task('build', function(callback) {
	runSequence(
		['clean:dist'],
		['babel'],
		['compress'],
		callback);
});
