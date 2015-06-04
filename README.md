angular-typescript
===================

To develop install nodejs and the following packages globally:
* gulp
* bower
* tsd

then run:
* bower install
* npm install
* tsd reinstall --save --overwrite

**Structure**
This webapp is build using TypeScript and SASS and follows most of john pappas angular styleguide.

The meaning of the directories:
app/ -- contains all your source code (meaning not the compiled output nor any vendor libs)
app/components/ -- contains components which are directories with a controller, a template and optionally styles and tests
app/core/ -- contains the web apps core files, meaning the module declaration, the modules configuration, routes and run method.
app/core/app.constants.ts -- a file that is created from the chosen configuration in the /config dir (not in git)
config/ -- environment configuration, used to create a constant file that is injected into the web app
config/<env> -- any files added here will be included in the distribution builds if the environment matches 

snippets/ -- snippets for creating the angular files used in this web app
snippets/file_templates -- for editors that do not support snippets
snippets/sublime_text_3 -- snippets for sublime text 3
bower_components/ -- bower files (not in git)
node_modules/ -- npm files (not in git)
.tmp/ -- generated files (app.js and app.css) (not in git)
typings/ -- tsd files
dist/ -- output after running 'gulp build'