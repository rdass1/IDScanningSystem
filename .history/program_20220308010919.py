import os, sys
import serial
import psycopg2
import time
from serial.tools import list_ports

#open database
conn = psycopg2.connect(
    host = "104.194.96.37",
    port = "25566",
    database = "id_database_system",
    user = "access01",
    password = "access01")

cur = conn.cursor()

# print('PostgreSQL database version:')
# cur.execute('SELECT * FROM memberInfo.member;')
# db_version = cur.fetchall()
# print(db_version)
# print(db_version[0])
# print(db_version[1])
# cur.close()



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
            $print(line)
            cur = conn.cursor()
            command = "SELECT * FROM memberInfo.member WHERE id = '%s';" % (line)
            print(command)
            cur.execute(command)
            print(cur.rowcount)
            output = cur.fetchall()
            
            print(output)
            cur.close()
    except:
        pass
    