# Native Start

My initial beginnings with React Native was to use Expo. However I struck a
header rendering problem that I was unable to solve. In an effort to get away
from the problem I took a whole new track to use React Native in a more bare
bones way.

I pretty much followed this: [Setting up React Native development on Linux
without installing Android Studio](https://medium.com/@khairold/setting-up-react-native-on-linux-without-android-studio-a65f3e011bbb>).

## Java

I did need to install `openjdk-devel` and set `$PATH`.

## Android SDK

All went well enough, bit of time spent working out ownership and permissions.
No `udev` group and on my single user machine I used `wheel` as my go to group. So that running:

```shell
   adb devices
```

would work without permission problems.

## Yarn

Just started using yarn with this project. Simple removed `package-lock.json` whenever mentioned.

Did need to:

```shell
   yarn add -D babel-eslint
```

And add the following to `.eslintrc.json`:

```json
  "parser": "babel-eslint"
```


## HTC One Phone

Instructions to set up phone with developer options was straightforward enough.
Initially `adb devices` did not show the device - sure enough, with the third
usb cable it all worked well.

## ESLint

I installed ESLint globally:

```shell
   sudo npm install -g eslint
```

Set up a configuration file:

```shell
  eslint --init
```

I choose `AirBNB` style guide, opinioniated, with React support.

Usage:

```shell
   ./node_modules/eslint/bin/eslint.js App.js
```

# React Native and Native Base

Use react-native to start the app:

```shell
   react-native init my_app
   cd my_app
   react-native link
   yarn add native-base
   yarn add react-navigation
   yarn add react-native-gesture-handler
   react-native link react-native-gesture-handler
```

## Customising Theme

This was really quite significant:

```shell
   node node_modules/native-base/ejectTheme.js
```

Which allows this because it copies theme directory to local app:

```javascript
   import getTheme from './native-base-theme/components';
   import variables from "./native-base-theme/variables/commonColor";

   export default class Home extends React.Component {
     render() {
       return (
         <StyleProvider style={ getTheme(variables) }>
            ...
         </StyleProvider>
      );
   }}
```

## Amplify

I'm storing data on Amazon DynamoDB and using GraphQL queries via Amplify to
access the data. To do that from here:

```shell
   amplify init
   amplify add codegen --apiId ******
   amplify codegen
```

The files `src/aws-exports.js` and `src/graphql/*.js` have been created.

And add library:

```shell
   yarn add aws-amplify
```
