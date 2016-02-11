# ॐ

## Teach me how to Squarespace.
Clone this into the root of your project repo.
```shell
$ git clone https://github.com/stormwarning/dharma-sqsp.git
```

Style and JavaScript source can live in `/source`, as well as images and fonts.

Edit the template files inside `/squarespace`.

```shell
$ npm install
```

With `gulp` and `node-squarespace-server` installed, we can work locally, and deploy to Squarespace with git. First, edit the `server` values in `template.conf`, then:

```shell
$ sqs server --reload
```

See [node-squarespace-server][node-sqsp] for more details on running the local server.

[node-sqsp]: https://github.com/NodeSquarespace/node-squarespace-server

To deploy up to Squarespace servers, it's easy!
```shell
$ gulp deploy
```
