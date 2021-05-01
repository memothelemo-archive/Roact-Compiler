<h1 align="center">Roact Compiler</h1>

<div align="center">
A plugin that tries to solve the problem of using Roact module
</div>

<br>

## Installation

Method #1: From ROBLOX:

- Click this provided [link](https://www.roblox.com/library/6752892292/Roact-Compiler) and click "Install" button.

Method #2: From .rbxmx file:

- Click the "Releases" page
- Find the latest version of the plugin
- Open ROBLOX Studio and open up any place
- Click "Plugins" tab and click "Plugins Folder"
- Drag the file that you just downloaded into the "Plugins" folder that ROBLOX opens up for you

## Wiki

This plugin is not ready to have a wiki

## Documentation

When you start a session, make sure it is a ModuleScript that returns only Roact function component! (Roact argument provided)

Make sure the sessioned ModuleScript's code looks like this:

```lua
return function(Roact: Roact)
    return Roact.createElement()
end
```

No need to add ScreenGui because this plugin is already provided a ScreenGui for you

## Disclaimer

This plugin is written in TypeScript, so it is hard to track back from Luau to TypeScript (if you don't know how to read TypeScript code), but the author could understand it.

Additionally, it is on experimental stage so it is not ready for commerical use but do it on your own risk!

Few of the scripts are copied from other sources, so bear in mind.

## Contribution

Sure, you can contribute my code or post an issue in the "Issue" page.

Revised codes are acceptable because I'm learning TypeScript recently though.

You can borrow one of the scripts if you like but you're not allowed to publicly publish yourself with the same plugin.
