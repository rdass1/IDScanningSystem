from logging import exception
import os, sys
import serial
import time
from serial.tools import list_ports
from pymongo import MongoClient
from datetime import datetime
from pprint import pprint
from bson.objectid import ObjectId


scanner = {
    "location": "front-desk",
    "building": "mainBuilding",
    "VID": "0525",
    "PID": "A4A7"
}



client = MongoClient("mongodb+srv://access01:access01@cluster0.9mxcz.mongodb.net/id_scanning_database?retryWrites=true&w=majority")
db=client["id_scanning_database"]["memberInfo"]


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
        if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 10:
            print(line)
            
            # user = db.aggregate([
            #             {
            #                 "$match": {
            #                     "cardID": line,
            #                 }
            #             },
            #             {
            #                 "$lookup": {
            #                     "from" : "facilityUsage",
            #                     "localField" : "_id",
            #                     "foreignField": "userObjID",
            #                     "as": "logs",
            #                 }
            #             },{
            #                 "$addFields": {
            #                     "testing" : {
            #                         "$arrayElemAt": [
            #                                             {
            #                                                 "$filter": {
            #                                                     "input": "$logs.logs",
            #                                                     "as": "log",
            #                                                     "cond": {
            #                                                         # "$eq": [ "$$log._id", ObjectId('624a4e46df77d99f892d7f15')]
            #                                                         "$match": {
            #                                                                 "$$log": {
            #                                                                 "$elemMatch": {
            #                                                                     "locationObjID": ObjectId('624149564def087a29e442cc'),
                                                                                
            #                                                                 }
            #                                                                 }
            #                                                             }
            #                                                     }
            #                                                 }
            #                                             }, 0
            #                                         ]
            #                     }
            #                 }
            #             },
            #             {"$unwind": { "path": "$logs", "preserveNullAndEmptyArrays": True }},
            #             {"$project": {"cardID": 1, "logs" : "$testing"}}, 
            #                     #"logs": {"$slice" : [{"$reverseArray": "$testing"},0,500]}
            #             ])
            # logs = list(user)[0]["logs"]
            # pprint(logs)
            
            me2 = db.update_one({"cardID":line},[{"$set":{"status.active":{"$not":"$status.active",}}},{"$set" : {"status.updatedAt":datetime.now()}}]);
            
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
