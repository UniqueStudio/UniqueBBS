# UniqueBBS

## What is this?

UniqueBBS is a modern BBS writen with `vue suite` and `prisma`.

This is going to be used in HUST UniqueStudio as internal tool to improve experience of writing daily / weekly report, wiki, document and in-studio discusion.

## How to deploy?

1.  You will need docker-compose to do this deployemnt.
2.  use git to clone this project into you local disk.
3.  touch a `.env` file in the root dir of this project.
4.  Fill this `.env` file with content like below.

    ```
    SECRET=XXXXXXXX
    WXMSGTOKEN=XXXXXXXX
    WXMSGAESKEY=XXXXXXXX
    APPID=XXXXXXXX
    WXSECRET=XXXXXXXX
    AGENTID=XXXXXXXX
    ```

    SECRET is the salt of password, you should pick a complex one.

    WXMSGTOKEN, WXMSGAESKEY are token and key of Work Wechat push.

    APPID, WXSECRET, AGENTID are token and key of Work Wechat login.

5.  run `docker-compose build` to build images.
6.  run `docker-compose up -d` to run this BBS in daemon.
7.  You will get this BBS exposed at port **7010** on you machine, then you can reverse proxy this port use Nginx or Caddy to serve it.
