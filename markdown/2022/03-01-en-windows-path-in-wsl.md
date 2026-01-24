---
layout: post
toc: false
editedDate: 2024-12-14
title: "Windows Path In WSL"
category: "Programming"
tags: [windows, wsl]
author:
  - 이현재
---

# Windows Paths in wsl Env
In *Windows Subsystem for Linux* (aka wsl),
if you have not touched any wsl config
(or something has not been changed),
then you can start apps installed in Windows,
such as vscode. you can start vscode installed
in Windows with `code` command.
<!--more-->

This is because wsl defaults to load `PATH`
environment variable from Windows.
But it might be a little disturbing if
bunch of paths are loaded in your wsl
or you might just not like it.

You can prevent it with `wsl.conf` file,
which should be saved `/etc/` path in your wsl instance
make a file as `/etc/wsl.conf` and save the following
contents.

```text
[interop]
appendWindowsPath=False
```

As the name states, when the variable is set to *False*,
wsl will not append Windows PATH
variable to the wsl PATH variable.

But what if you want to append a specific path?
Such as vscode? It would be still useful if you can start
vscode easily in your wsl instance.

You can do it as you normally do in your Linux system.
In your shell startup script such as `.zshrc` or
`.bashrc`, append the path, but in the
perspective of wsl instance.

```bash
PATH="$PATH:/mnt/c/<Path to vscode>/Microsoft VS Code/bin"
```

This will do it. If you want to find more about
wsl configurations, go to the link below. Good luck!

<https://docs.microsoft.com/en-us/windows/wsl/wsl-config>

# Converting Windows Path to wsl Path
You might already know you can access wsl file paths from Windows,
or vice versa.

Say you access a wsl file path from your Windows.
Then the filepath will be like this:
```text
\\wsl.localhost\Ubuntu-20.04\home\dlguswo333
```

On the other hand, if you access a Windows file path from wsl:
```text
/mnt/c/Users/dlguswo333/workspace
```

And this is not just a mere presentation, you can actually use these
to access paths.
The problem is it is not a piece of cake to get those notations.
Thankfully, there is an executable called `wslpath` that you can use
to convert one into the other.

For example:
```shell
$ wslpath -u 'C:\Users\dlguswo333\workspace'
/mnt/c/Users/dlguswo333/workspace

$ wslpath -w ~/workspace 
\\wsl.localhost\Ubuntu-20.04\home\dlguswo333\workspace
```
