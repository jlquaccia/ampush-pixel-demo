## Setup project locally
-	Extract files from archive
-	Open Git bash on root where “package.json” resides
-	Run command: npm install
-	After that run below commands
Run script to start devlopment: 
```sh
npm start
```

For distribution folder run the following command and it will create a dist folder which can be placed on a server: 
```sh
npm run build 
```


## Tools
-	Brackets, Atom IDE for development
-	Photoshop CS6 for image optimization
-	Page optimization measure tool: 
Google page speed (https://developers.google.com/speed/pagespeed/insights/)
Webpage test (http://www.webpagetest.org/)

## Technologies
-	HTML5
-	SCSS
-	Plain vanilla JavaScript with ES6
-	Babel to convert ES6 to vanilla JS
-	ES Lint and SCSS Lint

## Approach
-	Haven’t used any library like jQuery, AngularJS, ReactJS, Bootstrap, Zurb, Skeleton etc
-	Kept third party library usage to minimal
-	Wrote hand crafted styles to achieve responsiveness
-	To speed up work, created local build system using webpack which takes care of minify, compression task and export files that need to push to server
-	For images which need high resolution for desktop are separated to load on desktop and mobile/tablet devices so that unnecessary high res images are not loaded on devices
-	Implemented lazy load for images which falls outside first load view port, with that approach images are not loaded initially. Images will be loaded whenever that section is visible. This will speed up DOM loading

## Best Practices
-	ES and SCSS lint is configured and files are scanned during development
-	Kept media queries in separate file called “responsive.scss”, so that media query declaration will be declared only once and related css will be wrapped under that declaration

## Optimization
-	Enable compression and served JS, CSS, HTML files using gzip
-	HTML, CSS, JS minify
-	Optimized images to keep image size minimum to save users bandwidth and to speed up load time

## Optimization we could not implement due to restriction
-	Enabling static file caching option from server
