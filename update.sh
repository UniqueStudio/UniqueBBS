cd ~/BBS_Front/ && sudo docker cp ./ 57c161e37041:/var/www && sudo docker restart 57c161e37041
cd ~/BBS_Back/ && sudo docker cp ./ f3d1541faf43:/usr/src/app/output && sudo docker restart f3d1541faf43