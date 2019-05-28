# sparkldjs - DiscordJS wrapper-framework thing designed to make bot developing fluffy

For many, the choice between Javascript and Python on the backend is a difficult one, but with the introduction of NodeJS a few years ago, I'd say that decision has been made for you. NodeJS eliminates the need for differeing languages between the frontend and backend, while also performing slightly better than Python.

There wasn't really a library similar to disco in the Javascript world, apart from Discord.JS's [Commando library][1]. So I figured I'd make one - I've tried to keep the library as simple as possible, keeping (hopefully) an intuitive structure to the library and client throughout.

### Work in Progress!

Please be advised - this library is still a huge work-in-progress. There are still missing features, things that need a bit of ironing out etc. Feel free to submit merge requests, and I'll be sure to have a look at them.

If you have any questions/issues that aren't already answered here, feel free to contact me on [Twitter][2], or [Discord][3] (my username's `ori#0001`).

## Quick-start

First, you need to install sparkldjs:

```
$ yarn add git+https://git@github.com/sparklfox/sparkldjs
```

Then:

```typescript
// ES6 imports
import * as sparkldjs from "sparkldjs";
// requirejs imports
const sparkldjs = require("sparkldjs/dist");
```

[1]: https://discord.js.org/#/docs/commando/master/general/welcome
[2]: https://twitter.com/sparklfox
[3]: https://discordapp.com/
[5]: https://github.com/actuallyori/jisco/issues/new
