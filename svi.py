import csv
import json


#oldes and youngest
#highest unemployeement
#highest education and lowest
#densist and least dense
#most dropout
def getGeoIds():
    csvReader = csv.reader(open("R12767342_SL140.csv", "rb"))
    for row in csvReader:
         ##print row
         header = row
         sviColumn  = header.index("Geo_FIPS")
         ##print sviColumn
         break
    ids = []
    for row in csvReader:
         value = row[sviColumn]
         ids.append(value)
    print ids
    
    
def getNYC():
    csvReader = csv.reader(open("SVI2018_US.csv", "rb"))
    csvWriter = csv.writer(open("nyc_tracts_svi.csv","w"))
    
    for row in csvReader:
         print row
         header = row
         csvWriter.writerow(row)
         ##print sviColumn
         break
    counties =["Queens","Kings","New York","Richmond","Bronx"]
    
    
    for row in csvReader:
        state = row[2]
        countySt = row[3]
        county = row[4]
        if county in counties and state == "NY":
            #print state, countySt, county
            csvWriter.writerow(row)

#getNYC()

topTenCats = ["E_TOTPOP", 'EP_POV', 'EP_UNEMP', 'EP_PCI', 'EP_NOHSDP', 'EP_AGE65', 'EP_AGE17', 'EP_DISABL', 'EP_SNGPNT', 'EP_MINRTY', 'EP_LIMENG', 'EP_MUNIT', 'EP_MOBILE', 'EP_CROWD', 'EP_NOVEH', 'EP_GROUPQ', 'EP_UNINSUR']

def getTopTen():
    csvReader = csv.reader(open("nyc_tracts_svi.csv","rb"))
    for row in csvReader:
        print row
       ## for r in row:
       ##     if r.split("_")[0]=="EP":
       ##         topTenCats.append(r)
        break
    for row in csvReader:
        
    
getTopTen()