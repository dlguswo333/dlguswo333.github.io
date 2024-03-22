---
layout: post
toc: true
title: "How to Install Plugin from Subdirectory with lazy.nvim Plugin Manger"
category: ["Programming"]
tags: [neovim, vim]
author:
  - 이현재
---

[*lazy.nvim*][lazy.nvim] is one of neovim plugin managers that helps you install plugins.
By specifying Github repositories or local directories,
you can install designated plugins easily.

```lua
  {
    'nvim-lualine/lualine.nvim',
    dependencies = { 'nvim-tree/nvim-web-devicons' },
    config = function()
      require('lualine').setup()
    end
  }
```

This code installs and setups [lualine][lualine] from Github repository.

But there are some repositories which host neovim plugin files in subdirectory
for some reasons such as to make the plugins available to programs other than neovim.
In that case you need to tell your plugin manager to look for the plugin in subdirectories.

With [*Vundle*][Vundle] plugin manager, you can easily do that with `rtp` property.
It stands for 'runtimepath' and specifies the subdirectory that contains vim plugin files.

```lua
Bundle 'sonph/onehalf', {'rtp': 'vim/'}
colorscheme onehalflight
```

The code above installs [onehalf][onehalf] colorscheme on your vim.
But lazy.nvim does not provide the same property in the plugin spec as of March 2024.
So how can you do that? Well, you can do the same with little bits of code.

```lua
  {
    'sonph/onehalf',
    config = function(plugin)
      vim.opt.rtp:append(plugin.dir .. "/vim")
      vim.cmd('colorscheme onehalflight')
    end
  }
```

In the config function, you receive the plugin as the parameter.
`..` is an operator in lua that concatenates the two adjacent strings.
So you are appending the exact subdirectory to the runtimepath with `vim.opt.rtp:append` function.
Check out this issue link for more information: https://github.com/folke/lazy.nvim/issues/183

[lazy.nvim]: https://github.com/folke/lazy.nvim 
[lualine]: https://github.com/nvim-lualine/lualine.nvim
[Vundle]: https://github.com/VundleVim/Vundle.vim 
[onehalf]: https://github.com/sonph/onehalf
