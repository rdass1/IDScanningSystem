from logging import exception
import os, sys
import serial
import time
from serial.tools import list_ports
from pymongo import MongoClient
from datetime import date, datetime, timedelta
from pprint import pprint
from bson.objectid import ObjectId


scanner = {
    "location": "front-desk",
    "locationObjID" : "624149564def087a29e442ec",
    "building": "Above and Beyond Main-Building",
    "buildingObjID" : "624148ef0da4f2e606e015f8",
    "VID": "067B",
    "PID": "2303"
}

#Hand held scanner
#VID: 0525 PID: A4A7

#Desktop scanner
#VID: 067B PID: 2303



client = MongoClient("mongodb+srv://access01:access01@cluster0.9mxcz.mongodb.net/id_scanning_database?retryWrites=true&w=majority")
db=client["id_scanning_database"]


device_list = list_ports.comports()
port= None;
for device in device_list:
    if (device.vid != None or device.pid != None):
        if ('{:04X}'.format(device.vid) == scanner["VID"]and
            '{:04X}'.format(device.pid) == scanner["PID"]):
            port = device.device
            break
        port = None
if(port == None):
    quit();
ser = serial.Serial(port, 19200, timeout = 0)
while True:
    
    try:
        line = ser.readline().decode()
        line = line[:12]
        if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 10:
            print(line)
            
            user = db["memberInfo"].aggregate([
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
                                            "buildingObjID": ObjectId(scanner["buildingObjID"]),
                                            "locationObjID": ObjectId(scanner["locationObjID"])
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
            userObj= list(user)[0]
            # userObj["logs"] = userObj["logs"][::-1]
            #pprint(userObj["logs"])
            
           
            updateUser = db["memberInfo"].update_one({"cardID":line},[{"$set":{"status.active":{"$not":"$status.active",}}},{"$set" : {"status.updatedAt":datetime.now()}}]);
            
            if(len(userObj["logs"]) > 0 and userObj["logs"][0]["timeOut"] == ""):
                
                timeIn = userObj["logs"][0]["timeIn"]
                timeDelta = datetime.now() - timeIn
                print(timeDelta)
                updateLog = db["facilityUsage"].update_one({"_id" : userObj["logs"][0]["_id"]},[
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
                    "locationObjID" : ObjectId(scanner["locationObjID"]),
                    "locationBuilding" : scanner["location"]+", "+scanner["building"],
                    "buildingObjID" : ObjectId(scanner["buildingObjID"]),
                    "timeIn" : datetime.now(),
                    "timeOut" : "",
                    "timeTotal" : ""
                    
                }
                createLog = db["facilityUsage"].insert_one(log)
            
    except Exception as e:
        print(e)
        break
    

    
    # 
    #                 "$lookup" : {
    #                     "from" : "facilityUsage",
    #                     "localField": "_id",
    #                     "foreignField": "userObjID",
    #                     "as" : "logs"
    #                 }
    #             },
    #             {
    #                 "$sort" : {
    #                     "$logs.date" : "-1"
    #                 }
    #             },
    #             {
    #                 "$cond" : {
    #                     "if" : {"$eq":["$logs"]}
    #                 }
    #             }
