---
layout: post
toc: true
title: "Chrome 129 does not Show Network Response Preview"
category: ["Programming"]
tags: [web]
author:
  - 이현재
---

![a-response](/img/2024-09-28-en-chrome-129-network-response-preview-not-avail/no-response-data.jpg)

You might have noticed that something strange is going on inside Chrome Dev tool recently.
You cannot see the preview or response on network tab.
Not every network request is affected, but some of them.<br>
But this feels strange. I was able to see through the data days ago
and the request has not changed since then!

# Chrome 129 Applies More Strict Preview Policy
Put it simply, this happens because the responses do not have proper `Content-Type` header
and Chrome 129 applied more strict text content detection mechanism.
Chrome decided the response is not in text type and did not let us see the data.

I found it from chromium issue tracker and here is the link to the chromium issue tracker.<br>
<https://issues.chromium.org/issues/369756813>

# Experiment: `Content-Type` Header
Let us find out if my claim is true with simple experiments.

First, create a simple API server where you can edit response `Content-Type` header.
I chose *asp.net core*. You can pick whatever you want.

Then, create two API endpoints that return the same JSON data but with different `Content-Type`.

```cs
app.MapGet("/a", (HttpContext context) => {
    context.Response.Headers.ContentType = "application/octet-stream";
    return "{\"text\": \"Hello World!\"}";
});

app.MapGet("/b", (HttpContext context) => {
    context.Response.Headers.ContentType = "application/json";
    return "{\"text\": \"Hello World!\"}";
});
```
<br>

Open your Chrome web browser and fetch from the two endpoints from development tool console.

```js
fetch('/a'); fetch('/b');
```
<br>

These are my results. You see, `'/a'` does not show response while `'/b'` does.
The browser is *msedge* (uses Chromium internally) and the version is 129.

![a-response](/img/2024-09-28-en-chrome-129-network-response-preview-not-avail/a-response.png)

![b-response](/img/2024-09-28-en-chrome-129-network-response-preview-not-avail/b-response.png)
<br>

# Experiment: Chrome Versions
We now understand that the different `Content-Type` header is the cause of the issue.<br>
But is it really due to the Chrome changes?
We also may find about that by differentiating with Chrome 128.

But installing previous versions of Chrome is tricky and tiring.
We can do that with **playwright**, the E2E web browser testing tool.

<https://playwright.dev/>

As I mentioned playwright is for test,
but did you know that you may actually use it to ***browse***?
That means we can use playwright to install different versions of web browsers.
Let's use npm to install playwright.
playwright@1.46.1 has Chromium of version 128.

```shell
# Install playwright npm package
npm i playwright@1.46.1
```
<br>

Then, install browsers that playwright is going to use.

```shell
# Install browsers
npx playwright install
```
<br>

Now the command below will open Chromium browser on your desktop.
Of course, this will only work if your environments support.

```shell
# Open Chromium on your desktop
npx playwright open --browser chromium
```
<br>

Fetch from `'/a'` and see the results.

![chromium-128](/img/2024-09-28-en-chrome-129-network-response-preview-not-avail/chromium-128.jpg)

Since the endpoint has `Content-Type: application/octet-stream` header,
It would not show you the **Response tab**
but does it show you the data in plaintext in **Preview tab**.<br>
...I think they need to be in opposite, but back to the point,
Chrome 128 does show you the data in development tool.

# Old Mechanism Seems to be Coming back
Also from the Chromium issue tracker, it seems like the strict mechanism is getting reverted
and Development tool would show us the text contents even though the header does not tell it is in text.

<https://chromium-review.googlesource.com/5895184>

