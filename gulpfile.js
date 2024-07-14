import { task, src, dest, watch } from 'gulp';
import less from 'gulp-less';
var browserSync = require('browser-sync').create();
import header from 'gulp-header';
import cleanCSS from 'gulp-clean-css';
import rename from "gulp-rename";
import uglify from 'gulp-uglify';
import pkg from './package.json';

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
task('less', function() {
    return src('less/clean-blog.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
task('minify-css', ['less'], function() {
    return src('css/clean-blog.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
task('minify-js', function() {
    return src('js/clean-blog.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
task('copy', function() {
    src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(dest('vendor/bootstrap'))

    src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(dest('vendor/jquery'))

    src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(dest('vendor/font-awesome'))
})

// Run everything
task('default', ['less', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    watch('less/*.less', ['less']);
    watch('css/*.css', ['minify-css']);
    watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    watch('*.html', browserSync.reload);
    watch('js/**/*.js', browserSync.reload);
});
