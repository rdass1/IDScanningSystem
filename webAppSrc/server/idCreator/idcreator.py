from distutils.log import error
from PIL import Image, ImageDraw, ImageFont, ImageOps
import qrcode
import random
import sys
import json
from datetime import datetime
from os.path import exists
import time

blankIDCardFront = "./server/idCreator/Slide1.PNG"  # Link to the template of the front side of the ID
blankIDCardBack = "./server/idCreator/Slide2.PNG"    # Link to the template of the back side of the ID
IDCARD_WIDTH = 1020 # Constant pixel width of an ID Card
IDCARD_HEIGHT = 685 # Constant pixel height of an ID Card 
fontFile = "./server/idCreator/Calibri Regular.ttf"                # Link to text file that will be used on the ID card
# Note that the template should have a height of a multiple of: 205 for best effects
# Note that the template should have a width of a multiple of: 325 for best effects

def create_cardfront(holder_name, holder_id, holder_role, holder_ISS, holder_DOB, holder_gender, holder_pronouns, holder_height, holder_eyecolor, holder_haircolor, quote, holder_pic):
    template = Image.open(blankIDCardFront) # Opens the template of the ID card
    picTopLeft = [int(template.width*(15/325)), int(template.height*(60/205))]   # sets the top left of the picture to (x,y) cooridnates
    picBotRight = [int(template.width*(130/325)), int(template.height*(176/205))]    # sets the bottom right of the picture to (x,y) coordinates
    dx = picBotRight[0] - picTopLeft[0] # Find the difference between the bottom and top coordinate
    dy = picBotRight[1] - picTopLeft[1] # Find the difference between the right and left coordinate
    temp_pic = Image.open("./server/idCreator/johndoepic.jpg")
    try:
        if(exists(holder_pic)):
            time.sleep(1)
            temp_pic = Image.open(holder_pic).convert("RGB")
            temp_pic = ImageOps.exif_transpose(temp_pic)
        else:
            print("Picture doesn't exist\nCreating ID with default image...")
    except:
        print("Invalid Picture Input")
        temp_pic = Image.open("./server/idCreator/johndoepic.jpg")
    cropped_HolderPic = temp_pic
    errorMargin = cropped_HolderPic.width / cropped_HolderPic.height
    
    if(errorMargin < 1 or errorMargin > 2):
        print(errorMargin)
        if cropped_HolderPic.height > cropped_HolderPic.width:
            cropped_HolderPic = cropped_HolderPic.crop((0, cropped_HolderPic.width/4, cropped_HolderPic.width, cropped_HolderPic.height - cropped_HolderPic.width/4)) # #Make Height equal to width
        elif cropped_HolderPic.height < cropped_HolderPic.width:
            cropped_HolderPic = cropped_HolderPic.crop((cropped_HolderPic.height/4, 0, cropped_HolderPic.width- cropped_HolderPic.height/4, cropped_HolderPic.height)) # #Make Width equal to height
    id_pic = cropped_HolderPic.resize((dx, dy), Image.ANTIALIAS)   # resize the picture to the dimensions specified by the dy & dx
    template.paste(id_pic, (picTopLeft[0], picTopLeft[1], picBotRight[0], picBotRight[1]))  # place the resized image onto the area between the coordinates picTopLeft & picBotRight
    draw = ImageDraw.Draw(template) # Draw the new template.
    
    font = ImageFont.truetype(fontFile, int(template.height*(9/205))) # The fontFile is the font chosen, then the size of the font
    maxCharperLine = 69
    count = 0
    newquote = ""
    words = str.split(quote, " ")
    for word in words:
        count += len(word)
        if  count > maxCharperLine:
            newquote += "\n"
            count = 0
        newquote += word + " "
    draw.text((int(template.width*(15/325)),int(template.height*(180/205))), newquote, fill='black', font=font)

    font = ImageFont.truetype(fontFile, int(template.height*(12/205))) # The fontFile is the font chosen, then the size of the font
    lstCardInfo = [holder_name, # The holder name
                   holder_id,   # The holder's id
                   holder_role, # The holder's role
                   "ISS: " + holder_ISS,    # The issue date of the ID
                   "DOB: " + holder_DOB,    # The holder's date of birth
                   "GENDER: " + holder_gender,  # The holder's gender
                   "PRONOUNS: " + holder_pronouns,  # The holder's pronouns
                   "HGT: " + holder_height, # The holder's height
                   "EYES: "+ holder_eyecolor,   # The holder's eye color
                   "HAIR: " + holder_haircolor] # The holder's hair color
    coordX_cardInfo = int(template.width*(140/325))   # Starting point for column 1 of the cardInfo as a X coordinate
    coordY_cardInfo_start = int(template.height*(60/205))  # Starting point for the cardInfo as a Y coordinate
    coordY_cardInfo_inc = int(template.height*(17/205))    # The spacing between each line of text
    lstCardBlanks = ["", # List of blank statements (null string)
                    "ISS: ", # ISS was left as a null string
                    "DOB: ", # DOB was left as a null string
                    "GENDER: ", # Gender was left as a null string
                    "PRONOUNS: ",   # Pronouns was left as a null string
                    "HGT: ",    # Height as a null string
                    "EYES: ",   # Eye color as a null string
                    "HAIR: "]   # Hair color as a null string
    coordY_cardInfo_current = coordY_cardInfo_start
    for ele in lstCardInfo:
        isBlank = False
        for con in lstCardBlanks:
            if(ele == con):
                isBlank = True
                break
        if not isBlank:
            draw.text((coordX_cardInfo, coordY_cardInfo_current), ele, fill='black', font=font)   # Writes each line of text on the ID card
            coordY_cardInfo_current += coordY_cardInfo_inc    # increments the current y-coordinate by the coordY_cardInfo
        if coordY_cardInfo_current >= coordY_cardInfo_start + 7*coordY_cardInfo_inc:
            coordX_cardInfo = int(template.width*(230/325))
            coordY_cardInfo_current = int(template.height*(94/205))

    myFill = "#FFFFFF"   # Color fill initially white
    if holder_role == "Patient":
        myFill = "#FE6100"          # Orange
    elif holder_role == "Alumni":
        myFill = "#DC267F"          # Pink
    elif holder_role == "Employee":
        myFill = "#648FFF"          # Blue
    elif holder_role == "Admin":
        myFill = "#648FFF"          
    elif holder_role == "Volunteer":
        myFill = "#785EF0"          # Purple
    else:
        print("Invalid Role")
    draw.rectangle([(0, 0),(int(template.width*(12/325)), int(template.height))], fill=myFill) # Draws the rectangle to indicate which role the user is
    
    return template # Returns the edited card

def create_cardback(id):
    template = Image.open(blankIDCardBack)  # Opens the template of the ID card
    qrTopLeft = [template.width*(18/325), template.height*(8/205)]   # Specifies the top left coordinates of the QR code
    qrBotRight = [template.width*(132/325), template.height*(122/205)] # Specifies the bottom right coordinate of the QR code
    dx = int(qrBotRight[0]) - int(qrTopLeft[0])   # Find the difference between the right and left points
    dy = int(qrBotRight[1]) - int(qrTopLeft[1])   # Find the difference between the bottom and top points
    qr = qrcode.QRCode(error_correction=qrcode.ERROR_CORRECT_H, box_size=15, version=1, border=2)   # creates a QR code
    qr.add_data(id) # Adds the id card's information to the QR code
    qr.make(fit=True)
    qrimg = qr.make_image(fill_color="black", back_color="white").resize((int(dx), int(dy)))  # sets the qrcode's image to white and black
    pos = (int(qrTopLeft[0]), int(qrTopLeft[1]), int(qrBotRight[0]), int(qrBotRight[1]))    # places the qr code's position to the points qrTopLeft & qrBotRight
    template.paste(qrimg, pos)  # pastes the qr code's image on the id card

    draw = ImageDraw.Draw(template) # Draw the new template.
    text_Lost = "If lost return to:\n    2942 W Lake Street\n    Chicago, IL, 60612\nor Call:\n    (773)940-2960\nduring normal business hours."
    text_HIPAA = "Above and Beyond Family Recovery Center presents this\ninformation as it is recorded in our Electronic Health Record\nHIPAA Compliant Federally Mandated Licensing Requirement\nand bears no responsibility as to any accuracy of content. Call\n773.690.2960 for further assistance during normal business\nhours."
    font = ImageFont.truetype(fontFile, int(template.height*(14/205)))
    draw.text((int(template.width*(150/325)),int(template.height*(28/205))), text_Lost, fill='black', font=font)
    font = ImageFont.truetype(fontFile, int(template.height*(12/205)))
    draw.text((int(template.width*(10/325)),int(template.height*(130/205))), text_HIPAA, fill='black', font=font)

    return template

def saveFrontID(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic, save_locale):
    idcard = create_cardfront(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic) # Creates the front side of the ID card
    idcard.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    idcard.save(save_locale)    # Saves the front side of the ID card to a specified location

def saveBackID(id, save_locale):
    idcard = create_cardback(id) # creates the front side of the ID card
    idcard.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    idcard.save(save_locale)     # Saves the back side of the ID card to a specified location

def saveID(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic, save_frontlocale, save_backlocale):
    saveFrontID(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic, save_frontlocale) # creates and saves the front side of the ID card
    saveBackID(id, save_backlocale) # creates and saves the back side of the ID card

def randomQuote():
    lst_quote = ["",
            "“Insanity is doing the same thing, over and over again, but expecting different results.” ―Narcotics Anonymous",
            "“It's not recovery that is painful; our resistance to it is what hurts.” ―Narcotics Anonymous, Living Clean: The Journey Continues",
            "“By keeping an open mind, sooner or later, we find the help we need.” ―Narcotics Anonymous Fellowship, Narcotics Anonymous",
            "“We may not have it all together, but together we can have it all!” -Wookiefoot",
            "“Success consists of going from failure to failure without loss of enthusiasm.” -Winston Churchill",
            "“Somebody has to start. Somebody has to step forward and do what is right, because it is right.” -Kaladin, in The Way of Kings by Brandon Sanderson",
            "“I am an immigrant to reality.” -Author unknown",
            "“The world is not the problem! it's how we see it” -Author unknown",
            "“You are the sky. Everything else is just the weather.” -Pema Chodron"] # list of quotes provided by the design team that would fit on the ID card
    return lst_quote[random.randint(0,len(lst_quote)-1)]

def paperPrintableIDNew(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic):
    template = Image.new("RGB", (614,194))
    front = create_cardfront(name, id, role, issue_date, date_of_birth, gender, pronouns, height, eyecolor, haircolor, quote, pic)
    front.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    back = create_cardback(id)
    back.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    Image.Image.paste(template, front, (1,1))
    Image.Image.paste(template, back, (front.width + 2, 1))
    template.save("test.PNG")

def paperPrintableID(front, back):
    template = Image.new("RGB", (614,194))
    front.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    back.thumbnail((IDCARD_WIDTH, IDCARD_HEIGHT), Image.ANTIALIAS) # Resizes the image to the correct widths
    Image.Image.paste(template, front, (1,1))
    Image.Image.paste(template, back, (front.width + 2, 1))
    template.save("test.PNG")
    template.show()
    
#paperPrintableID(Image.open("IDCardFront.png"), Image.open("IDCardBack.png"))
#paperPrintableIDNew("John Doe", "AB0000000000", "Patient", "04/18/2022", "04/18/2022", "Male", "He/Him/His", "5'9''", "BROWN", "BLACK", randomQuote(), "johndoepic.jpg")
#saveID("Running Owl", "AB0000000031", "Patient", "4/14/2022", "4/14/2022", "Male", "He/Him/His", "1'4''", "BLACK", "WHITE", randomQuote(), "owl.jpg", "IDCardFront.png", "IDCardBack.png")
from pprint import pprint
def main():
    user = json.loads(sys.argv[1])
    
    if(user["middleName"] != ""):
        name = user["firstName"]+" " +user["middleName"]+" " + user["lastName"]
    else:
        name = user["firstName"]+" "+ user["lastName"]
    
    id= user["cardID"]
    role = user["role"]
    
    issueDateConversion = datetime.strptime(user["cardIDData"]["ISS"][:10], '%Y-%m-%d')
    issueDate = str(issueDateConversion.month) +"/"+str(issueDateConversion.day)+"/"+str(issueDateConversion.year)
    
    if(user["DOB"] != None):
        dobConversion = datetime.strptime(user["DOB"][:10], '%Y-%m-%d')
        dob = str(dobConversion.month) +"/"+str(dobConversion.day)+"/"+str(dobConversion.year)
    else:
        dob=""
    gender = user["gender"]
    pronoun = user["pronoun"]
    if(user["cardIDData"]["heightFT"] != None):
        height = str(user["cardIDData"]["heightFT"])+"'" + str(user["cardIDData"]["heightIN"])+"\""
    else:
        height = ""
    eyeColor = user["cardIDData"]["eyeColor"]
    hairColor = user["cardIDData"]["hairColor"]
    if(exists("./server/memberImages/"+user["_id"]+".png")):
        pic = "./server/memberImages/"+user["_id"]+".png"
    else:
        pic = ""
    saveLocation = "./server/memberIDImages/"+user["_id"]
    
    
    saveID(name, id, role, issueDate, dob, gender, pronoun, height, eyeColor, hairColor, randomQuote(), pic, saveLocation+"-front.png", saveLocation+"-back.png")
    #paperPrintableID(Image.open("./server/memberIDImages/"+user["_id"]+"-front.png"), Image.open("./server/memberIDImages/"+user["_id"]+"-back.png"))
    
    
    #pprint(user)

if __name__ == "__main__":
    main()
    

    