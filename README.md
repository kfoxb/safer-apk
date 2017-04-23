# Safer

> React Native &amp; client side files for the Safer project
>> Safer - A peace of mind
>> Safer allows users to see at a glance that their loved ones are safe using labeled geolocation fencing.

## Team

  - Dario Artega
  - Kyle Bradford
  - Raphael Feliciano
  - Tiffany Lin

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- [node > 7.6.0](https://nodejs.org)
- [react-native-cli](https://www.npmjs.com/package/react-native-cli)

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```
Follow the installation instructions [here](https://facebook.github.io/react-native/docs/getting-started.html).

### Roadmap

View the project roadmap [here](https://drive.google.com/open?id=1zswwIFLl2TnROUIvWz_xeiKi4R1QUJyWA1xDT4M54XY)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Troubleshooting

- If you get something similar to this error, specifically with 'default' not found:
```sh
A problem occurred configuring project ':app'.
> Could not resolve all dependencies for configuration ':app:_debugApk'.
   > Configuration with name 'default' not found.
```
then you should check your android/settings.gradle file for a node_module that is not installed. All react native modules that are listed there should look something like this:
```sh
project(':react-native-fcm').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fcm/android')
```
follow the path listed as the last argument to new File and make sure it's installed for every project in settings.gradle.

- If you get an error about naming collisions, similar to this:
```sh
Failed to build DependencyGraph: @providesModule naming collision:
  Duplicate module name: react-native-vector-icons
  Paths: /Users/chandlervdw/Repos/Relay/mobile/node_modules/react-native/local-cli/rnpm/core/test/fixtures/files/package.json collides with /Users/chandlervdw/Repos/Relay/mobile/node_modules/react-native/Libraries/Animated/release/package.json

This error is caused by a @providesModule declaration with the same name accross two different files.
Error: @providesModule naming collision:
  Duplicate module name: react-native-vector-icons
  Paths: /Users/chandlervdw/Repos/Relay/mobile/node_modules/react-native/local-cli/rnpm/core/test/fixtures/files/package.json collides with /Users/chandlervdw/Repos/Relay/mobile/node_modules/react-native/Libraries/Animated/release/package.json

This error is caused by a @providesModule declaration with the same name accross two different files.
    at HasteMap._updateHasteMap (/Users/chandlervdw/Repos/Relay/mobile/node_modules/node-haste/lib/DependencyGraph/HasteMap.js:162:15)
    at /Users/chandlervdw/Repos/Relay/mobile/node_modules/node-haste/lib/DependencyGraph/HasteMap.js:140:25
```
Then you need to delete your npm cache inside your home directory:
```sh
rm -rf ~/.npm
```
Then run React Native's packager with the --reset-cache option:
```sh
npm start --reset-cache
```

- If you're not using an emulator, make sure wifi is on and you're connected to the same network.

- Try deleting node_modules and reinstalling:
```sh
rm -rf node_modules && npm install
```

- Turn it off and back on again. Turn off your emulator, unplug your phone, close your terminals, and if that doesn't work, restart your computer.
- Link your libraries automatically by running:
```sh
react-native link
```