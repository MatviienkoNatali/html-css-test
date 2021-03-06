let project_folder= "dist";
let source_folder = "src";

let fs = require('fs');

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder +  "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
    css: [source_folder +  "/scss/main.scss", "/scss/*.css"], 
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpeg,jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/**/*",
  }, 
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder +  "/scss/**/*.scss",
    js: source_folder + "/js/*.js",
    img: source_folder + "/img/**/*.{jpeg,jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  fonter = require("gulp-fonter");




function browserSync(params) {
  browsersync.init({
    server: {
      baseDir:  "./" + project_folder + "/"
    },
    port:3000,
    notify: false  
  })
}

function html() {
  return src(path.src.html) 
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream()) 
}

function fonts(){
	src(path.src.fonts)
		.pipe(dest(path.build.fonts));
};

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded" 
      })
    )
    .pipe(
      group_media()
    )
    .pipe(
      autoprefixer({ 
          overrideBrowserslist: ["last 5 versions"], 
          cascade: true 
      })
    )
    .pipe(dest(path.build.css)) 
    .pipe(browsersync.stream())
    .pipe(clean_css()) 
    .pipe(
      rename({
        extname: ".min.css" 
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js) 
    .pipe(fileinclude()) 
    .pipe(dest(path.build.js)) 
    .pipe(uglify()) 
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream()) 
}

function images() {
  return src(path.src.img) 
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream()) 
}

function cb() { }

function watchFiles(params) { 
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.img], fonts);
}

function clean(params) {
  return del(path.clean);
}
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));


let watch = gulp.parallel(build, watchFiles, browserSync);


exports.images = images;
exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build =  build;
exports.watch = watch;
exports.default = watch;
