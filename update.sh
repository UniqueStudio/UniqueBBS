cd ~/BBS_Front/ && sudo docker cp ./ 6ddd8a5a2d24:/var/www && sudo docker restart 6ddd8a5a2d24
cd ~/BBS_Back/ && sudo docker cp ./ 32271e5163d2:/usr/src/app/output && sudo docker restart 32271e5163d2