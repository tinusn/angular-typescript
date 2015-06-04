/* globals require */

'use strict';

var args = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var expect = require('gulp-expect-file');
var filter = require('gulp-filter');
var fs = require('fs');
var gulp = require('gulp');
var inject = require('gulp-inject');
var injectString = require('gulp-inject-string');
var merge = require('merge2');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var ngHtml2js = require('gulp-ng-html2js');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var rimraf = require('rimraf');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var util = require('gulp-util');

// Define the name used in constants and templates
var moduleName = 'typescriptApp';
// The default environment
var defaultEnv = 'dev';

function swallowError(err) {
    this.emit('end');
}

function swallowAndLogError(err) {
    util.log(util.colors.red('Error'), err.message);
    this.emit('end');
}

var env = args.env;
if (!env) {
    util.log(util.colors.yellow('Environment not specified, using the default environment.'));
    util.log(util.colors.yellow('(change environment by adding "--env=ENVNAME" to the gulp task)'));
    env = defaultEnv;
}
util.log(util.colors.green('environment: ' + env));

var envConfig = require('./config/' + env + '.json');

/***********************
 Configuration
 ***********************/

gulp.task('config', function() {
    return ngConstant({
            name: moduleName,
            constants: envConfig.constants,
            stream: true,
            template: "/* tslint:disable */\n\n((): void => { angular.module('<%- moduleName %>')<% constants.forEach(function(constant) { %>.constant('<%- constant.name %>', <%= constant.value %>)<% }) %>; })();"
        })
        .pipe(rename('app.constants.ts'))
        .pipe(gulp.dest('app/core/'));
});

/***********************
 TypeScript
 ***********************/

var tsProject = ts.createProject({
    declarationFiles: false,
    module: 'commonjs',
    noExternalResolve: true,
    noImplicitAny: false,
    removeComments: false,
    sortOutput: true,
    target: 'ES5',
    emitDecoratorMetadata: true,
    typescript: require('typescript')
});

gulp.task('check-ts-file', function() {
    return gulp.src('typings/app.d.ts')
        .pipe(expect({
            reportUnexpected: false,
            reportMissing: true,
            checkRealFile: true,
            errorOnFailure: true
        }, 'typings/app.d.ts'))
        .on('error', function() {
            util.log(util.colors.green('Creating the missing file'));
            try {
                fs.writeFileSync('typings/app.d.ts', '//{\n\n//}');
                this.emit('end');
            } catch (ex) {
                fs.mkdirSync('typings');
                fs.writeFileSync('typings/app.d.ts', '//{\n\n//}');
                this.emit('end');
            }
        });
});

gulp.task('gen-ts-refs', ['check-ts-file'], function() {
    var target = gulp.src('typings/app.d.ts');
    var sources = gulp.src('app/**/*.ts', {
        read: false
    });
    return target
        .pipe(inject(sources, {
            starttag: '//{',
            endtag: '//}',
            transform: function(filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
        })).pipe(gulp.dest('typings'));
});

gulp.task('tslint', function() {
    return gulp.src(['app/**/*.module.ts', 'app/**/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            emitError: true
        }));
});

gulp.task('typescript', ['tslint'], function() {
    var tsResult = gulp.src(['app/**/*.module.ts', 'app/**/*.ts', 'typings/**/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .on('error', swallowError);

    var jsResult = tsResult.js
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({
            gulpWarnings: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.tmp/'));

    return jsResult;
    /*
	var dtsResult = tsResult.dts
		.pipe(gulp.dest('definitions'));

	return merge([jsResult, dtsResult]);
	*/
});

/***********************
 Sass
 ***********************/

function sassStream() {
    return gulp.src('app/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', swallowAndLogError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.tmp/'));
}

gulp.task('sass', function() {
    return sassStream();
});

gulp.task('sass-bs', function() {
    return sassStream()
        .pipe(filter('**/*.css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/***********************
 Static files
 ***********************/

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('static', function() {
    return gulp.src(['app/*.*', '!app/index.html', '!app/*.scss'])
        .pipe(gulp.dest('dist/'));
});

/***********************
 Use min
 ***********************/

gulp.task('usemin', function() {
    return gulp.src('app/index.html')
        .pipe(usemin({
            cssVendor: [
                minifyCss(),
                'concat',
                rev()
            ],
            css: [
                minifyCss(),
                rev()
            ],
            jsVendor: [
                uglify({
                    mangle: true,
                    compress: true
                }),
                rev()
            ],
            js: [
                uglify({
                    mangle: true,
                    compress: true
                }),
                rev()
            ]
        }))
        .pipe(gulp.dest('dist/'));
});

/***********************
 Templates
 ***********************/

gulp.task('cacheComponentTemplates', ['usemin'], function() {
    return gulp.src('app/components/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2js({
            moduleName: moduleName,
            prefix: 'components/'
        }))
        .pipe(concat('templates-components.js'))
        .pipe(ngAnnotate({
            gulpWarnings: false
        }))
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('cacheVendorTemplates', ['usemin'], function() {
    return gulp.src('app/vendor/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2js({
            moduleName: moduleName,
            prefix: 'vendor/'
        }))
        .pipe(concat('templates-vendor.js'))
        .pipe(ngAnnotate({
            gulpWarnings: false
        }))
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('injectTemplates', ['cacheComponentTemplates', 'cacheVendorTemplates'], function() {
    return gulp.src('dist/index.html')
        .pipe(inject(gulp.src('dist/scripts/templates*.js'), {
            read: false,
            ignorePath: ['/dist/', 'dist'],
            addRootSlash: false
        }))
        .pipe(gulp.dest('dist'));
});

/***********************
 Environment specific files
 ***********************/

gulp.task('localEnvironmentFiles', ['usemin'], function() {
    return gulp.src('config/' + env + '/*')
        .pipe(rev())
        .pipe(gulp.dest('dist/envscripts/'));
});

gulp.task('environmentStrings', ['usemin'], function(cb) {
    if (envConfig.injects && envConfig.injects.length > 0) {
        var stream = gulp.src('dist/index.html');
        for (var i = 0; i < envConfig.injects.length; i++) {
            var element = envConfig.injects[i];
            stream.pipe(injectString.before('<script', element + '\n'));
        }
        stream.pipe(gulp.dest('dist/'));
        stream.on('end', cb);
    } else {
        cb();
    }
});

gulp.task('environment', ['localEnvironmentFiles', 'environmentStrings'], function() {
    return gulp.src('dist/index.html')
        .pipe(inject(gulp.src('dist/envscripts/*', {
            read: false
        }), {
            name: 'environment',
            ignorePath: '/dist/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('dist/'));
});

/***********************
 Building
 ***********************/

gulp.task('minifyindex', ['usemin', 'environment', 'injectTemplates'], function() {
    return gulp.src('dist/index.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(cb) {
    rimraf('dist', cb);
});

gulp.task('build-code', ['minifyindex', 'images', 'fonts', 'static'], function(cb) {
    cb();
});

gulp.task('build-ts-scss', ['typescript', 'sass'], function() {
    gulp.start('build-code');
});

gulp.task('build-config', ['config', 'gen-ts-refs'], function() {
    gulp.start('build-ts-scss');
});

gulp.task('build', ['clean'], function() {
    gulp.start('build-config');
});

/***********************
 Browser sync
 ***********************/

var browserSyncOptions = {
    server: {
        baseDir: 'app',
        index: 'index.html',
        routes: {
            '/bower_components': 'bower_components',
            '/styles': '.tmp',
            '/scripts': '.tmp',
            '/node_modules': 'node_modules'
        }
    },
    browser: ['google chrome'],
    open: true,
    logConnections: false,
    logLevel: 'info',
    notify: false,
    // disable sync
    ghostMode: false
};

// Static server
gulp.task('browser-sync', function() {
    browserSync(browserSyncOptions);
});

gulp.task('tunnel', function() {
    browserSyncOptions.tunnel = moduleName;
    browserSync(browserSyncOptions);
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/**/*.scss', {
        read: false,
        debounceDelay: 200
    }, ['sass-bs']);
    gulp.watch('app/**/*.ts', {
        read: false,
        debounceDelay: 200
    }, ['typescript', browserSync.reload]);
    gulp.watch('app/**/*.html', {
        read: false,
        debounceDelay: 200
    }, browserSync.reload);
});

gulp.task('default', ['config', 'gen-ts-refs', 'typescript', 'sass'], function() {
    gulp.start('watch');
});
