# OER Template Repository

These are open educational resources ([OER](https://en.wikipedia.org/wiki/Open_educational_resources)).
The repository should be used as a template for the your own classes.

## Using the Content

Content is located in the `content/` folder.

Each chapter has its own folder.
Content for each chapter is split in two subfolders:
* `lecture/`: content to be presented and discussed as part of lectures / presentations
* `practice/`: content to be worked on as practical activities

Lecture content is expected to be presented and followed.
Practice content is expected to be used hands-on individually or as part of team.

## Publishing workflow

Before building the repository you have to set up the following items:

* select the GitHub Pages branch by following the [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) tutorial; you will have to set up the `gh-pages` branch as the publishing branch;
* add a publishing key named `ACCESS_TOKEN` by following the [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) tutorial.

In order to publish the content of this repository, we use a GitHub workflow located in the `.github/workflows/deployment.yml`.
This workflow will build the site using [Docusaurus](https://docusaurus.io/) and publish the contents to a link similar to `<github_username>.github.io`.

## Your first TODOs

To configure this repo for the class for which you intend to develop content, you must make the following changes:

* change the repository name to match your class name, the default is `oer-template`
* in `config.yaml`:
  * change `title` to you class name;
  * change `url` to `<github_usename>.github.io`;
  * change `baseurl` to `/` if the repository is the only one with a GitHub page in your profile, otherwise, change it to `<repository_name>`;
  * change links to social media sites, if applicable;

## Running locally

When testing locally, you will have to build the container that will run the builder based on the `Dockerfile` defined in the repository root as follows:

```
docker build --no-cache -f ./Dockerfile --tag <your-repo-name>/docusaurus:latest .
```

In order to run the builder which will create the repository locally, you will have to run the newly built container:

```
docker run -it -v $PWD/:/content -v $PWD/../output:/output <your-repo-name>/docusaurus:latest
```

Finally, to view the content locally, you will have to start a container by running the following command in the `output` directory

```
python3 -m http.server
```

The website will be available by accessing the `http://localhost:8000` address. To change the defualt port you will add this a parameter to the above command as follows.

```
python3 -m http.server 8888
```

This command will open the web server on port `8888`.

Make sure that you run command in the `output directory`.


## Chapter Contents

### Lecture

Lecture content consists of slides, demos, media files and quizzes in the `lecture/` subfolder of each chapter.

Slides are written in [GitHub Markdown](https://guides.github.com/features/mastering-markdown/) and use [reveal-md](https://github.com/webpro/reveal-md) and [reveal.js](https://revealjs.com/) to render HTML output.
Building slides requires [MarkdownPP](https://github.com/amyreese/markdown-pp).
Lecture slides are built from the `slides.mdpp` file using the `make` command (and the `Makefile`).
`slides.mdpp` is a wrapper / index file;
actual content is stored in Markdown format in files in the `slides/` subfolder.
Output is generated in the `_site/` subfolder;
open the `_site/index.html` in a browser to view the slides.

Demos are snippets of code and support files that showcase concepts and ideas related to the lecture.
Demos are located in the `demo/` subfolder.
Each demo has its own folder with source code, `Makefile` or other build files (if required) and support files.

Media files are images and films used in slides for visual support.
Media files are located in the `media/` subfolder.

Quizzes are used in slides to trigger interactivity with participants and as a form of (self-)assessment.
Quizzes are located in the `quiz/` subfolder.
Quiz questions are stored in [Markdown format](https://guides.github.com/features/mastering-markdown/), one file per quiz.

### Practice

Practice content consists of background text, media files, support files and quizzes in the `practice/` subfolder of each chapter.

Background text is located in `content/` folder as a series of sections.
Each section consists of general information, tutorial information followed by description of actual work items and a quiz.
Sections are indexed in the `README.md` file.

Support files for work items are stored in the `support/` subfolder.
There is a subfolder for each section.
Each section subfolder contains source code, `Makefile` (or other build files, if required) and support files.

Media files are images and films used in text for visual support.
Media files are located in the `media/` subfolder.

Quizzes are referenced at the end of each section as a form of (self-)assessment.
Quizzes are located in the `quiz/` subfolder.
Quiz questions are stored in [Markdown format](https://guides.github.com/features/mastering-markdown/), one file per quiz.

## Contributing

Contributions are welcome.
See the [contribution guide](CONTRIBUTING.md) on how you could report or fix issues and on how you can improve the content.

Reviewers are requested to follow the [reviewing guide](REVIEWING.md).
