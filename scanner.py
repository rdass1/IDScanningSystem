from logging import exception
import os, sys
import serial
import time
from serial.tools import list_ports
from pymongo import MongoClient


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
            me = db.find_one({"cardID":line},{"_id":0,"cardID":1})
            me2 = db.update_one({"cardID":line},[{"$set":{"status.active":{"$not":"$status.active"}}}])
    except Exception as e:
        print(e)
        break