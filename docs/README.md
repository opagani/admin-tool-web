---
description: This is a placeholder description for the rent-guarantee-admin-web application
urls:
  - https://comet1.testpads.net/rent-guarantee/hostedApp/admin
---

# Rent Guarantee Admin Web

## Setup

Make sure to do the initial rentals-js set up

https://bitbucket.hotterpads.com/projects/RP/repos/rentals-js/browse/apps/docs/docs/getting-started.md

## URLs

- [deploy comet-1](https://comet1.testpads.net/rent-guarantee/hostedApp/admin)

## Table of Contents

- [The "What do I need to do before running the code](#the-what-do-i-need-to-do-before-running-the-code)
  - [Install Git, Node, and npm](#install-git-node-and-npm)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Install and Run the Code](#install-and-run-the-code)
    - [Prettier Plugin](#prettier-plugin)
  - [Run the app locally in the browser](#run-the-app-locally-in-the-browser)
    - [Get Authenticated](#get-authenticated)
  - [Run the latest production build in comet1](#run-the-latest-production-build-in-comet1)
  - [Run a specific version of the production build in comet1](#run-a-specific-version-of-the-production-build-in-comet1)
- [Updating the Code](#updating-the-code)
- [Troubleshooting](#troubleshooting)
  - [Windows Users](#windows-users)
- [E2E Cypress Testing](#e2e-cypress-testing)
- [Cypress Videos/Screenshots](#cypress-videos-screenshots)
- [Deployment To Comet](#deployment-to-comet)

### Install Git, Node, and npm

If you have any problems with these steps, make sure you see the [Troubleshooting](#troubleshooting) section below.

**Need to install Git?** - http://git-scm.com/downloads

**Need to install Node?** We recommend using [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) instead of installing from source. Installing from source works, but it's difficult to maintain your Node version later on (which is why `nvm` exists)

**Windows Users!** Please read the [Windows Users](#windows-users) section below for installing Node and WSL.

If you need to verify that you have NVM installed: `nvm --version`. Then install Node:

```sh
# Installs LTS version 14 of Node
# See this page for more install options: https://github.com/nvm-sh/nvm#usage
$ nvm install v14
```

To change to v14 of node:

```sh
$ nvm use v14
```

Verify you have Git, Node, and npm installed. Installing Node will install npm.

```sh
$ git --version
$ node --version
$ npm --version
```

You need the version 14 of Node at this time.

### Authentication and Authorization

In order to run the rent-guarantee-admin-tool you need to be authenticated via OKTA. The easiest way to be authenticated via the browser would be to use [Zookie](https://bitbucket.hotterpads.com/projects/DEV/repos/zookie/browse) which is a browser extension to automatically move ZG authentication cookies over to localhost or toggle the zillow mock user.

Follow the directions and install [Zookie](https://bitbucket.hotterpads.com/projects/DEV/repos/zookie/browse).

Configure Zookie as follows. Click on the Zookie extension in the Chrome browser and set the following selections:

```sh
Enable Auto Cookie Copy: hotpads and zillow

Cookie Domains To Copy (regexp): testpads.net$

Copy Settings: http://localhost

Allowed Cookies: (add the following new cookie names) rent-guaranteeSessionToken and rent-guaranteeUserToken
```

### Install and Run the Code

Then **clone**, **install**, and **run** the app:

```sh
# Clone the repo to your local machine (This just clones, it does not "install")
$ git clone https://bitbucket.hotterpads.com/scm/rp/rentals-js.git

# Whichever directory you run the above command from, that directory should
# now have a folder called `rentals-js`.

# Change directory to the `rentals-js` folder:
$ cd rentals-js

# Install yarn globally
$ npm install -g yarn

# Install and run. Make sure you do these two commands from within the `react-workshop` folder:
$ yarn

# Run the rent-guarantee-graphql app
$ rjs ws run g-graphql dev

# Run the rent-guarantee-admin-web app
$ rjs ws run gadmin-web dev

# If you have issues, read below.
```

#### Prettier Plugin

(not required, but nice)

You might notice as the instructors save their code that a tool called "Prettier" is automatically formatting things. If you use VSCode, here is the [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) you need to install. Clicking the install button on the website will open VSCode and install it as a plugin. However you install it, many code editors will just pick up on the settings we've setup for prettier in our `package.json` file.

### Run the app locally in the browser

#### Get authenticated

Go to: https://comet1.testpads.net/rent-guarantee/ to get authenticated. Enter your OKTA username and password.

Everything is working if the code compiles and you can visit `http://localhost:3001/rent-guarantee/adminApp` in a browser.

If something goes wrong, you may need to see the [Troubleshooting](#troubleshooting) section below. We even have a special section for [Windows Users](#windows-users)

### Run the latest production build in comet1

Note: Just to clarify, there is no docker build/image associated with this app. It technically builds inside of a base node docker image we use, but there's no node server that gets run or docker image that is created the end result of any build is just static assets in s3.

- In the browser go to: https://comet1.testpads.net/rent-guarantee

- To get the latest app in production click on: `HostedApp` and then click on: `rent-guarantee-admin-web`

- This is the url: https://comet1.testpads.net/rent-guarantee/adminApp

### Run a specific version of the production build in comet1

- Download this directory locally: https://bitbucket.hotterpads.com/projects/HOT/repos/devops/browse/dev_install/aws

```
 $ git clone https://bitbucket.hotterpads.com/scm/hot/devops.git
```

- Remove or move your ~/.aws directory:

```
  $ mv ~/.aws ~/.aws-bak
```

- Link your ~/.aws directory to the directory downloaded above:

```
  $ ln -s your-directory.../devops/dev_install/aws ~/.aws
```

- Install latest version of the AWS CLI:

```
  $ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
```

- Verify aws cli installation:

```
  $ which aws
  /usr/local/bin/aws

  $ aws --v
  aws-cli/2.2.26 Python/3.8.8 Darwin/20.6.0 exe/x86_64 prompt/off
```

- View the latest versions of the build:

```
  $ aws s3 ls --profile s3readonly s3://nodeassets/rent-guarantee-admin-web/
                           PRE 334/
                           PRE 335/
                           PRE 336/
                           PRE 337/
                           PRE 338/
                           PRE 339/
                           PRE 340/
                           PRE 341/
                           PRE 342/
                           PRE 343/
                           PRE 344/
                           PRE 345/
                           PRE 346/
                           PRE 347/
                           PRE 348/
                           PRE 349/
                           PRE 350/
                           PRE 351/
                           PRE 353/
                           PRE 354/
```

- Note: A new version of the production build is created automatically once a PR is merged in main. It takes about 15 min to show in the s3 bucket.

### Running a specific version of the production build in comet1

- In the browser go to:

```
  https://comet1.testpads.net/rent-guarantee/
```

- To get the latest app in production click on: `HostedApp` and then click on: `Manage apps`

- Then, type the specific version you want to run, like: `354` or so, in the `Set version` input box, and click on the `Set version` button. You should see the `Current Version` same as the number you typed.

- Finally click on the `adminApp` link.

- You should see the app running in the browser: https://comet1.testpads.net/rent-guarantee/adminApp

## Updating the Code

If you've already cloned the repo but you need to get updated code, then follow these steps:

- First, `cd` into the root directory of the repo
- Then do an `ls` command to ensure you see a `package.json` file listed. If you don't you're not in the root folder of the repo
- Clear out any dirty files in your Git working tree (`git stash` is a safe way to do it, `git reset ---hard` is how to live dangerously)
- Then run these steps to get the updates:

```sh
  git fetch origin main && git rebase origin/main
  yarn
```

Then you should be able to do your `rjs ws run gadmin-web dev` again.

## Troubleshooting

A few common problems:

- **You're having problems cloning the repository.** Some corporate networks block port 22, which Git uses to communicate with GitHub over SSH. Instead of using SSH, clone the repo over HTTPS. Use the following command to tell Git to always use `https` instead of `git`:

```sh
$ git config --global url."https://".insteadOf git://

# This adds the following to your `~/.gitconfig`:
[url "https://"]
  insteadOf = git://
```

- **You're having trouble installing Node.** We recommend using [nvm](https://github.com/creationix/nvm). nvm makes it really easy to use multiple versions of Node on the same machine painlessly. After you install nvm, install the latest stable version of Node with the following command:

```sh
$ nvm use default stable
```

- \*\*You can't start the app with `rjs ws run gadmin-web dev`

- \*\*The app launches but there doesn't seem to be any data.

### Windows Users

Don't use spaces in your repo folder name, we've had some issues with Windows users regarding this if you're not using WSL. **However, you should use the Windows Subsystem for Linux (WSL) instead of GitBash or PowerShell**. Just about all of our Windows issues come from non WSL users. Even Microsoft documentation recommends it for running Node projects:

- WSL 2 Installation: https://docs.microsoft.com/en-us/windows/wsl/install-win10
- Node on Windows: https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2

From their docs:

> "There are multiple ways to install Node.js. We recommend using a version manager as versions change very quickly. You will likely need to switch between multiple versions based on the needs of different projects you're working on"

They will recommend you install `nvm` (Node Version Manager). We agree!

<hr />

Not using WSL can have a few problems that might arise in a Windows Environment:

- Repos with spaces can fail to build.
- Permissions issues when attempting to clone the repo. If you are using WSL but usually use another shell, you may want to copy your SSH keys where WSL can access them. [This article explains why this is necessary and how to do it.](https://devblogs.microsoft.com/commandline/sharing-ssh-keys-between-windows-and-wsl-2/)
- If you do `npm run app` or `npm start` and you get weird errors instead of our menu system, we don't know what that is yet but the only reporters have been using GitBash instead of PowerShell.

<hr />

If you're a Windows user who already does active JS/Node development then you should be good-to-go. Otherwise this section might be able to help.

Consider using [VSCode](https://code.visualstudio.com/download) (A lightweight version of Visual Studio) for our workshops as it is probably more appropriately suited for modern JavaScript development than Visual Studio, Eclipse, IntelliJ, etc. It has a terminal built-in which uses PowerShell by default, but you can configure it to use WSL which is what we recommend.

If you want, you can go into Windows' settings to turn on file extensions. In JavaScript projects, it's common to have a filename like `.gitignore` which would be difficult to see without extensions turned on. It's not required though.

If these instructions for Windows users can be improved, please let us know or make a PR!
