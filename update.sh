cd ~/BBS_Front/ && sudo docker cp ./ dc88e884abe5:/var/www && sudo docker restart dc88e884abe5
cd ~/BBS_Back/ && sudo docker cp ./ 14c1073aaf2f:/usr/src/app/output && sudo docker restart 14c1073aaf2f