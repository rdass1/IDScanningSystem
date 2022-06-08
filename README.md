# AnB ID Scanner Web App
---

This project was built for [Above and Beyond](https://anb.today/) as part of a school project. 

##### Features
- Attendance logging system
- Real time updates as patients scan in
- Creation of ID cards 
- Login system for staff
- Access panel for staff
- GUI for scanner starup and configuration
- MongoDB integration

## Installation 
---
>[!Note]
This project uses [docker](https://www.docker.com/), so make sure you have it installed. The following steps are going to be done on a linux operating system, however, it can be also replicated on windows & mac.

##### Mongo DB (Database)
This app uses MongoDB as its database. If you already have a database from other sources(Ex. MongoDB Atlas) then you can skip this step .

You can setup the docker container by running:

```bash
docker run -d --network="host" -p 127.0.0.1:<port>:27017/tcp --name <container_name> rishondass/anbiddatabase
```

`<port>` = any port you want to map the container port to

`<container_name>` = set the name of the container

Example:
```bash
docker run -d --network="host" -p 127.0.0.1:27017:27017 --name anbDatabaseContainer rishondass/anbiddatabase
```

>[!Info]
>`--network="host"`
>Only applies to linux, if you're on windows or mac remove it

Now setup the username and password of the database by running:

```bash
docker exec <container_name> ./setup -u <username> -p <password>
```

Example:

```bash
docker exec anbDatabaseContainer ./setup -u someUsername -p somePassword
```

>[!TIP]
>Make sure you setup [port forwarding](https://portforward.com/) for your server to access the application outside the network

##### Web App
Now that we have our database running, we can setup our web app by running:

```bash
docker run -d -p 127.0.0.1:<port>:3000/tcp --name <container_name> rishondass/anbidsystem
```
`<port>` = port you want to map the container to. <span style="color:red;">**Must be different than then database!**</span>

`<container_name>` = set the name of the container

Example

```bash
docker run -d --network="host" -p 127.0.0.1:80:3000/tcp --name anbIDWebsiteContainer rishondass/anbidsystem
```

>[!Info]
>`--network="host"`
>Only applies to linux, if you're on windows or mac remove it

Then we can setup the configuration of the web app by running:

```bash
docker exec <container_name> ./setup --u <db_username> --pwd <db_password> --ip <db_ip> --p <db_port> --name <db_name> --s <secret>
```

`<container_name>` = name of the container running the web app

`<db_username>` = username of the database

`<db_password>` = password of the database

`<db_ip>` = ip address of the database(If running on the same machine as the database it should be 127.0.0.1 unless setup differently)

`<db_port>` = port of the data base(Default port number is 27017)

`<db_name>` = name of the database collection(folder), you can name it anything you want.

`<secret>` = string used for signing and/or encrypting cookies. <span style="color:red;">Important make sure you set this string to something long and random.</span>

Example

```bash
docker exec anbIDWebsiteContainer ./setup --u someUsername  --pwd somePassword --ip 127.0.0.1 --p 27017 --name AnBIDSystem --s "rrRQxiFulcLlYui30sjzJsqLIqRtjLMjdPDjxecfITj"
```

Once configured you must restart the web app container by running:

```bash
docker restart <container_name>
```

Example:

```bash
docker restart anbIDWebsiteContainer
```

##### Scanner Program
To use the scanner app simply download the version for the os of your choice and have the scanner plugged in and run.

>[!Note]
>Sanner:
>- Must be a 2D scanner
>- Configured  to USB Serial Emulation

Downloads:
><img src="https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/windows-pass-sm.png" align="center" > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Windows : [download](https://shorturl.at/hsvKM)
>
><img src="https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/mac-pass-sm.png" align="center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mac : [download](https://shorturl.at/ioDFJ)
>
><img src="https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/linux-pass-sm.png" align="center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Linux: [soon]()


## Usage
---
Once you have everything running you can go to the website by going to your browser and typing:
```bash
https://<ip>:<port>
```

`<ip>` = ip of your web app container

`<port>` = port of your web app container(use default http port 80 when setting up web app)

>[!Note]
>The web app server currently runs on http. This is not secure and should be use for production. To use https follow the [setting up https](#setting-up-https) guide.
## Build
In case you want to build from the source files, it's very similar, to running it. There are just a few additional steps before hand. 

Make sure you have [docker](https://www.docker.com/) installed. Once you finish the steps you can go to [installation](#installation )

##### MongoDB (Database)
You can compile the latest version of the database by running:

```bash
docker build ./databaseAppSrc/ -t <image_name>
```

`<image_name>` = name of the image you want to create, during installation this will be the last argument(Ex. rishonodass/anbiddatabase)

Example:
```bash
docker build ./databaseAppSrc/ -t databseImage
```

##### Web App
You can compile the latest version of the web app by running:
```bash
docker build ./webAppSrc/ -t <image_name>
```
`<image_name>` = name of the image you want to create, during installation this will be the last argument(Ex. rishonodass/anbidsystem)

Example:
```bash
docker build ./databaseAppSrc/ -t webImage
```

##### Scanner App
Make sure you have  [python](https://www.python.org/) installed.  Then add all the dependencies from python by running:
```bash
pip install -r ./scannerAppSrc/requirements.txt
```

> **Windows** :
> Make sure to have [pyinstaller](https://pyinstaller.org/en/stable/) and [tkinter](https://docs.python.org/3/library/tkinter.html) installed then run:
> ```bash
>  pyinstaller --noconfirm --windowed --icon "./scannerAppSrc/tree-favicon.ico" --name "AnB Scanner" --add-data "./scannerAppSrc/config.ini;." --add-data "./scannerAppSrc/configBuilding.ui;." --add-data "./scannerAppSrc/configDatabase.ui;." --add-data "./scannerAppSrc/configScanner.ui;." --add-data "./scannerAppSrc/programRunningScreen.ui;." --add-data "./scannerAppSrc/startScreen.ui;." --add-data "./scannerAppSrc/tree-favicon.ico;."  "./scannerAppSrc/main.py"
>```
>**Mac** :
>Make sure to to have [py2app](https://py2app.readthedocs.io/en/latest/) and and [tkinter](https://docs.python.org/3/library/tkinter.html) installed then run:
>```bash
>python  ./scannerAppSrc/setup.py py2app
>```
>Linux :
>Make sure to have [pyinstaller](https://pyinstaller.org/en/stable/) and [tkinter](https://docs.python.org/3/library/tkinter.html) installed then run:
>```bash
>python -m PyInstaller  --onefile --icon ./scannerAppSrc/tree-favicon.ico --name "AnB Scanner" --add-data scannerAppSrc/startScreen.ui:. --add-data scannerAppSrc/configScanner.ui:. --add-data scannerAppSrc/configBuilding.ui:. --add-data scannerAppSrc/configDatabase.ui:. --add-data scannerAppSrc/programRunningScreen.ui:. scannerAppSrc/main.py
>```


## Advanced Configuration
___
This section might be difficult for beginners, watch the video for a step by step guide.
##### Setting up HTTPS
```
To be implemented...
```

## Contributions
___

[**Rishon Dass** ](https://github.com/rdass1): Main web application, database setup, and scanner application

[**Mitchell Traylor**](https://github.com/MitchellTraylor): ID card creator app

[**Sean Graney**](https://github.com/SeanGraney): CSS

## License
---

Copyright (c) 2022-present Rishon Dass

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---
