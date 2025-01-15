echo 'clean && build web project'
yarn build --output-path=dist/pdf --base-href=/pdf/

echo 'copy web project to web server'
scp -r dist/pdf root@39.106.132.159:/usr/share/nginx/





scp -r src/privacy_pdf.html root@39.106.132.159:/usr/share/nginx/file-page/


