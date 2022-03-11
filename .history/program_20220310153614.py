from logging import exception
import os, sys
import serial
import psycopg2
import psycopg2.extras
import time
from serial.tools import list_ports



#open database
conn = psycopg2.connect(
    host = "104.194.100.20",
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
print(port)
ser = serial.Serial(port, 19200, timeout = 0)
while True:
    line = ser.readline().decode()
    if len(line) > 0:
        print(ser.readline().decode())
# while True:
#     try:
#         line = ser.readline().decode()
#         print(line)
#         if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 10:
            
#             cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
#             command = "SELECT * FROM memberInfo.member WHERE id = '%s';" % (line)
#             #print(command)
#             cur.execute(command)
#             #print(cur.rowcount)
#             output = cur.fetchone()
#             if (output != None):
#                 print(output)
#                 print(output['uid'])
            
#             cur.close()
#     except:
#         print("exception")
#         pass

