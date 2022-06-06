from time import sleep
from tkinter import ttk
from kivy.config import Config
from requests import options
Config.set('input', 'mouse', 'mouse,multitouch_on_demand')
Config.set('graphics','width','400')
Config.set('graphics','height','600')
from kivy.app import App
from kivy.uix.relativelayout import RelativeLayout
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.dropdown import DropDown
from kivy.clock import Clock
from pymongo import MongoClient
import os, configparser,io,serial
from serial.tools import list_ports
from bson.objectid import ObjectId
from datetime import date, datetime, timedelta
import time

configfile_name ="config.ini"
buildingDict = {}
locationDict = {}
scannerDict = {}
buildings = []
buildingInfo = {}
locationInfo = {}
scannerInfo = None



class ANB_ScannerApp(App):
    
    def build(self):
        self.window = RelativeLayout()
        self.window.size_hint = (0.9, 0.7)
        self.window.pos_hint = {"center_x" : 0.5, "center_y" : 0.5}
        self.innerLoop(None)
        
        return self.window
    def innerLoop(self,dt):
        try:
            if(self.ser):
                self.ser.close()
                Clock.unschedule(self.activeScanning)
            
        except Exception as e:
            pass
        self.window.clear_widgets()
        if not os.path.isfile(configfile_name):
            
            self.configureApp(None)
            hide_widget(self.menuButton)
        else:
            self.statusTitle = Label(
            text="Status:",
            size_hint =(.5, .4),
            pos_hint = {"center_x" : 0.5, "center_y" : 0.7}
            )
            self.status = Label(
                text="Offline",
                color="#F8240E",
                size_hint =(.5, .3),
                pos_hint = {"center_x" : 0.5, "center_y" : 0.6}
            )
            self.statusInfo = Label(
                text="",
                color="#F8240E",
                size_hint =(.5, .3),
                pos_hint = {"center_x" : 0.5, "center_y" : 0.5}
            )
            self.configureButton = Button(
                text="Configure",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.8, "center_y" : 1}
                )
            
            self.configureButton.bind(on_press=self.configureApp)
            
            self.startButton = Button(
                text="Start",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.2, "center_y" : 1}
                )
            
            self.startButton.bind(on_press=self.mainProgram)
            
            self.stopButton = Button(
                text="Stop",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.2, "center_y" : 1}
                )
            
            
            self.window.add_widget(self.statusTitle)
            self.window.add_widget(self.status)
            self.window.add_widget(self.statusInfo)
            self.window.add_widget(self.configureButton)
            self.window.add_widget(self.startButton)
            self.window.add_widget(self.stopButton)
            hide_widget(self.stopButton)
            hide_widget(self.statusInfo)
        
        
    def configureApp(self,instance):
        try:
            hide_widget(self.startButton)
            hide_widget(self.stopButton)
            hide_widget(self.statusTitle)
            hide_widget(self.status)
            hide_widget(self.statusInfo)
            hide_widget(self.configureButton)
        except:
            pass
        
        self.databaseTitle = Label(
            text="Enter MongoDB URL:",
            size_hint =(.5, .10),
            pos_hint = {"center_x" : 0.5, "center_y" : 1}
            )
        

        self.databaseURL = TextInput(
            multiline=False,
            padding_y = (10,10),
            size_hint_y = None,
            height = 40,
            pos_hint = {"center_x" : 0.5, "center_y" : .9}
        )
        
        
        self.databaseNameTitle = Label(
            text="Enter MongoDB Database Name:",
            size_hint =(.5, .10),
            pos_hint = {"center_x" : 0.5, "center_y" : .8}
            )
        

        self.databaseName = TextInput(
            multiline=False,
            padding_y = (10,10),
            size_hint_y = None,
            height = 40,
            pos_hint = {"center_x" : 0.5, "center_y" : .7}
        )
        
        self.connectDatabase = Button(
            text="Connect",
            size_hint =(None, None),
            width = 100,
            height = 30,
            pos_hint = {"center_x" : 0.5, "center_y" : .6}
            )
        
        self.connectDatabase.bind(on_press=self.connectDatabaseFunc)
        
        
        self.errorConnect = Label(
            text="Error Couldn't Connect!",
            size_hint =(.5, .10),
            pos_hint = {"center_x" : 0.5, "center_y" : .5},
            color = "#F8240E"
            )
        
        if os.path.isfile(configfile_name):
            config = configparser.RawConfigParser(allow_no_value=True)
            config.read(configfile_name)
            
            self.databaseURL.text = config.get("MongoDB", "url")
            self.databaseName.text = config.get("MongoDB", "db")
        self.menuButton = Button(
                text="Back",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.1, "center_y" : 1}
                )
            
        self.menuButton.bind(on_press=self.innerLoop)
        
        self.window.add_widget(self.menuButton)
        
        self.window.add_widget(self.databaseTitle)
        self.window.add_widget(self.databaseURL) 
        self.window.add_widget(self.databaseNameTitle)
        self.window.add_widget(self.databaseName)
        self.window.add_widget(self.connectDatabase)
        self.window.add_widget(self.errorConnect)
        hide_widget(self.errorConnect)
        
        
        
    
    def connectDatabaseFunc(self,instance):
        try:
            client = MongoClient(self.databaseURL.text,serverSelectionTimeoutMS=5000)
            db = client[self.databaseName.text]
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
            if(buildings):
                hide_widget(self.databaseTitle)
                hide_widget(self.databaseURL)
                hide_widget(self.connectDatabase)
                hide_widget(self.databaseNameTitle)
                hide_widget(self.databaseName)
                self.errorConnect.text = "Successfully Connected!"
                self.errorConnect.pos_hint = {"center_x" : 0.5, "center_y" : 1}
                self.errorConnect.color = "#09FB47"
                hide_widget(self.errorConnect, False)
                
                dropdown = DropDown()
                for i, building in enumerate(buildings):

                    # Adding button in drop down list
                    btn = Button(
                    text=building["name"],
                    size_hint =(1, None),
                    height = 30,
                    pos_hint = {"center_x" : 0.5, "center_y" : .3}
                    )
                    
                    btn.width = 100
                    #print(len(btn.text) * 50)
                
                    # binding the button to show the text when selected
                    btn.bind(on_release = lambda btn: dropdown.select(btn.text))
                    
                
                    # then add the button inside the dropdown
                    dropdown.add_widget(btn)
                    buildingDict[building["name"]] = building["locations"]
                    
                # create a big main button
                self.buildingSelect = Button(text="Choose Building",
                    size_hint =(1, None),
                    width = 100,
                    height = 30,
                    pos_hint = {"center_x" : 0.5, "center_y" : .7})
                
                # show the dropdown menu when the main button is released
                # note: all the bind() calls pass the instance of the caller
                # (here, the buildingSelect instance) as the first argument of the callback
                # (here, dropdown.open.).
                self.buildingSelect.bind(on_release = dropdown.open)
                
                # one last thing, listen for the selection in the
                # dropdown list and assign the data to the button text.
                dropdown.bind(on_select= self.setLocation)
                dropdown.bind(on_select = lambda instance, x: setattr(self.buildingSelect, 'text', x))
                
                self.buildingSelectTitle = Label(
                    text="Select current building and location:",
                    size_hint =(.5, .10),
                    pos_hint = {"center_x" : 0.5, "center_y" : .8}
                )
                self.locationSelect = Button(text="Choose Location",
                    size_hint =(1, None),
                    width = 100,
                    height = 30,
                    pos_hint = {"center_x" : 0.5, "center_y" : .6},
                    
                )
                
                self.buildingSelectTitle2 = Label(
                    text="Select entrance/exit location:",
                    size_hint =(.5, .10),
                    pos_hint = {"center_x" : 0.5, "center_y" : .5}
                )
                
                self.locationSelect2 = Button(text="Choose Location",
                    size_hint =(1, None),
                    width = 100,
                    height = 30,
                    pos_hint = {"center_x" : 0.5, "center_y" : .4},
                    
                )
                
                self.window.add_widget(self.buildingSelectTitle)
                self.window.add_widget(self.buildingSelectTitle2)
                self.window.add_widget(self.buildingSelect)
                self.window.add_widget(self.locationSelect)
                self.window.add_widget(self.locationSelect2)
                
                client.close()
                
                
                
        except Exception as e:
            
            self.errorConnect.text="Error Couldn't Connect!"
            self.errorConnect.color = "#F8240E"
            hide_widget(self.errorConnect, False)
        
    def setLocation(self,y,x):
        buildingInfo["name"] = self.buildingSelect.text
        if(buildingDict[self.buildingSelect.text]):
            buildingInfo["objID"] = buildingDict[self.buildingSelect.text][0]['buildingObjID']
        self.locationSelect.text = "Choose Location"
        self.locationSelect2.text = "Choose Location"
        
        
        self.dropdownLocation = DropDown()
        self.dropdownLocation2 = DropDown()
        
        try:
            hide_widget(self.connectScanner)
        except:
            pass
        
        
        
        try:
            if(buildingDict[self.buildingSelect.text][0]):
                for location in buildingDict[self.buildingSelect.text]:

                    # Adding button in drop down list
                    btn = Button(
                    text=location["name"],
                    size_hint =(1, None),
                    width = 100,
                    height = 30,
                    pos_hint = {"center_x" : 0.5, "center_y" : .3}
                    )
                    btn2 = Button(
                    text=location["name"],
                    size_hint =(1, None),
                    height = 30,
                    width = 100,
                    pos_hint = {"center_x" : 0.5, "center_y" : .3}
                    )
                    
                    
                
                    # binding the button to show the text when selected
                    btn.bind(on_release = lambda btn: self.dropdownLocation.select(btn.text))
                    btn2.bind(on_release = lambda btn2: self.dropdownLocation2.select(btn2.text))
                
                    # then add the button inside the self.dropdownLocation
                    self.dropdownLocation.add_widget(btn)
                    self.dropdownLocation2.add_widget(btn2)
                    locationDict[location["name"]] = location 
        except Exception as e:
            
            self.locationSelect.text = "Choose Location"
            self.locationSelect2.text = "Choose Location"
            self.dropdownLocation.clear_widgets()
            self.dropdownLocation2.clear_widgets()
        # create a big main button
        
        
        # show the self.dropdownLocation menu when the main button is released
        # note: all the bind() calls pass the instance of the caller
        # (here, the locationSelect instance) as the first argument of the callback
        # (here, self.dropdownLocation.open.).
        self.locationSelect.bind(on_release = self.dropdownLocation.open)
        self.locationSelect2.bind(on_release = self.dropdownLocation2.open)
        
        # one last thing, listen for the selection in the
        # self.dropdownLocation list and assign the data to the button text.
        self.dropdownLocation.bind(on_select = lambda instance, x: setattr(self.locationSelect, 'text', x))
        self.dropdownLocation2.bind(on_select=self.nextBtn)
        self.dropdownLocation2.bind(on_select = lambda instance, x: setattr(self.locationSelect2, 'text', x))
        
        
        
        self.connectScanner = Button(
            text="Next",
            size_hint =(None, None),
            width = 100,
            height = 30,
            pos_hint = {"center_x" : 0.5, "center_y" : .3}
            )
        
        
        
        
        self.connectScanner.bind(on_press=self.connectScannerFunc)
        
        
        self.window.add_widget(self.connectScanner)
        hide_widget(self.connectScanner)
        
    def nextBtn(self,e,f):
        
        if(self.locationSelect2.text !="Choose Location" and self.locationSelect.text !="Choose Location"):
            hide_widget(self.connectScanner,False)
        else:
            hide_widget(self.connectScanner)
    def connectScannerFunc(self,event):
        hide_widget(self.errorConnect)
        try:
            locationInfo["name"] = locationDict[self.locationSelect.text]["name"]
            locationInfo["objID"] = locationDict[self.locationSelect.text]["_id"]
            locationInfo["entrance"] = locationDict[self.locationSelect2.text]["name"]
        except:
            pass
        hide_widget(self.connectScanner)
        hide_widget(self.locationSelect)
        hide_widget(self.buildingSelect)
        hide_widget(self.buildingSelectTitle)
        hide_widget(self.buildingSelectTitle2)
        hide_widget(self.locationSelect2)
        dropdownScanner = DropDown()
        device_list = list_ports.comports()
        port= None;
        for device in device_list:
            scannerDict[device.description] = device
             # Adding button in drop down list
            btn = Button(
            text=device.description,
            size_hint =(1, None),
            height = 30,
            pos_hint = {"center_x" : 0.5, "center_y" : .3}
            )
            
            btn.width = 100
            #print(len(btn.text) * 50)
        
            # binding the button to show the text when selected
            btn.bind(on_release = lambda btn: dropdownScanner.select(btn.text))
            
        
            # then add the button inside the dropdownScanner
            dropdownScanner.add_widget(btn)
            
        
        
        # create a big main button
        self.scannerSelect = Button(text="Choose Scanner",
            size_hint =(1, None),
            width = 100,
            height = 30,
            pos_hint = {"center_x" : 0.5, "center_y" : .6})
        
        # show the dropdownScanner menu when the main button is released
        # note: all the bind() calls pass the instance of the caller
        # (here, the scannerSelect instance) as the first argument of the callback
        # (here, dropdownScanner.open.).
        self.scannerSelect.bind(on_release = dropdownScanner.open)
        
        # one last thing, listen for the selection in the
        # dropdownScanner list and assign the data to the button text.
        dropdownScanner.bind(on_select = self.finalizeConfig)
        dropdownScanner.bind(on_select = lambda instance, x: setattr(self.scannerSelect, 'text', x))
        
        
        self.window.add_widget(self.scannerSelect)
        
        
        
    def finalizeConfig(self,instance,x):
        
        cfgfile = open(configfile_name, "w")
        config = configparser.ConfigParser()
        config.add_section("MongoDB")
        config.set("MongoDB", "URL", str(self.databaseURL.text))
        config.set("MongoDB", "db", self.databaseName.text)
        config.add_section("Building Info")
        config.set("Building Info","name", buildingInfo["name"])
        config.set("Building Info","objID", str(buildingInfo["objID"]))
        config.add_section("Location Info")
        config.set("Location Info","name", locationInfo["name"])
        config.set("Location Info","objID", str(locationInfo["objID"]))
        config.set("Location Info","entrance", str(locationInfo["entrance"]))
        config.add_section("Scanner Info")
        config.set("Scanner Info", "VID", '{:04X}'.format(scannerDict[self.scannerSelect.text].vid))
        config.set("Scanner Info", "PID", '{:04X}'.format(scannerDict[self.scannerSelect.text].pid))
        config.write(cfgfile)
        cfgfile.close()
        
        
        
        
        
        
        self.statusDisplay = Button(
            text="Configure",
            size_hint =(None, None),
            width = 100,
            height = 30,
            pos_hint = {"center_x" : 0.5, "center_y" : .5}
            )
        
        self.statusDisplay.bind(on_press=self.statusDisplayFunc)    
        self.window.add_widget(self.statusDisplay)
    
    def statusDisplayFunc(self,e):
        try:
            hide_widget(self.statusDisplay)
            hide_widget(self.scannerSelect)
            hide_widget(self.statusTitle,False)
            hide_widget(self.status,False)
            hide_widget(self.statusInfo,False)
            hide_widget(self.configureButton,False)
        except:
            pass
        self.mainProgram(None)
        
        
        
    def mainProgram(self,dt):
        self.window.clear_widgets()
        try:
            self.statusTitle = Label(
            text="Status:",
            size_hint =(.5, .4),
            pos_hint = {"center_x" : 0.5, "center_y" : 0.7}
            )
            self.status = Label(
                text="Offline",
                color="#F8240E",
                size_hint =(.5, .3),
                pos_hint = {"center_x" : 0.5, "center_y" : 0.6}
            )
            self.statusInfo = Label(
                text="",
                color="#F8240E",
                size_hint =(.5, .3),
                pos_hint = {"center_x" : 0.5, "center_y" : 0.5}
            )
            self.configureButton = Button(
                text="Configure",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.8, "center_y" : 1}
                )
            
            self.configureButton.bind(on_press=self.configureApp)
            
            self.startButton = Button(
                text="Start",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.2, "center_y" : 1}
                )
            
            self.startButton.bind(on_press=self.mainProgram)
            
            self.stopButton = Button(
                text="Stop",
                size_hint =(None, None),
                width = 100,
                height = 30,
                pos_hint = {"center_x" : 0.2, "center_y" : 1}
                )
            
            
            self.window.add_widget(self.statusTitle)
            self.window.add_widget(self.status)
            self.window.add_widget(self.statusInfo)
            self.window.add_widget(self.configureButton)
            self.window.add_widget(self.startButton)
            self.window.add_widget(self.stopButton)
            hide_widget(self.stopButton)
            hide_widget(self.statusInfo)
        except:
            pass
        hide_widget(self.startButton)
        try:
            hide_widget(self.menuButton)
        except:
            pass
        hide_widget(self.stopButton, False)
        hide_widget(self.statusInfo,False)
        
        try:
            
            config = configparser.RawConfigParser(allow_no_value=True)
            config.read(configfile_name)
            
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
            if(port == None):
                return -1
            try:
                self.ser.close()
            except:
                pass
            self.ser = serial.Serial(port, 19200, timeout = 0)
            self.status.text = "Online"
            self.status.color = "#09FB47"
            self.statusInfo.text = self.locationName + "," + self.buildingName
            self.statusInfo.color = "#09FB47"
            
            self.scanningLoop = Clock.schedule_interval(self.activeScanning, 0.1)
            
            self.stopButton.bind(on_press=self.innerLoop)
        except Exception as e:
            print(e)
            return -1
    
    # def activeScanning(self,db,buildingObjID,buildingName,locationObjID,locationName,ser):
    def activeScanning(self,dt):
        
        try:
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
        except Exception as e:
            print(e)
            print("disconnected")
            self.scanningLoop.cancel()
def hide_widget(wid, dohide=True):
    if hasattr(wid, 'saved_attrs'):
        if not dohide:
            wid.height, wid.size_hint_y, wid.opacity, wid.disabled = wid.saved_attrs
            del wid.saved_attrs
    elif dohide:
        wid.saved_attrs = wid.height, wid.size_hint_y, wid.opacity, wid.disabled
        wid.height, wid.size_hint_y, wid.opacity, wid.disabled = 0, None, 0, True    
        

        
        
        
        
       

if __name__ == "__main__":
    #test = mainProgram()
    ANB_ScannerApp().run()
    