from cProfile import run
from http import client
from pydoc import cli
import sys 
from turtle import goto, update
from unicodedata import east_asian_width
from PyQt5.uic import loadUi
from PyQt5 import QtWidgets, QtGui
from PyQt5.QtWidgets import QMainWindow, QApplication, QWidget,QStackedWidget
from PyQt5.QtCore import  QThread, pyqtSignal
from threading import Timer

from pprint import pprint
from pymongo import MongoClient
from serial.tools import list_ports
from bson.objectid import ObjectId
from time import sleep
import os, configparser, serial
from datetime import date, datetime, timedelta
# Global Variables
# global db 
# db = None
scanner = {}
configfile_name ="config.ini"




class workerDBConnectionThread(QThread):
    def __init__(self,url,dbName):
        super().__init__()
        self.url = url
        self.dbName = dbName
        
    update_progress = pyqtSignal(object,int)
    def run(self):
        try:
            client = MongoClient(self.url,serverSelectionTimeoutMS=5000)
            db = client[self.dbName]
            buildings = db["buildings"].aggregate([
                {
                    "$lookup": {
                        "from" : "locations",
                        "localField" : "_id",
                        "foreignField" : "buildingObjID",
                        "as" : "locations"
                    }
                }
            ])
            buildings = list(buildings)
            client.close()
            self.update_progress.emit(buildings,1)
        except:
            self.update_progress.emit(None,0)
            


class startScreen(QMainWindow):
    def __init__(self):
        super(startScreen, self).__init__()
        loadUi(resource_path("startScreen.ui"),self);
        self.configBtn.clicked.connect(self.configApp)
        
        self.startBtn.clicked.connect(self.startScanning)
    def configApp(self):
        configDatabase = configDatabaseScreen()
        widget.addWidget(configDatabase)
        widget.setCurrentIndex(widget.currentIndex()+1)
        
    def startScanning(self):
        if os.path.isfile(resource_path(configfile_name)):
            config = configparser.RawConfigParser(allow_no_value=True)
            config.read(resource_path(configfile_name))
            if(config.get("MongoDB", "url")==""):
                self.startUpFailTitle.setText('Config File Not Set!')
                timer = Timer(1.0, self.removeText)
                timer.start()
            else:
                self.startUpFailTitle.setText('')
                programRunning = programRunningScreen()
                widget.addWidget(programRunning)
                widget.setCurrentIndex(widget.currentIndex()+1)
    def removeText(self):
        self.startUpFailTitle.setText('')
class configDatabaseScreen(QMainWindow):
    def __init__(self):
        super(configDatabaseScreen, self).__init__()
        loadUi(resource_path("configDatabase.ui"),self)
        if os.path.isfile(resource_path(configfile_name)):
            config = configparser.RawConfigParser(allow_no_value=True)
            config.read(resource_path(configfile_name))
            self.mongoUrlInput.setText(config.get("MongoDB","url"))   
            self.databaseNameInput.setText(config.get("MongoDB","db"))
        
        
        self.backBtn.clicked.connect(self.backToMain)
        self.configDatabaseConnectBtn.clicked.connect(self.connectToDB)
    def backToMain(self):
        
        widget.removeWidget(widget.currentWidget())
        widget.setCurrentIndex(0)
        
    
    def connectToDB(self):
            if(len(self.mongoUrlInput.text()) != 0 and len(self.databaseNameInput.text()) !=0 ):
                self.connWorker = workerDBConnectionThread(self.mongoUrlInput.text(),self.databaseNameInput.text())
                self.connWorker.start()
                #self.connWorker.finished.con
                self.connWorker.update_progress.connect(self.dbConnection)
            else:
                self.dbConnectionFailedTitle.setText("Please input all fields")
            
    def dbConnection(self, buildings, signal):
        if(signal):
            if(buildings):
                # self.dbConnectionFailedTitle.setStyleSheet("color: rgb(0, 255, 0);font: 12pt 'Roboto';")
                # self.dbConnectionFailedTitle.setText("Connection Successful")
                
                self.goToConfigBuilding(buildings)
            else:
                self.dbConnectionFailedTitle.setText("There may be no data to collect")
        else:
            self.dbConnectionFailedTitle.setText("connection failed: invalid url or db name")
      
    def goToConfigBuilding(self,buildings):
        
        #Save Config To Temp
        scanner["MongoURL"] = self.mongoUrlInput.text()
        scanner["MongoDBName"] =  self.databaseNameInput.text()
        
        
        configBuilding = configBuildingScreen(buildings)
        #configBuilding.initBuildings(buildings)
        widget.addWidget(configBuilding)
        widget.removeWidget(widget.currentWidget())
        widget.setCurrentIndex(widget.currentIndex()+1)
        
class configBuildingScreen(QMainWindow):
    def __init__(self,buildings):
        super(configBuildingScreen, self).__init__()
        loadUi(resource_path("configBuilding.ui"),self)
        
        for building in buildings:
            self.buildingsDropDown.addItem(building["name"],userData=building)
        self.updateLocations()
        
        self.buildingsDropDown.currentIndexChanged.connect(self.updateLocations)
        
        
        self.backBtn.clicked.connect(self.backToMain)
        self.configScannerBtn.clicked.connect(self.goToScannerScreen)
    def backToMain(self):
        widget.removeWidget(widget.currentWidget())
        widget.setCurrentIndex(0)
    
    def updateLocations(self):
        self.locationsDropDown.clear()
        self.entrLocationsDropDown.clear()
        locations = self.buildingsDropDown.currentData()["locations"]
        for location in locations :
            self.locationsDropDown.addItem(location["name"],userData=location)
            self.entrLocationsDropDown.addItem(location["name"],userData=location)
            
        
    def goToScannerScreen(self):
        
        if(self.buildingsDropDown.currentData() and self.locationsDropDown.currentData() and self.entrLocationsDropDown.currentData()):
            
            #Save Config to Dict
            scanner["buildingName"] = self.buildingsDropDown.currentData()["name"]
            scanner["locationName"] = self.locationsDropDown.currentData()["name"]
            scanner["locationEntranceName"] = self.entrLocationsDropDown.currentData()["name"]
            scanner["buildingObjID"] = self.buildingsDropDown.currentData()["_id"]
            scanner["locationObjID"] = self.locationsDropDown.currentData()["_id"]
            
            
            
            configScanner = configScannerScreen()
            widget.addWidget(configScanner)
            widget.removeWidget(widget.currentWidget())
            widget.setCurrentIndex(widget.currentIndex()+1)
        else:
            self.buildingErrTitle.setText("Please input all fields")
        
class configScannerScreen(QMainWindow):
    def __init__(self):
        super(configScannerScreen, self).__init__()
        loadUi(resource_path("configScanner.ui"),self)
        
        device_list = list_ports.comports()
        for device in device_list:
            self.scannersDropDown.addItem(device.description,userData=device)
            
        self.backBtn.clicked.connect(self.backToMain)
        if(self.scannersDropDown.currentText()==""):
            self.scannerErrTitle.setText('Please Select A Scanner')
        else:
            self.configSaverBtn.clicked.connect(self.saveConfigTo)
    def backToMain(self):
        widget.removeWidget(widget.currentWidget())
        widget.setCurrentIndex(0)
    
    def saveConfigTo(self):
        device = self.scannersDropDown.currentData()
        
        
        file = open(resource_path(configfile_name),"w")
        config = configparser.ConfigParser()
        config.add_section("MongoDB")
        config.set("MongoDB", "URL", scanner["MongoURL"])
        config.set("MongoDB", "db", scanner["MongoDBName"])
        config.add_section("Building Info")
        config.set("Building Info","name", scanner["buildingName"])
        config.set("Building Info","objID", str(scanner["buildingObjID"]))
        config.add_section("Location Info")
        config.set("Location Info","name", scanner["locationName"])
        config.set("Location Info","objID", str(scanner["locationObjID"]))
        config.set("Location Info","entrance", scanner["locationEntranceName"])
        config.add_section("Scanner Info")
        config.set("Scanner Info", "VID", '{:04X}'.format(device.vid))
        config.set("Scanner Info", "PID", '{:04X}'.format(device.pid))
        config.write(file)
        file.close()
            
        widget.removeWidget(widget.currentWidget())
        programRunning = programRunningScreen()
        widget.addWidget(programRunning)
        widget.setCurrentIndex(widget.currentIndex()+1)

class programRunningScreen(QMainWindow):
    def __init__(self):
        super(programRunningScreen, self).__init__()
        loadUi(resource_path("programRunningScreen.ui"),self)
        
        
        
        
        self.program = mainProgram()
        self.program.start()
        
        sleep(1)
        if(self.program.isRunning()):
            config = configparser.RawConfigParser(allow_no_value=True)
            config.read(resource_path(configfile_name))
            self.statusLocation.setText(config.get("Location Info", "name")+", "+config.get("Building Info", "name"))
        else:
            self.statusMsg.setText("Offline")
            self.statusMsg.setStyleSheet("color: rgb(255, 0, 0);font: 18pt 'Roboto';")
        self.stopBtn.clicked.connect(self.stopExecution)
        self.configBtn.clicked.connect(self.configApp)
    def stopExecution(self):
        self.program.requestInterruption()
        #print('Running: %s InterReq: %s' % (self.program.isRunning(),self.program.isInterruptionRequested()))
        widget.removeWidget(widget.currentWidget())
        widget.setCurrentIndex(0)
        
    def configApp(self):
        self.program.requestInterruption()
        widget.removeWidget(widget.currentWidget())
        configDatabase = configDatabaseScreen()
        widget.addWidget(configDatabase)
        widget.setCurrentIndex(widget.currentIndex()+1)

class mainProgram(QThread):
    def __init__(self):
        super().__init__()
        self.exiting = False
    
    def run(self):
        config = configparser.RawConfigParser(allow_no_value=True)
        config.read(resource_path(configfile_name))
        if(config.get("MongoDB", "url")==""):
            return
        try:
            # config = configparser.RawConfigParser(allow_no_value=True)
            # config.read(resource_path(configfile_name))
            
            
            client = MongoClient(config.get("MongoDB", "url"))
            self.db=client[config.get("MongoDB", "db")]
            
            vid = config.get("Scanner Info", "vid")
            pid = config.get("Scanner Info", "pid")
            
            self.buildingObjID = config.get("Building Info", "objid")
            self.buildingName = config.get("Building Info", "name")
            
            
            self.locationObjID = config.get("Location Info", "objid")
            self.locationName = config.get("Location Info", "name")
            
            self.locationEntrance = config.get("Location Info","entrance")
            device_list = list_ports.comports()
            port= None;
            for device in device_list:
                if (device.vid != None or device.pid != None):
                    if ('{:04X}'.format(device.vid) == vid and
                        '{:04X}'.format(device.pid) == pid):
                        port = device.device
                        break
                    port = None
            
            
            self.ser = serial.Serial(port, 19200, timeout = 0)
            
            
            
            while not self.isInterruptionRequested():
                line = self.ser.readline().decode()
                if len(line) > 0:
                    print(line)
                line = line[:12]
                if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 10:
                    print(line)
                    user = self.db["memberInfo"].aggregate([
                                    {
                                        "$match": {
                                            "cardID": line,
                                        }
                                    }, 
                                    {
                                        "$lookup": {
                                            "from" : "facilityUsage",
                                            "localField" : "_id",
                                            "foreignField": "userObjID",
                                            "as": "logs",
                                            "pipeline": [
                                                {
                                                    "$match": {
                                                        "buildingObjID": ObjectId(self.buildingObjID),
                                                        "locationObjID": ObjectId(self.locationObjID)
                                                    }    
                                                },
                                                {
                                                    '$sort': {  'timeIn': -1 }
                                                },
                                                {"$limit" : 10}
                                            ]
                                        }
                                    }
                    ])
                    
                    userList = list(user)
                    if(len(userList) != 0):
                        userObj= userList[0]
                        #userObj= list(user)[0]
                        # userObj["logs"] = userObj["logs"][::-1]
                        #pprint(userObj["logs"])
                        
                        if(len(userObj["logs"]) > 0):
                            timeIn = userObj["logs"][0]["timeIn"]
                            timeDelta = datetime.now() - timeIn
                            maxTime = timedelta(hours=12)
                            if(userObj["logs"][0]["timeOut"] == ""):
                                updateLog = self.db["facilityUsage"].update_one({"_id" : userObj["logs"][0]["_id"]},[
                                    {
                                        "$set": {
                                            "timeOut" : datetime.now(),
                                            "timeTotal" : str(datetime.now() - userObj["logs"][0]["timeIn"])
                                        }
                                    }
                                    
                                ])
                            else: 
                                log = {
                                    "userObjID" : userObj["_id"],
                                    "userCardID" : userObj["cardID"],
                                    "userName" : userObj["lastName"]+", "+userObj["firstName"],
                                    "date" : str(date.today()),
                                    "locationObjID" : ObjectId(self.locationObjID),
                                    "locationBuilding" : self.locationName+", "+self.buildingName,
                                    "buildingObjID" : ObjectId(self.buildingObjID),
                                    "timeIn" : datetime.now(),
                                    "timeOut" : "",
                                    "timeTotal" : ""
                                    
                                }
                                createLog = self.db["facilityUsage"].insert_one(log)
                            
                            if(timeDelta > maxTime):
                                updateUser = self.db["memberInfo"].update_one({"cardID":line},[
                                    {
                                        "$set":{
                                            "status.active":{"$not":"$status.active",}
                                            }
                                    },
                                    {"$set" : {
                                        "status.updatedAt":datetime.now(),
                                        "status.flag" : True,
                                        "status.location" : self.locationName+", "+self.buildingName
                                        }
                                    }
                                    ])
                            else:
                                # print("updating log:")
                                # print(userObj["status"]["location"] == self.locationName+", "+self.buildingName)
                                # print(userObj["status"]["active"] == True)
                                # print(self.locationName == self.locationEntrance)
                                if(userObj["status"]["active"] == True and self.locationName == self.locationEntrance):
                                    status = {
                                        "$not" : "$status.active"
                                    }
                                else:
                                    status = True
                                updateUser = self.db["memberInfo"].update_one({"cardID":line},[
                                    {
                                        "$set":{"status.active":status}}
                                    ,
                                    {
                                        "$set" : {
                                            "status.updatedAt":datetime.now(),
                                            "status.location" : self.locationName+", "+self.buildingName
                                            }
                                    }
                                    ])
                        else:
                            log = {
                                "userObjID" : userObj["_id"],
                                "userCardID" : userObj["cardID"],
                                "userName" : userObj["lastName"]+", "+userObj["firstName"],
                                "date" : str(date.today()),
                                "locationObjID" : ObjectId(self.locationObjID),
                                "locationBuilding" : self.locationName+", "+self.buildingName,
                                "buildingObjID" : ObjectId(self.buildingObjID),
                                "timeIn" : datetime.now(),
                                "timeOut" : "",
                                "timeTotal" : ""
                                
                            }
                            createLog = self.db["facilityUsage"].insert_one(log)
                            if(userObj["status"]["active"] == True and self.locationName == self.locationEntrance):
                                status = {
                                    "$not" : "$status.active"
                                }
                            else:
                                status = True
                            updateUser = self.db["memberInfo"].update_one({"cardID":line},[
                                {
                                    "$set":{"status.active":status}
                                },
                                {
                                    "$set" : {
                                        "status.updatedAt":datetime.now(),
                                        "status.location" : (self.locationName+", "+self.buildingName)
                                        }
                                }
                                ])
                    else:
                        print('invalid id')
            self.ser.close()
        except Exception as e:
            print("Exception %s" % e)
        
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)
    
#main        
app = QApplication(sys.argv)
start = startScreen()
widget = QStackedWidget()
widget.addWidget(start)
widget.setFixedHeight(600)
widget.setFixedWidth(400)
app.setWindowIcon(QtGui.QIcon(resource_path('icon.icns')))
widget.show()
try:
    sys.exit(app.exec_())
except Exception as e:
    print(e)