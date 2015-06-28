import time
import commands
import re
import smtplib

####--[CONFIGURATION]
server = 'smtp.gmail.com' #smtp server address
server_port = '587' #port for smtp erver

#########################################################
#################### BEGIN EDIT HERE ####################
#########################################################

username = '' #gmail account
password = '' #password for that gmail account
fromaddr = '' # address to send from (gmail)
toaddr = '' #address to send IP to


#########################################################
#################### STOP EDIT HERE #####################
#########################################################

message = 'Howdy! Your Raspberry Pi IP address: ' #message that is sent
####--[/CONFIGURATION]

#the interface may be wifi and it needs time to initialize
#so wait a little bit before parsing ifconifg
time.sleep(30)

#extract the ip address (or addresses) from the ifconfig
found_ips = []
ips = re.findall( r'[0-9]+(?:\.[0-9]+){3}', commands.getoutput("/sbin/ifconfig"))
for ip in ips:
  if ip.startswith("255") or ip.startswith("127") or ip.endswith("255"):
    continue
  found_ips.append(ip)

message += ", ".join(found_ips)
headers = ["From: " + fromaddr,
           "To: " + toaddr,
           "Subject: PI IP",
           "MIME-Version: 1.0",
           "Content-Type: text/html"]
headers = "\r\n".join(headers)

server = smtplib.SMTP(server + ':' + server_port)  
server.ehlo()
server.starttls()  
server.ehlo()
server.login(username,password) #insert your gmail account username and password
server.sendmail(fromaddr, toaddr, headers + "\r\n\r\n" +  message)  
server.quit()
