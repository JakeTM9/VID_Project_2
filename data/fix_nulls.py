import csv

# options YYYY-MM-DD of MM/DD/YYYY

file = open('processed.csv')

csvreader = csv.reader(file)
header = []
rows = []
header = next(csvreader)
for row in csvreader:
    for i in range(len(row)):
        if row[i] == '':
            row[i] = 'null'
    try:

        if row[33] == 'null':
            # print(row[33])
            if row[34] != 'null':
                row[33] = str(row[34]) + '-01-01'    
        
        if '-' in row[33]:
            tmp = row[33].split('-')
            if tmp[1] == '00':
                tmp[1] = '01'
            if tmp[2] == '00':
                tmp[2] = '01'
                
            row[33] = tmp[0] + '-' + tmp[1] + '-' + tmp[2]  
           
        elif '/' in row[33]:
            tmp = row[33].split('/')
            if tmp[1] == '00':
                tmp[1] = '01'
            if tmp[0] == '00':
                tmp[0] = '01'
                
            row[33] = tmp[2] + '-' + tmp[0] + '-' + tmp[1]        
        
        # print(row[33])
    except:
        print ("error")
        
    rows.append(row)
    
    
for i in rows:
    print (i)

file.close()


# COMMENTED OUT INCASE SOMEONE RERUNS IT
# with open("processed_fixed.csv", 'w', newline="") as f:
#     csvwriter = csv.writer(f) # 2. create a csvwriter object
#     csvwriter.writerow(header) # 4. write the header
#     csvwriter.writerows(rows) # 5. write the rest of the data
