#! /bin/bash


docker build --target production -t ezzefiohez/finance-earnings .

docker push ezzefiohez/finance-earnings

echo " ######## BUILD EARNINGS DONE ######## "

curl  -X POST http://146.59.195.214:9000/api/webhooks/ad19ef25-5119-4241-b8ed-61a57ceeb33f
