<h1 align="center">
<sub>
<img  src="https://raw.githubusercontent.com/ViewTube/viewtube/development/.github/images/logo.png"
      height="50"
      width="50">
</sub>
ViewTube
</h1>

<p align="center">
  <a href="https://github.com/ViewTube/viewtube/actions/workflows/push-build-workflow.yml">
    <img src="https://github.com/ViewTube/viewtube/actions/workflows/push-build-workflow.yml/badge.svg?branch=development" alt="Github Actions Status"> 
  </a>
  <a href="https://github.com/ViewTube/viewtube/actions/workflows/build-nightly-workflow.yml">
    <img src="https://github.com/ViewTube/viewtube/actions/workflows/build-nightly-workflow.yml/badge.svg?branch=development" alt="Github Actions Status"> 
  </a>
  <a href="https://github.com/ViewTube/viewtube/actions/workflows/test-workflow.yml">
    <img src="https://github.com/ViewTube/viewtube/actions/workflows/test-workflow.yml/badge.svg?branch=development" alt="Daily Tests Status">
  </a>
  <a href="https://hub.docker.com/r/mauriceo/viewtube">
    <img src="https://img.shields.io/docker/image-size/mauriceo/viewtube/dev?label=docker%20image" alt="Docker Image Size (tag)">
  </a>
  <img src="https://img.shields.io/github/last-commit/viewtube/viewtube" alt="GitHub last commit">
</p>

> [!WARNING]
> Project semi-paused at the moment. Read here: [#3002](https://github.com/ViewTube/viewtube/discussions/3002)

ViewTube is an alternative YouTube frontend that lets you watch, search and discover YouTube videos without ads or tracking. It's built to be mobile and desktop friendly, with dark and light themes, and a touch-friendly video player with gestures. You can create an account separately from YouTube, read comments, watch playlists, subscribe to channels and receive push notifications for new uploads.  
It's built using [Nuxt](https://nuxt.com/) and [Nest](https://nestjs.com/).

> [!NOTE]
> You can find the documentation at [viewtube.wiki](https://viewtube.wiki).  
> Check [uptime.viewtube.io](https://uptime.viewtube.io) for updates and downtime status.

<h2 align="center">
<sub>
<img  src=".github/icons/star.svg"
      height="30"
      width="30">
</sub>
Features
</h2>

- Watch videos without ads or tracking
- Built from the ground up to be mobile and desktop friendly
- Dark and light themes
- Touch friendly video player with gestures
- Supports loop, speed, autoplay and volume
- Create an account separately from Youtube
- Read comments
- Search for videos
- Watch playlists
- Subscribe to channels and see their latest uploads
- Receive push notifications for subscribed channels
- Integrated SponsorBlock support

<h2 align="center">
<sub>
<img  src=".github/icons/question.svg"
      height="30"
      width="30">
</sub>
Where does ViewTube get the data from?
</h2>

ViewTube does not use the official Youtube API. It instead scrapes the data from the website using a combination of custom built tools and the following open source libraries.

- [YouTube.js](https://github.com/LuanRT/YouTube.js)
- [node-ytpl](https://github.com/TimeForANinja/node-ytpl)
- [yt-comment-scraper](https://github.com/FreeTubeApp/yt-comment-scraper)
- [yt-channel-info](https://github.com/FreeTubeApp/yt-channel-info)

<h2 align="center">
<sub>
<img  src=".github/icons/screenshot.svg"
      height="30"
      width="30">
</sub>
Screenshots
</h2>

<h3 align="center">
Homepage
</h3>

![Screenshot-Homepage](https://i.ibb.co/Gk5tKQ7/lxt1y0mk.jpg)

<h3 align="center">
Video
</h3>

![Screenshot-Video](https://i.ibb.co/RTL2v3f/g2ejf7wf.jpg)

<h3 align="center">
Channel
</h3>

![Screenshot-Channel](https://i.ibb.co/h9mf1yd/6j45ao5r.jpg)

<h2 align="center">
<sub>
<img  src=".github/icons/home.svg"
      height="30"
      width="30">
</sub>
Host it yourself
</h2>

A comprehensive installation guide is available in the [wiki](https://viewtube.wiki/installation)

<h2 align="center">
<sub>
<img  src=".github/icons/dev.svg"
      height="30"
      width="30">
</sub>
Development setup
</h2>

Check out the [wiki](https://viewtube.wiki/development) for a guide on how to set up the development environment.

<h2 align="center">
<sub>
<img  src=".github/icons/people.svg"
      height="30"
      width="30">
</sub>
Contributors
</h2>

Thanks goes to these wonderful people

[emoji reference](https://allcontributors.org/docs/en/emoji-key)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cyacedev"><img src="https://avatars0.githubusercontent.com/u/46712905?v=4?s=100" width="100px;" alt="cyacedev"/><br /><sub><b>cyacedev</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=cyacedev" title="Code">💻</a> <a href="https://github.com/ViewTube/viewtube/commits?author=cyacedev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ckVendrix"><img src="https://avatars2.githubusercontent.com/u/51775140?v=4?s=100" width="100px;" alt="Vendrix"/><br /><sub><b>Vendrix</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=ckVendrix" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Mennaruuk"><img src="https://avatars.githubusercontent.com/u/52135169?v=4?s=100" width="100px;" alt="Mennaruuk"/><br /><sub><b>Mennaruuk</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=Mennaruuk" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mizzunet"><img src="https://avatars.githubusercontent.com/u/10193999?v=4?s=100" width="100px;" alt="Missu"/><br /><sub><b>Missu</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=mizzunet" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/beardeddude"><img src="https://avatars.githubusercontent.com/u/36680638?v=4?s=100" width="100px;" alt="beardeddude"/><br /><sub><b>beardeddude</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=beardeddude" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://matt.felle.nz"><img src="https://avatars.githubusercontent.com/u/58113890?v=4?s=100" width="100px;" alt="Matt Fellenz"/><br /><sub><b>Matt Fellenz</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=mattfbacon" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://themisir.com"><img src="https://avatars.githubusercontent.com/u/29130291?v=4?s=100" width="100px;" alt="Misir"/><br /><sub><b>Misir</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=themisir" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.rahim.li"><img src="https://avatars.githubusercontent.com/u/41202771?v=4?s=100" width="100px;" alt="Alvan Rahimli"/><br /><sub><b>Alvan Rahimli</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=alvanrahimli" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://wtf.city"><img src="https://avatars.githubusercontent.com/u/10325355?v=4?s=100" width="100px;" alt="Dominik Szymański"/><br /><sub><b>Dominik Szymański</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=chonsser" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://quentinfranchi.com"><img src="https://avatars.githubusercontent.com/u/11914315?v=4?s=100" width="100px;" alt="Quentin Franchi"/><br /><sub><b>Quentin Franchi</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=nargacu83" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/frozenduck"><img src="https://avatars.githubusercontent.com/u/63501031?v=4?s=100" width="100px;" alt="frozenduck"/><br /><sub><b>frozenduck</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=frozenduck" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/patricgruber"><img src="https://avatars.githubusercontent.com/u/12413072?v=4?s=100" width="100px;" alt="Patric Gruber"/><br /><sub><b>Patric Gruber</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=patricgruber" title="Code">💻</a> <a href="https://github.com/ViewTube/viewtube/commits?author=patricgruber" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JoshuaVandaele"><img src="https://avatars.githubusercontent.com/u/24195176?v=4?s=100" width="100px;" alt="Joshua Vandaële"/><br /><sub><b>Joshua Vandaële</b></sub></a><br /><a href="https://github.com/ViewTube/viewtube/commits?author=JoshuaVandaele" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
