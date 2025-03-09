---
layout: post
toc: false
title: "Cross Compile .NET Projects with Github Actions"
category: [Programming]
tags: [dotnet, git]
author:
  - 이현재
---

I have a simple toy [project](https://github.com/dlguswo333/sync-video-subtitle-name)
which should run on different platforms, like Windows and Linux.
At first, I coded the project with Java and provided *jar* file
which can be run on Java Runtime Environment (jre).
But it felt a little too much to install runtime for this application
so I decided to give .NET a try which provides AOT compilation.

After I finished implementing the basic functionality, I tried to build it,
but unfortunately, .NET still does not support cross compilation when it comes to AOT.

>*Since there's no standardized way to obtain native macOS SDK for use on Windows/Linux, or Windows SDK for use on Linux/macOS, or a Linux SDK for use on Windows/macOS, **Native AOT does not support cross-OS compilation.** Cross-OS compilation with Native AOT requires some form of emulation, like a virtual machine or Windows WSL.*<br>
><https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/cross-compile>

Futhermore, you need more than just a .NET SDK to build AOT.
For instance, you need `clang` on Linux, and on Windows,
You need Microsoft Visual C++, the build tool from MS!<br>
<https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/>

This went far further than I expected.
I did not like the idea of installing and managing those dependencies,
so instead of building on my machine, I turned to Github Actions.
I knew how to build on ubuntu on Github Actions,
but this was the first time I setup Github Action on Windows
and I was nervous.<br>
Thankfully, `windows-latest` have MSVC by default.
All I need to do was to replace `ubuntu-latest` with `windows-latest`.

The following is the full action yml file.
```yml
name: dotnet publish
on:
  release:
    types: [created]

  workflow_dispatch:

jobs:
  publish-linux-x64:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup dotnet
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8'
      - name: Publish
        run: dotnet publish
      - name: Upload
        uses: actions/upload-artifact@v4
        with:
          name: sync-video-subtitle-name-linux-x64
          path: bin/Release/net8.0/linux-x64/publish/sync-video-subtitle-name
          if-no-files-found: 'error'

  publish-win-x64:
    runs-on: windows-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup dotnet
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8'
      - name: Publish
        run: dotnet publish
      - name: Upload
        uses: actions/upload-artifact@v4
        with:
          name: sync-video-subtitle-name-win-x64.exe
          path: bin/Release/net8.0/win-x64/publish/sync-video-subtitle-name.exe
          if-no-files-found: 'error'
```

<br>

The action starts when I create a new release.
Then the build artifacts (=executables) can be found from the action run page.

![github action run page](/img/2025-03-09-en-dotnet-cross-compile-github-actions/github-action-run-page.png)

You may download the artifacts manually or
use [action-gh-release](https://github.com/softprops/action-gh-release)
action to upload the assets to the release page in a continous integration way.

By the way, isn't it intriguing that Windows takes much more time to build than Linux does...?

<br>

## Postscript
.NET AOT is good, but it was something different than I expected.
What I want is something which can be run without runtime,
supports cross compilation on its own, and easy to write code.
However, .NET resorts to external tools to build and does not support cross compilation.
Maybe golang will be the solution to this?
