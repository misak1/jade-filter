// task for documentation
var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var watch = require('gulp-watch');
var filters = jade.filters;
filters.html = function (block) {
    return "\n"+block+"\n"
    // .replace(/</g,'&lt;')
    // .replace(/>/g,'&gt;')
    ;
};

gulp.task('jade', function () {
    gulp.src('./modules_src/*.jade')
        .pipe(gulpJade({
            jade:jade,
            pretty: true
        }))
        .pipe(gulp.dest('./modules/'))
});

gulp.task('watch', function() {
//   return watch(paths.cssW, function(e) {
  return watch('./modules_src/', function(e) {
    // watch_hook(e.path);
    return gulp.start(["jade"]);
  });
});

// Default task
gulp.task('default', ['watch'], function () { });




