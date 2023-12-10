from fastapi import FastAPI, status, Response
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import midtransclient
import datetime
import serial
import time
import cv2
import numpy as np
import os
import logging
import sys
try:
    # This module only available in raspbian (Raspberry PI OS)
    from picamera import PiCamera
except:
    pass


app = FastAPI()
logger = logging.getLogger(__name__)

def detect(img_path,weight):
    global classes, classid
    net = cv2.dnn.readNet(weight, ".\dummy_data\yolov4-tiny-obj.cfg")
    classes = ['1000','2000','5000','invalid']
    
    model = cv2.dnn_DetectionModel(net)
    model.setInputParams(size=(416,416), scale=1/255, swapRB=True)

    img = cv2.imread(img_path)

    kelas, skor, boks = model.detect(img, 0.5 , 0.5)
    for (classid, score, box) in zip(kelas, skor, boks):
        label = "%s : %f" % (classes[classid], score)
        print(label)
    
    return classes[classid]

origins = [
    "http://localhost:3000",
    "https://app.sandbox.midtrans.com",
    "http://localhost:3000/Menu",
    "http://mobile-vending-machine-ui",
    "http://mobile-vending-machine-ui/Menu"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods=["*"],
    allow_headers=["*"],
)

prod_server_key='Mid-server-'

class transaction_details(BaseModel):
    gross_amount: Optional[int]
    name: str
    id: Optional[str]
    price: int
    quantity: int

class LED(BaseModel):
    product: str

@app.post("/pay")
def Pay(param: transaction_details):
    '''
        Endpoint to display payment information using midtrans API
    '''
    date = str(datetime.datetime.now())
    specialChars = "- :" 
    for specialChar in specialChars:
        date = date.replace(specialChar, '')

    snap = midtransclient.Snap(
	    # Set to true if you want Production Environment (accept real transaction) and change serverkey to prod_server_key.
	    is_production = False,
	    server_key='SB-Mid-server-zpWsKHJ9Bj7EPVqUYVjGo_4H'
    )
    param = {
	    "transaction_details": {
	        "order_id": date[:-7],
	        "gross_amount": param.price * param.quantity
	    }, 
        "credit_card":{
	        "secure" : True
	    },
        
        "item_details": [{
            "id": "ITEM",
            "price": param.price,
            "quantity": param.quantity,
            "name": param.name,
        }],
    }
    transaction =  snap.create_transaction(param)
    return transaction

@app.post("/SendFlag")
def Kirim(cmd: LED):
    '''
        Endpoint to send command to arduino controller 
    '''
    try:
        # Sending command to arduino
        ser = serial.Serial('COM13', 9600,)
        x = cmd.product.encode(encoding="ascii",errors="ignore")
        time.sleep(2)
        ser.write(x)
        
        return cmd
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        msg = f"Error {exc_type.__name__}: {err} in line {exc_tb.tb_lineno}"
        logger.error(msg)
        return status.HTTP_500_INTERNAL_SERVER_ERROR

@app.post("/CheckAvailable")
def Check():
    '''
        endpoint to check the availability of each beverage by reading sensor data from arduino.
    '''
    try:
        
        # # Reading sensor value from arduino in port COM13
        # ser = serial.Serial('COM13', 9600)
        # Incoming = []
        # data = []
        # i = 0
        # Bevs = ["teh", "kopi", "soda"]

        # time.sleep(2)
        # ser.write(b'T')

        # Incoming.append(ser.read())
        # while Incoming[i] != b'~':
        #     Incoming.append(ser.read())
        #     i += 1

        # j = 0
        # for d in Incoming:
        #     if d == b'$' or d == b'~':
        #         continue
        #     else:
        #         if d == b'Y':
        #             d = True
        #             data.append((Bevs[j],d))
        #         else:
        #             d = False
        #             data.append((Bevs[j],d)) 
        #     j += 1    
        # new_data = [item for sublist in data for item in sublist]
        
        # Object = {new_data[i]: new_data[i + 1] for i in range(0, len(new_data), 2)}
        
        # For demonstration purposes the data will be pre-defined
        Object = {'teh': True, 'kopi': True, 'soda': False, 'sirup': True}

        return Object
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        msg = f"Error {exc_type.__name__}: {err} in line {exc_tb.tb_lineno}"
        logger.error(msg)
        return status.HTTP_500_INTERNAL_SERVER_ERROR

@app.post("/Tunai")
def Tuna(param: transaction_details, response: Response):
    '''
        This endpoint will be used when user want to pay using cash. It will capture the inserted banknote
        and validate it by using YOLOV4 pre-trained weight. The weight is result of training YOLOV4 model
        with labeled pictures of rupiah banknote.
    '''
    try:
        # ser = serial.Serial('COM6', 9600)
        # os.system("sudo /etc/init.d/motion stop")
        # camera = PiCamera()
        # w1 = "/home/pi/Detection/yolov4-tiny-obj_best.weights"
        # w2 = "/home/pi/Detection/yolov4-tiny-UV.weights"
        # cap1 = '/home/pi/Detection/cap1.jpg' # Image filename for rupiah banknote
        # cap2 = '/home/pi/Detection/cap2.jpg' # Image filename for UV rupiah banknote

        # camera.start_preview()
        # time.sleep(2)
        # ser.write(b'c')
        # camera.capture(cap1)
        # camera.stop_preview()
        # ser.write(b's')
        
        # camera.start_preview()
        # time.sleep(2)
        # ser.write(b'u')
        # camera.capture(cap2)
        # camera.stop_preview()
        # ser.write(b's')

        if os.path.exists('tempPay.txt'):
            with open("tempPay.txt",'r') as file:
                param.price = int(file.read())

        w3 = ".\dummy_data\yolov4-tiny-obj_final_biasa.weights"
        w4 = ".\dummy_data\yolov4-tiny-UVNew.weights"

        def detect(weight,imPath):
            global class_names,kelas,skor,boks
            YOLOnet = cv2.dnn.readNet(weight, ".\dummy_data\yolov4-tiny-obj.cfg")
            class_names = [1000,2000,5000,10000,'invalid']

            model = cv2.dnn_DetectionModel(YOLOnet)
            model.setInputParams(size=(416,416), scale=1/255, swapRB=True)

            white = (255,255,255)
            black = (0,0,0)
            red = (0,255,0)

            img = cv2.imread(imPath)
            kelas, skor, boks = model.detect(img, 0.5, 0.9)

            if len(kelas) == 0:
                kelas = [4]
                skor = [100]
                maxbox = np.array([1,1,1,1])
            else:
                maxbox = boks[np.where(skor==max(skor))].flatten()


            label = "%s : %f" % (class_names[max(kelas)],max(skor))
            print(label)

            cv2.rectangle(img, maxbox, (0,255,0), 5)
            cv2.putText(img, label, (maxbox[0], maxbox[1]-14), cv2.FONT_HERSHEY_COMPLEX, 4, red, 3)

            fname = os.path.basename(imPath)
            cv2.imwrite("Result_"+fname,img)

            return class_names[max(kelas)], max(skor), label
        
        # Kelas1, Acc1, lebal1 = detect(w3,cap1) # This will use the captured image
        Kelas1, Acc1, lebal1 = detect(w3,r".\dummy_data\1kNormal.jpg") # For demonstartion purpose will be using precaptured image
        if Kelas1 == 'invalid':
            obj = {"Status": False, "Text":"INVALID", "Detected":lebal1}
            response.status_code = status.HTTP_202_ACCEPTED
            return obj
        
        # Kelas2, Acc2, lebal2 = detect(w4,cap2)# This will use the captured uv image
        Kelas2, Acc2, lebal2 = detect(w4,r".\dummy_data\1kUV.jpg") # For demonstartion purpose will be using precaptured image
        if Kelas2 == 'invalid':
            obj = {"Status": False, "Text":"INVALID", "Detected":lebal2}
            response.status_code = status.HTTP_202_ACCEPTED
            return obj

        if Kelas1 != Kelas2:
            obj = {"Status": False, "Text":"INVALID", "Detected":[lebal1, lebal2]}
            response.status_code = status.HTTP_202_ACCEPTED
            return obj

        Price_Remaining = param.price - Kelas2

        # If required payment already met, delete the temporary payment data.
        if Price_Remaining > 0:
            obj = {"PaymentStatus": False, "Text":"Kurang", "Total": Price_Remaining, "Detected":[lebal1, lebal2]}
            response.status_code = status.HTTP_202_ACCEPTED
            # Record the remaining required payment in a file.
            with open("tempPay.txt",'w') as f:
                f.write(str(Price_Remaining))
            return obj

        elif Price_Remaining == 0:
            obj = {"PaymentStatus": True, "Text":"Pas", "Detected":[lebal1, lebal2]}
            response.status_code = status.HTTP_200_OK
            # If the amount of money is already met, delete the temporary payment data.
            if os.path.exists('tempPay.txt'):
                os.remove("tempPay.txt")
            return obj

        elif Price_Remaining < 0:
            obj = {"PaymentStatus": False, "Text":"Lebih", "Detected":[lebal1, lebal2]}
            response.status_code = status.HTTP_202_ACCEPTED
            return obj

        obj = {"Status": True, "Text":"Uang Diterima Semua", "Detected":[lebal1, lebal2]}

        return obj

        

    except Exception as e:
        print(e)
        return False