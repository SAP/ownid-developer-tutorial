#!bin/sh

echo Docs deployment
S3PATH=s3://docs.ownid.com/
aws s3 cp ./dist $S3PATH --recursive
aws cloudfront create-invalidation --distribution-id E25NCPE35JIYLI --paths "/*"
