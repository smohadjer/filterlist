const gulp = require('gulp'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	rename = require("gulp-rename"),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del');

	var rollup = require('rollup-stream');
	var source = require('vinyl-source-stream');

gulp.task('clean:dist', function () {
	return del([
		'./dist/**/*'
	]);
});

gulp.task('babel', () =>
	gulp.src('dist/filterList.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
				presets: ['env']
			}))
		.pipe(sourcemaps.write('.'))
		.pipe(rename({ suffix: '.es5' }))
		.pipe(gulp.dest('dist'))
);

gulp.task('rollup', function() {
	return rollup({
		entry: 'src/filterList.js',
		format: 'iife',
		name: 'FilterList'
	})
	.pipe(source('filterList.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('compress', () => {
	gulp.src('dist/*.es5.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
});

gulp.task('watches6', () => {
	watch('src/*.js', batch(function (events, done) {
		gulp.start('rollup', done);
	}));
});

gulp.task('serve', function(callback) {
	runSequence(
		['rollup'],
		['watches6'],
		callback);
});

gulp.task('build', function(callback) {
	runSequence(
		['clean:dist'],
		['rollup'],
		['babel'],
		['compress'],
		callback);
});
