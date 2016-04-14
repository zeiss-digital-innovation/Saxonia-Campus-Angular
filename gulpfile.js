// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const del = require('del');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const war = require('gulp-war');
const zip = require('gulp-zip');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// copy assets
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src([
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/router.dev.js',
        'node_modules/angular2/bundles/http.dev.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/tether/dist/js/tether.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/tether/dist/css/tether.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'styles/*.css',
        'images/**/*',
        'app/**/*.html',
        'index.html'
    ], {"base": "."})
    .pipe(gulp.dest('dist'))
});

// compile typescript
gulp.task('compile', ['clean'], function() {
    var project = ts.createProject('tsconfig.json');
    return project.src()
        .pipe(ts(project))
        .pipe(gulp.dest("dist/scripts"));
});

// replace base in index to target war name
gulp.task('replace-index', ['compile', 'copy:assets'], function() {
    return gulp.src('dist/index.html')
        .pipe(replace(
            '<base href="/">',
            '<base href="/campus/">')
        )
        .pipe(gulp.dest("dist"));
});

// replace rest url if necessary
gulp.task('replace-rest-url', ['compile', 'copy:assets'], function() {
    return gulp.src('dist/scripts/services/rest.service.js', {"base": "dist"})
        .pipe(replace(
            'http://localhost:8080/rest',
            'http://localhost:8080/rest')
        )
        .pipe(gulp.dest("dist"));
});

// build war
gulp.task('war', ['compile', 'copy:assets', 'replace-index', 'replace-rest-url'], function () {
    gulp.src(['dist/**/*'])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'Campus Angular2 WAR'
        }))
        .pipe(zip('campus.war'))
        .pipe(gulp.dest("dist"));
});