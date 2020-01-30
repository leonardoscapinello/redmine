Sucrase's just for development, and behind the scenes it needs to convert the imports to the common js sintax. So to deploy your app, you can first run the build command provided in the Sucrase Docs, and then change the command of your procfile.

To generate the build, run this command:
```sucrase ./src -d ./build --transforms javascript,imports```

If you're using Typescript:
```sucrase ./src -d ./build --transforms typescript,imports```

and then, in your procfile:
```web: node ./build/server.js & node ./build/queue.js```

But is not recommended to deploy on heroku because of the dyno, you can work with these builds in your server and a ci service like travis ci, circle ci or buddy that has a nice interface and you don't to do a lot of configurations.
