# PaperBits

PaperBits is a library of visual web content authoring tools and components. It lets you build re-usable widgets that works like standard HTML elements and makes it easier to build your very own custom web applications with advanced content authoring capabilities.

```html
<!-- Add PaperBits reference to your index.html  -->
<script src="https://cdn.paperbits.io/everything.min.js" type="text/javascript"></script>

<!-- Use element -->
<paper-picture src="https://paperbits.io/images/pen-fight.svg" layout="noframe"></paper-picture>
```
Using PaperBits you can:
  - Build products with a nice UX for online content editing capability
  - Turn your app in full-blown CMS that works with your backend or a simple and free third-party one ([FireBase](https://firebase.google.com/), [GitHub](https://developer.github.com/)) 
  - Host it in any file hosting service like Firebase, Google Drive, Dropbox, etc.

Check out [paperbits.io](https://paperbits.io) for all of the library [documentation](https://github.com/paperbits/paperbits-knockout/wiki/Documentation), including [getting started](https://github.com/paperbits/paperbits-knockout/wiki/Documentation#getting-started) guides, tutorials, developer reference, and more.

Or if you'd just like to download the library, check out our [releases page](https://github.com/paperbits/paperbits-knockout/releases).

## Overview
PaperBits is all about widgets and editors. Whether you need to have YouTube player on the page or plug-in Intercom, just drop a tag into your markup (in this case <paper-youtube> or <paper-intercom> respectively). 

Shall you need a nice UX for editing? Put another tag (i.e. <paper-youtube-editor>). This way you can turn your applications into full-blown CMS that works with your backend or a third-party one (i.e. [<paper-firebase>](https://github.com/paperbits/paperbits-samples/wiki/Documentation#firebase)) 

## Installation

PaperBits requires [Node.js](https://nodejs.org/) v5+ and [TypeScript](http://www.typescriptlang.org/) to run.

You need TypeScript, Bower and Gulp installed globally:
```sh
$ npm install -g typescript
$ npm install -g typings 
$ npm install -g bower 
$ npm install -g gulp
```
Clone PaperBits repo from GitHub
```sh
$ git clone [git-repo-url] paperbits
```
Install required packages
```sh
$ cd paperbits
$ npm install
$ bower install
$ typings install
```
# License
[GNU GPL 3](https://github.com/paperbits/paperbits-knockout/blob/master/LICENSE)
