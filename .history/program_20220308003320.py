import os, sys
import serial
import time
from serial.tools import list_ports

#open database
conn = psycopg2.connect("dbname=suppliers user=postgres password=postgres")




VID = "0525"
PID = "A4A7"

device_list = list_ports.comports()
for device in device_list:
    if (device.vid != None or device.pid != None):
        if ('{:04X}'.format(device.vid) == VID and
            '{:04X}'.format(device.pid) == PID):
            port = device.device
            break
        port = None

ser = serial.Serial(port, 19200, timeout = 0)
while True:
    try:
        line = ser.readline().decode()
        if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 7:
            print(line)
    except:
        pass
    