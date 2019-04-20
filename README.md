How I got this started
======================

My initial beginnings with `React Native`_ was to use Expo_. However I struck a
header rendering problem that I was unable to solve. In an effort to get away
from the problem I took a whole new track to use `React Native`_ in a more bare
bones way.

I pretty much followed this: `Setting up React Native development on Linux
without installing Android Studio
<https://medium.com/@khairold/setting-up-react-native-on-linux-without-android-studio-a65f3e011bbb>`_.

Java
----

I did need to install `openjdk-devel` and set `$PATH`.

Android SDK
-----------

All went well enough, bit of time spent working out ownership and permissions.
No `udev` group and on my single user machine I used `wheel` as my go to group. So that running::

   adb devices

would work without permission problems.

Yarn
----

Just started using yarn_ with this project. Simple removed `package-lock.json` whenever mentioned.

Did need to::

   yarn add -D babel-eslint

And add the following to `.eslintrc.json`::

  "parser": "babel-eslint"


HTC One Phone
-------------

Instructions to set up phone with developer options was straightforward enough.
Initially `adb devices` did not show the device - sure enough, with the third
usb cable it all worked well.

ESLint
------

I installed ESLint_ globally::

   sudo npm install -g eslint

Set up a configuration file::

  eslint --init

I choose `AirBNB` style guide, opinioniated, with React support.

Usage::

   ./node_modules/eslint/bin/eslint.js App.js

React Native and Native Base
============================

Use `react-native`_ to start the app::

   react-native init my_app
   cd my_app
   react-native link
   yarn add native-base
   yarn add react-navigation
   yarn add react-native-gesture-handler
   react-native link react-native-gesture-handler

Customising Theme
-----------------

This was really quite significant::

   node node_modules/native-base/ejectTheme.js

Which allows this because it copies theme directory to local app::

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

Amplify
-------

I'm storing data on Amazon DynamoDB_ and using GraphQL_ queries via Amplify_ to
access the data. To do that from here::

   amplify init
   amplify add codegen --apiId ******
   amplify codegen

The files `src/aws-exports.js` and `src/graphql/*.js` have been created.

And add library::

   yarn add aws-amplify

.. _React Native: https://facebook.github.io/react-native/
.. _Expo: https://expo.io
.. _yarn: https://yarnpkg.com


