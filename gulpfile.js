// task for documentation
var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var filters = jade.filters;
filters.html = function (block) {
    return "\n"+block+"\n"
    // .replace(/</g,'&lt;')
    // .replace(/>/g,'&gt;')
    ;
};

gulp.task('jade', function () {
    gulp.src('./*.jade')
        .pipe(gulpJade({
            jade:jade,
            pretty: true
        }))
        .pipe(gulp.dest('./dist/'))
});

// Default task
gulp.task('default', ['jade'], function () { });


