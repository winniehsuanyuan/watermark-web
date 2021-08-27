set -e
npm install
npm run build 
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/winniehsuanyuan/watermark-web.git master:gh-pages
cd -
