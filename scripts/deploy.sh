#!bin/sh

ENV=$1
DISTRIBUTIONID=$2

echo Docs deployment...
S3PATH=s3://docs.$ENV.ownid.com
aws s3 cp ./dist $S3PATH --recursive
aws cloudfront create-invalidation --distribution-id $DISTRIBUTIONID --paths "/*"
