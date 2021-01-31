[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]<br>
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/addcb42c255b4a819c6d2b16b18d92a6)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=und3fined-v01d/Friend.ly&amp;utm_campaign=Badge_Grade) [![CircleCI](https://circleci.com/gh/und3fined-v01d/Friend.ly.svg?style=svg)](https://circleci.com/gh/und3fined-v01d/Friend.ly) [![Build Status](https://travis-ci.com/und3fined-v01d/Friend.ly.svg?token=qJs8ej6Y7g54csoc3mXz&branch=master)](https://travis-ci.org/und3fined-v01d/Friend.ly)
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/und3fined-v01d/und3fined-v01d">
    <img src="./public/images/astronaut.gif" width="70%" alt="Logo">
  </a>

  <h3 align="center">Friend.<span style="color: pink">ly</span></h3>

  <p align="center">
    The internet is flooded with Social Networking Sites(SNS). Be it Twitter, Facebook or Instagram, SNS(s) are without a doubt one of the most popular methods of making friends in the virtual realm. One of the 
    most important aspects of any SNS is the use of a Friend Recommendation System(FRS). Several different types of FRSs have been proposed but a feature that remains common to all of those is homophily, the propensity to associate people with similar others.<br><br>
    While homophily-based FRSs have proven to be extremely accurate in most circumstances, an essential area that still remains relatively unexplored in this domain is the use of personality insights for recommending friends.
    <br><br>
    With Friend.ly, we propose a novel FRS which leverages text-mining, personality trait extraction, sentiment analysis and hybrid filtering and show it to be having a better performance than most collaborative filtering based FRSs.
    <br />
    <a href="https://github.com/und3fined-v01d/tracker/issues">Report Bug or Feature Request</a>
    ·
    <a href="https://github.com/und3fined-v01d/tracker/issues">Raise a PR</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Development](#development)
  - [Cloud Setup](#cloud setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

<!--
[![Product Name Screen Shot][product-screenshot]](https://example.com)
-->

### Built With

This project would never have been possible without these wonderful frameworks and project.

- [Node.js](https://nodejs.org)
- [EJS](https://ejs.co)
- [Tron](https://github.com/und3fined-v01d/Tron)
- [Watson APIs](https://github.com/watson-developer-cloud/node-sdk#readme)
- [DeepAI](https://deepai.org/machine-learning-model/nsfw-detector)
- [Socket.io](https://www.npmjs.com/package/socket.io)

  Friend.ly is a modified version of [Tron](https://github.com/und3fined-v01d/Tron)!

<!-- GETTING STARTED -->

## Development

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Cloud Setup with GitPod

[Gitpod](https://www.gitpod.io/) can be used to develop Friend.ly in the cloud. All the commits, if any needs to be made to a branch using convention issue-#
(issue-number-on-tracker).

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/und3fined-v01d/Friend.ly)

### Prerequisites

Clone the repo and hit npm install.

- npm

```sh
npm install
```

### Startup

1. Clone the repo

```sh
git clone https://github.com/und3fined-v01d/Friend.ly
```

2. Install NPM packages

```sh
npm install
```

3. Create a .env file in home directory with valid credentials as follows

```
TWITTER_CONSUMER_KEY=<your_twitter_consumer_key>
TWITTER_CONSUMER_SECRET=<your_twitter_consumer_secret>
TWITTER_CALLBACK_URL=<your_twitter_callback_url>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=<your_google_callback_url>
WATSON_API_KEY=<your_watson_api_key>
WATSON_API_VERSION=<your_watson_api_version>
WATSON_URL=<your_watson_url>
```

4. Start the project

```JS
npm start
```

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/AlQaholic007/Friend.ly/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the Apache 2.0 License. See `LICENSE.md` for more information.

<!-- CONTACT -->

## Contact

- Soham Parekh <[@und3fined-v01d](https://github.com/und3fined-v01d), [mail@sohamp.dev](mail@sohamp.dev)>
- Vidhi Mody <[@vidhi-mody](https://github.com/vidhi-mody),  vidhimody98@gmail.com>
- Vrushti Mody <[@vrushti-mody](https://github.com/vrushti-mody),  vrushtimody6@gmail.com>

Project Link: [https://github.com/und3fined-v01d/Friend.ly](https://github.com/und3fined-v01d/Friend.ly)

[contributors-shield]: https://img.shields.io/github/contributors/und3fined-v01d/Friend.ly?style=flat-square
[contributors-url]: https://github.com/und3fined-v01d/Friend.ly/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/und3fined-v01d/Friend.ly?style=flat-square
[forks-url]: https://github.com/und3fined-v01d/Friend.ly/network/members
[stars-shield]: https://img.shields.io/github/stars/und3fined-v01d/Friend.ly?style=flat-square
[stars-url]: https://github.com/und3fined-v01d/Friend.ly/stargazers
[issues-shield]: https://img.shields.io/github/issues/und3fined-v01d/tracker/repo/Friend.ly
[issues-url]: https://github.com/und3fined-v01d/tracker/issues
[product-screenshot]: docs/img/screenshot.png
