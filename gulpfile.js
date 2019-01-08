var gulp = require('gulp');
var connect = require('gulp-connect');
var clean =require('gulp-clean');
var runSequence=require('run-sequence');
var cleanCss=require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector');
var imgMin = require('gulp-imagemin');
//热启动端口
gulp.task('connect',function(){
	connect.server({
		root:['./dist'],
		port:'3500',
		livereload:true
	})
})


//复制html,css,js,img
gulp.task('copyHtml',function(){
	return gulp.src('./src/**/*.html').pipe(gulp.dest('./dist')).pipe(connect.reload())
})
gulp.task('copyCss',function(){
	return gulp.src('./src/**/*.css').pipe(cleanCss()).pipe(rev()).pipe(gulp.dest('./dist')).pipe(rev.manifest()).pipe(gulp.dest('./rev/css')).pipe(connect.reload())
})
gulp.task('copyJs',function(){
	return gulp.src('./src/**/*.js').pipe(uglify()).pipe(rev()).pipe(gulp.dest('./dist')).pipe(rev.manifest()).pipe(gulp.dest('./rev/js')).pipe(connect.reload())
})
gulp.task('copyImg',function(){
	return gulp.src('./src/img/**/*').pipe(imgMin()).pipe(rev()).pipe(gulp.dest('./dist/img')).pipe(rev.manifest()).pipe(gulp.dest('./rev/img')).pipe(connect.reload())
})

// 更改html中js，css，img中的路径名称
gulp.task('rev',function(){
	return gulp.src(['./rev/**/*.json','./src/**/*.html']).pipe(collector()).pipe(gulp.dest('./dist')).pipe(connect.reload())
})


gulp.task('copyAll',['copyHtml','copyCss','copyJs','copyImg'])



gulp.task('watching',function(){
	return gulp.watch('./src/**/*',function(){
		return runSequence('copyAll','rev')
	})
})
gulp.task('clean',function(){
	return gulp.src('./dist').pipe(clean())
})



gulp.task('default',function(){
	runSequence('clean','connect','copyAll','rev','watching')
})
