# Speech to Text

Fill a form input using Google Speech to Text API

## Getting Started

### Prerequisites

You need [Composer](https://getcomposer.org/) to install this repository.

### Installing

Go to [https://cloud.google.com/speech-to-text/](https://cloud.google.com/speech-to-text/) and create an account to get a "credential.json" file, and paste it in the root directory.

Install dependencies:

```
composer install
```

## Built With

* [Google Speech To Text](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries) - Speech recognition API.
* [Recorder.js](https://github.com/mattdiamond/Recorderjs) - A plugin for recording/exporting the output of Web Audio API nodes.
* [Hark](https://github.com/otalk/hark) - Listens to an audio stream, and emits events indicating whether the user is speaking or not.
* [JQuery](https://github.com/jquery/jquery) - Javascript Framework.

## Acknowledgments

* JQuery was used only because it was developed for a Wordpress website.
* File size (and so, response time) has been greatly reduced thanks to [this post](https://stackoverflow.com/a/28977136/7699236).
