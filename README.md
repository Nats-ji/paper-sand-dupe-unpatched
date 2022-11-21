![GitHub][license]
![fork][forks]
![star][stars]
![GitHub release (latest SemVer including pre-releases)][latest-release]
![GitHub (Pre-)Release Date][release-date]
![downloads][total-downloads]

# PaperMC Sand Duplication Glitch Unpatched

[中文](https://github.com/Nats-ji/paper-sand-dupe-unpatched/blob/master/README_zh.md)

![banner](https://repository-images.githubusercontent.com/439708131/2399b3e8-c386-427d-9370-cf7a4c847b8d)

## Download

### Latest Version

[![GitHub release (latest by date including pre-releases)][latest-release-big]](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases)

<details>
  <summary><h3>Previous Versions</h3></summary>
  
| Version | Download |
| ------- | -------- |
| 1.18.2 | [![1.18.2][release-1.18.2]](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases/tag/1.18.2-387) |
| 1.18.1 | [![1.18.1][release-1.18.1]](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases/tag/1.18.1-216) |
| 1.18 | [![1.18][release-1.18]](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases/tag/1.18-066) |
| 1.17.1 | [![1.17.1][release-1.17.1]](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases/tag/1.17.1-411) |
</details>

## What is this?

This is a custom build of the plugin compatible and high performant Minecraft server, PaperMC. This build removes the patches that fix [the end portal gravity block duplication glitch](https://minecraft.fandom.com/wiki/Tutorials/Block_and_item_duplication#Gravity_Block_Duplication_.28Patched_in_Paper_1.15.2_Build_.23358.29) from the PaperMC. So you can duplicate sand and other gravity blocks as in vanilla Minecraft server.

It is a node.js application that runs periodically on the Github Action runner.

It will fetch the latest version of [PaperMC](https://github.com/PaperMC/Paper),
and undo the sand duplication glitch patches that PaperMC has implemented.

The runner will run twice a day to check if there's a new build of PaperMC. And it will rebuild the jar once the sand duping patches has been removed and make a new [release](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases) on this repository.

## How does it run?

1. The node.js app needs a `GH_REPO` environment variables (e.g. `Codertocat/Hello-World`) to get the latest release version of the unpatched PaperMC.<br>
  You can use the `{{ $github.repository }}` variable in Github workflow to retrieve it.
  
2. Then it will check the latest release version of the unpatched PaperMC against the office PaperMC release version.<br>

3. If there's a new version, it will fetch the source code from PaperMC's repo, remove the patches and build the jar. The built jar will be put in the project's root directory and renamed to `paper-sand-dupe-unpatched-${mc_version}-${build_number}.jar`<br>
  Then it will write the result to an `output.json` file in the project's root directory.
  ```json
  {
    "Update": true,
    "Version": "${mc_version}-${build_number}",
    "PreRelease": false,
    "FileName": "paper-sand-dupe-unpatched-${mc_version}-${build_number}",
    "Body": "The app will fetch the upstream release msg and put it here.",
    "Title": "PaperMC Sand Duplication Glitch Unpatched ${mc_version}-${build_number}"
  }
  ```

4. If there's a no new version, it will write to `output.json`:
  ```json
  { "Update": false }
  ```
  
5. Then the Github workflow can read the `output.json` to decide whether to make a new release.

## How to run it yourself?

Fork this repository and enable the workflows from the `Actions` tab.

You can press the `Run workflow` button in the Release workflow to trigger the build manually.

Create a `config.json` file in the project root directory with following content to set specific version and build number to compile.

> **Note**
>
> Versions before 1.17 are not supported. Because PaperMC was using a different build tool, and minecraft was still based on JDK 8.

```json
{ "version": "1.17.1", "build": "411" }
```

To compile the latest build in specific version:
```json
{ "version": "1.17.1" }
```

## License
This node.js app and the released jars are all licensed under GLPv3.

[license]: https://img.shields.io/github/license/Nats-ji/paper-sand-dupe-unpatched?style=flat-square
[forks]: https://img.shields.io/github/forks/Nats-ji/paper-sand-dupe-unpatched?style=flat-square
[stars]: https://img.shields.io/github/stars/Nats-ji/paper-sand-dupe-unpatched?style=flat-square
[latest-release]: https://img.shields.io/github/v/release/Nats-ji/paper-sand-dupe-unpatched?include_prereleases&sort=semver&style=flat-square&display_name=release
[release-date]: https://img.shields.io/badge/dynamic/json?label=release%20date&query=%24.published_at&url=https%3A%2F%2Funtitled-60ya9whjj1ye.runkit.sh%2F%3Frepo%3DNats-ji%2Fpaper-sand-dupe-unpatched%26prerelease%3Dtrue&style=flat-square&color=light-green
[total-downloads]: https://img.shields.io/github/downloads/Nats-ji/paper-sand-dupe-unpatched/total?color=dark-green&style=flat-square

[latest-release-big]: https://img.shields.io/github/v/release/Nats-ji/paper-sand-dupe-unpatched?label=Download&sort=semver&style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAi5QTFRFAAAAsbiA////cL4MqZOXpPdlq85yLZdIy0BLPDcrem1NW1xIuKyPqcZwpslmoM5nouF/l9l0l9Ndp859pc1ypMltpMtmoc5nndVzn9dzpNVvrNN1q8txgMNUk81km89rns5rn81po8twpstyqMx0p8xvp9BgjL9Xksdemc9moMR1hqhjZINKfptFhaZOTGU4O1IueWlBfHRFLzcXNjsYjmFUhWBMOjcfSEMjjWBMiWJKQT0uQj4rkV9HjmFHQTwyQTwylV9Ik19IQTwzk2BIkWBIkF9HQj0yQDsxOzYtiWVIjGNIjWFIj2FLj11MPjorPjksQj0yPzowGhULgmhJi2VMjWJPjF1PgVlLTD0qQD0qPzorPTcqPDcrbHRJimVSjGFSgl5PW0s4TEg1RUExoMxmocxloc5poc1sm9Boms9nm81lnc1los5koMpimsJgnsNrkLhal8hlmdFqmdNpm9Rom89iptZsoMppiaxda4hLfoZJgqFTir5ejM5hj9hoktVvh79tbZddV3NLPEwuc2M9ZW83bpJHebFVgsBic6xdR3U+MlM2NUY4MTUpgGZHcGU/YmY6YXJAbYJRR1swNUUlLjciNDgsPTsxiWJHgWNHdmFHbl9GZl5EREIqPTsnOTUlOjcpPzwwj19Hi15HhV1JgVxLdVxJTUMuQDwqOzYnPDcqQDsxj11IjVpJilhLf1lKTkEtQT4sPzsrPjksjldMgldKSjonPjso////dE7rIQAAAGV0Uk5TAAAAAAAAAAAAAAAAARFUwbNGDAk2jN/9+9V9LAYEJnPM+ve/ZR4CJqjx7JMYQePPKkDizSpA4s0qQOLNKkDizSpB484mpvHrkhgEJXLL+va+ZB0CCDSK3v371XwrBQERU7+yRQz/8/cDAAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+YHDgwvNROD/DYAAADdSURBVAjXAdIALf8AAAABDA0ODxAREgIDAAAABAUTFBUWFxgZGhscBgAAHR4fICFlZmdoIiMkJSYAJygpaWprbG1ub3AqKywALS5xcnN0dXZ3eHl6LzAAMTJ7fH1+f4CBgoOEMzQANTaFhoeIiYqLjI2ONzgAOTqPkJGSk5SVlpeYOzwAPT6ZmpucnZ6foKGiP0AAQUKjpKWmp6ipqqusQ0AAREVGra6vsLGys7RHSEkASktMTU61tre4T1BRUlMABwhUVVZXWFlaW1xdCQAAAAAKXl9gYWJjZAALAADUiEK93symaQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0xNFQxMjo0Nzo1MiswMDowMEtMgHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMTRUMTI6NDc6NTIrMDA6MDA6ETjKAAAAEHRFWHRpY2M6Y29weXJpZ2h0AEZCs7Xj3wAAABJ0RVh0aWNjOmRlc2NyaXB0aW9uAGMy+JrBywAAAABJRU5ErkJggg==&display_name=release
[release-1.18.2]: https://img.shields.io/badge/Download-v1.18.2-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAi5QTFRFAAAAsbiA////cL4MqZOXpPdlq85yLZdIy0BLPDcrem1NW1xIuKyPqcZwpslmoM5nouF/l9l0l9Ndp859pc1ypMltpMtmoc5nndVzn9dzpNVvrNN1q8txgMNUk81km89rns5rn81po8twpstyqMx0p8xvp9BgjL9Xksdemc9moMR1hqhjZINKfptFhaZOTGU4O1IueWlBfHRFLzcXNjsYjmFUhWBMOjcfSEMjjWBMiWJKQT0uQj4rkV9HjmFHQTwyQTwylV9Ik19IQTwzk2BIkWBIkF9HQj0yQDsxOzYtiWVIjGNIjWFIj2FLj11MPjorPjksQj0yPzowGhULgmhJi2VMjWJPjF1PgVlLTD0qQD0qPzorPTcqPDcrbHRJimVSjGFSgl5PW0s4TEg1RUExoMxmocxloc5poc1sm9Boms9nm81lnc1los5koMpimsJgnsNrkLhal8hlmdFqmdNpm9Rom89iptZsoMppiaxda4hLfoZJgqFTir5ejM5hj9hoktVvh79tbZddV3NLPEwuc2M9ZW83bpJHebFVgsBic6xdR3U+MlM2NUY4MTUpgGZHcGU/YmY6YXJAbYJRR1swNUUlLjciNDgsPTsxiWJHgWNHdmFHbl9GZl5EREIqPTsnOTUlOjcpPzwwj19Hi15HhV1JgVxLdVxJTUMuQDwqOzYnPDcqQDsxj11IjVpJilhLf1lKTkEtQT4sPzsrPjksjldMgldKSjonPjso////dE7rIQAAAGV0Uk5TAAAAAAAAAAAAAAAAARFUwbNGDAk2jN/9+9V9LAYEJnPM+ve/ZR4CJqjx7JMYQePPKkDizSpA4s0qQOLNKkDizSpB484mpvHrkhgEJXLL+va+ZB0CCDSK3v371XwrBQERU7+yRQz/8/cDAAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+YHDgwvNROD/DYAAADdSURBVAjXAdIALf8AAAABDA0ODxAREgIDAAAABAUTFBUWFxgZGhscBgAAHR4fICFlZmdoIiMkJSYAJygpaWprbG1ub3AqKywALS5xcnN0dXZ3eHl6LzAAMTJ7fH1+f4CBgoOEMzQANTaFhoeIiYqLjI2ONzgAOTqPkJGSk5SVlpeYOzwAPT6ZmpucnZ6foKGiP0AAQUKjpKWmp6ipqqusQ0AAREVGra6vsLGys7RHSEkASktMTU61tre4T1BRUlMABwhUVVZXWFlaW1xdCQAAAAAKXl9gYWJjZAALAADUiEK93symaQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0xNFQxMjo0Nzo1MiswMDowMEtMgHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMTRUMTI6NDc6NTIrMDA6MDA6ETjKAAAAEHRFWHRpY2M6Y29weXJpZ2h0AEZCs7Xj3wAAABJ0RVh0aWNjOmRlc2NyaXB0aW9uAGMy+JrBywAAAABJRU5ErkJggg==
[release-1.18.1]: https://img.shields.io/badge/Download-v1.18.1-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAi5QTFRFAAAAsbiA////cL4MqZOXpPdlq85yLZdIy0BLPDcrem1NW1xIuKyPqcZwpslmoM5nouF/l9l0l9Ndp859pc1ypMltpMtmoc5nndVzn9dzpNVvrNN1q8txgMNUk81km89rns5rn81po8twpstyqMx0p8xvp9BgjL9Xksdemc9moMR1hqhjZINKfptFhaZOTGU4O1IueWlBfHRFLzcXNjsYjmFUhWBMOjcfSEMjjWBMiWJKQT0uQj4rkV9HjmFHQTwyQTwylV9Ik19IQTwzk2BIkWBIkF9HQj0yQDsxOzYtiWVIjGNIjWFIj2FLj11MPjorPjksQj0yPzowGhULgmhJi2VMjWJPjF1PgVlLTD0qQD0qPzorPTcqPDcrbHRJimVSjGFSgl5PW0s4TEg1RUExoMxmocxloc5poc1sm9Boms9nm81lnc1los5koMpimsJgnsNrkLhal8hlmdFqmdNpm9Rom89iptZsoMppiaxda4hLfoZJgqFTir5ejM5hj9hoktVvh79tbZddV3NLPEwuc2M9ZW83bpJHebFVgsBic6xdR3U+MlM2NUY4MTUpgGZHcGU/YmY6YXJAbYJRR1swNUUlLjciNDgsPTsxiWJHgWNHdmFHbl9GZl5EREIqPTsnOTUlOjcpPzwwj19Hi15HhV1JgVxLdVxJTUMuQDwqOzYnPDcqQDsxj11IjVpJilhLf1lKTkEtQT4sPzsrPjksjldMgldKSjonPjso////dE7rIQAAAGV0Uk5TAAAAAAAAAAAAAAAAARFUwbNGDAk2jN/9+9V9LAYEJnPM+ve/ZR4CJqjx7JMYQePPKkDizSpA4s0qQOLNKkDizSpB484mpvHrkhgEJXLL+va+ZB0CCDSK3v371XwrBQERU7+yRQz/8/cDAAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+YHDgwvNROD/DYAAADdSURBVAjXAdIALf8AAAABDA0ODxAREgIDAAAABAUTFBUWFxgZGhscBgAAHR4fICFlZmdoIiMkJSYAJygpaWprbG1ub3AqKywALS5xcnN0dXZ3eHl6LzAAMTJ7fH1+f4CBgoOEMzQANTaFhoeIiYqLjI2ONzgAOTqPkJGSk5SVlpeYOzwAPT6ZmpucnZ6foKGiP0AAQUKjpKWmp6ipqqusQ0AAREVGra6vsLGys7RHSEkASktMTU61tre4T1BRUlMABwhUVVZXWFlaW1xdCQAAAAAKXl9gYWJjZAALAADUiEK93symaQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0xNFQxMjo0Nzo1MiswMDowMEtMgHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMTRUMTI6NDc6NTIrMDA6MDA6ETjKAAAAEHRFWHRpY2M6Y29weXJpZ2h0AEZCs7Xj3wAAABJ0RVh0aWNjOmRlc2NyaXB0aW9uAGMy+JrBywAAAABJRU5ErkJggg==
[release-1.18]: https://img.shields.io/badge/Download-v1.18-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAi5QTFRFAAAAsbiA////cL4MqZOXpPdlq85yLZdIy0BLPDcrem1NW1xIuKyPqcZwpslmoM5nouF/l9l0l9Ndp859pc1ypMltpMtmoc5nndVzn9dzpNVvrNN1q8txgMNUk81km89rns5rn81po8twpstyqMx0p8xvp9BgjL9Xksdemc9moMR1hqhjZINKfptFhaZOTGU4O1IueWlBfHRFLzcXNjsYjmFUhWBMOjcfSEMjjWBMiWJKQT0uQj4rkV9HjmFHQTwyQTwylV9Ik19IQTwzk2BIkWBIkF9HQj0yQDsxOzYtiWVIjGNIjWFIj2FLj11MPjorPjksQj0yPzowGhULgmhJi2VMjWJPjF1PgVlLTD0qQD0qPzorPTcqPDcrbHRJimVSjGFSgl5PW0s4TEg1RUExoMxmocxloc5poc1sm9Boms9nm81lnc1los5koMpimsJgnsNrkLhal8hlmdFqmdNpm9Rom89iptZsoMppiaxda4hLfoZJgqFTir5ejM5hj9hoktVvh79tbZddV3NLPEwuc2M9ZW83bpJHebFVgsBic6xdR3U+MlM2NUY4MTUpgGZHcGU/YmY6YXJAbYJRR1swNUUlLjciNDgsPTsxiWJHgWNHdmFHbl9GZl5EREIqPTsnOTUlOjcpPzwwj19Hi15HhV1JgVxLdVxJTUMuQDwqOzYnPDcqQDsxj11IjVpJilhLf1lKTkEtQT4sPzsrPjksjldMgldKSjonPjso////dE7rIQAAAGV0Uk5TAAAAAAAAAAAAAAAAARFUwbNGDAk2jN/9+9V9LAYEJnPM+ve/ZR4CJqjx7JMYQePPKkDizSpA4s0qQOLNKkDizSpB484mpvHrkhgEJXLL+va+ZB0CCDSK3v371XwrBQERU7+yRQz/8/cDAAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+YHDgwvNROD/DYAAADdSURBVAjXAdIALf8AAAABDA0ODxAREgIDAAAABAUTFBUWFxgZGhscBgAAHR4fICFlZmdoIiMkJSYAJygpaWprbG1ub3AqKywALS5xcnN0dXZ3eHl6LzAAMTJ7fH1+f4CBgoOEMzQANTaFhoeIiYqLjI2ONzgAOTqPkJGSk5SVlpeYOzwAPT6ZmpucnZ6foKGiP0AAQUKjpKWmp6ipqqusQ0AAREVGra6vsLGys7RHSEkASktMTU61tre4T1BRUlMABwhUVVZXWFlaW1xdCQAAAAAKXl9gYWJjZAALAADUiEK93symaQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0xNFQxMjo0Nzo1MiswMDowMEtMgHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMTRUMTI6NDc6NTIrMDA6MDA6ETjKAAAAEHRFWHRpY2M6Y29weXJpZ2h0AEZCs7Xj3wAAABJ0RVh0aWNjOmRlc2NyaXB0aW9uAGMy+JrBywAAAABJRU5ErkJggg==
[release-1.17.1]: https://img.shields.io/badge/Download-v1.17.1-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAi5QTFRFAAAAsbiA////cL4MqZOXpPdlq85yLZdIy0BLPDcrem1NW1xIuKyPqcZwpslmoM5nouF/l9l0l9Ndp859pc1ypMltpMtmoc5nndVzn9dzpNVvrNN1q8txgMNUk81km89rns5rn81po8twpstyqMx0p8xvp9BgjL9Xksdemc9moMR1hqhjZINKfptFhaZOTGU4O1IueWlBfHRFLzcXNjsYjmFUhWBMOjcfSEMjjWBMiWJKQT0uQj4rkV9HjmFHQTwyQTwylV9Ik19IQTwzk2BIkWBIkF9HQj0yQDsxOzYtiWVIjGNIjWFIj2FLj11MPjorPjksQj0yPzowGhULgmhJi2VMjWJPjF1PgVlLTD0qQD0qPzorPTcqPDcrbHRJimVSjGFSgl5PW0s4TEg1RUExoMxmocxloc5poc1sm9Boms9nm81lnc1los5koMpimsJgnsNrkLhal8hlmdFqmdNpm9Rom89iptZsoMppiaxda4hLfoZJgqFTir5ejM5hj9hoktVvh79tbZddV3NLPEwuc2M9ZW83bpJHebFVgsBic6xdR3U+MlM2NUY4MTUpgGZHcGU/YmY6YXJAbYJRR1swNUUlLjciNDgsPTsxiWJHgWNHdmFHbl9GZl5EREIqPTsnOTUlOjcpPzwwj19Hi15HhV1JgVxLdVxJTUMuQDwqOzYnPDcqQDsxj11IjVpJilhLf1lKTkEtQT4sPzsrPjksjldMgldKSjonPjso////dE7rIQAAAGV0Uk5TAAAAAAAAAAAAAAAAARFUwbNGDAk2jN/9+9V9LAYEJnPM+ve/ZR4CJqjx7JMYQePPKkDizSpA4s0qQOLNKkDizSpB484mpvHrkhgEJXLL+va+ZB0CCDSK3v371XwrBQERU7+yRQz/8/cDAAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+YHDgwvNROD/DYAAADdSURBVAjXAdIALf8AAAABDA0ODxAREgIDAAAABAUTFBUWFxgZGhscBgAAHR4fICFlZmdoIiMkJSYAJygpaWprbG1ub3AqKywALS5xcnN0dXZ3eHl6LzAAMTJ7fH1+f4CBgoOEMzQANTaFhoeIiYqLjI2ONzgAOTqPkJGSk5SVlpeYOzwAPT6ZmpucnZ6foKGiP0AAQUKjpKWmp6ipqqusQ0AAREVGra6vsLGys7RHSEkASktMTU61tre4T1BRUlMABwhUVVZXWFlaW1xdCQAAAAAKXl9gYWJjZAALAADUiEK93symaQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0xNFQxMjo0Nzo1MiswMDowMEtMgHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMTRUMTI6NDc6NTIrMDA6MDA6ETjKAAAAEHRFWHRpY2M6Y29weXJpZ2h0AEZCs7Xj3wAAABJ0RVh0aWNjOmRlc2NyaXB0aW9uAGMy+JrBywAAAABJRU5ErkJggg==
