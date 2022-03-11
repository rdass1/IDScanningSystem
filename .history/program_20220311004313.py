from logging import exception
import os, sys
import serial
import psycopg2
import psycopg2.extras
import time
from serial.tools import list_ports



scanner = {
    "location": "front-desk",
    "building": "mainBuilding",
    "VID": "0525",
    "PID": "A4A7"
}



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





device_list = list_ports.comports()
for device in device_list:
    if (device.vid != None or device.pid != None):
        if ('{:04X}'.format(device.vid) == scanner["VID"]and
            '{:04X}'.format(device.pid) == scanner["PID"]):
            port = device.device
            break
        port = None
ser = serial.Serial(port, 19200, timeout = 0)
while True:
    
    try:
        line = ser.readline().decode()
        if len(line) > 0 and line.startswith("AB",0,2) and line[2:].isdigit() and len(line[2:]) == 10:
            # print(line)
            cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
            command = "SELECT * FROM memberInfo.member WHERE id = '%s';" % (line)
            #print(command)
            cur.execute(command)
            #print(cur.rowcount)
            currentUser = cur.fetchone()
            cur.execute("SELECT * FROM memberInfo.activeMember WHERE uid = '%s'",(currentUser['uid'])
            output = cur.fetchone()
            print(currentUser)
            if (output != None):
                if(output['active']==False):
                    command1 = "UPDATE memberInfo.activeMember SET active = TRUE WHERE uid = '%s';" % (output['uid'])
                else:
                    command1 = "UPDATE memberInfo.activeMember SET active = FALSE WHERE uid = '%s';" % (output['uid'])
                # print(output)
                print(output['uid'])
                print(command1)
                cur.execute(command1)
                conn.commit()
            else:
                # cur.execute("INSERT INTO memberInfo.activeMember (uid,id,active,building) VALUES ('%s','%s','%s','%s');",(currentUser['uid'],currentUser['id'],"True",scanner["building"]))
                print("added")
            cur.close()
    except Exception as e:
        print(e)
        pass


