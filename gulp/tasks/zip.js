import { deleteAsync } from "del";
import zipper from "gulp-zip";

export const zip = async () => {
  await deleteAsync(`${app.path.rootFolder}.zip`);

  return app.gulp
    .src(`${app.path.buildFolder}/**/*.*`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "ZIP",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(zipper(`${app.path.rootFolder}.zip`))
    .pipe(app.gulp.dest("./"));
};
