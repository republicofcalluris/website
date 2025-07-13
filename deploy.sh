# Please mark this as executable. Use chmod +x deploy.sh.

# Uses github.com/sueszli/notionSnapshot.
python notionsnapshot https://calluris.notion.site/Homepage-21dee5fab98b80068b13dca395c45dd0
npx netlify-cli deploy --site XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --dir=./snapshots/homepage --prod --no-build
