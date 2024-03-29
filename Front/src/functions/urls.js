const url = new URL(window.location.href);

const domain = "https://back.bbs.hustunique.com/api/";
// const domain = "http://localhost:7010/api/";

const socket = domain.replace(/^http/i, "ws");
const urls = {
    domain: `${domain}`,
    login: `${domain}user/login/pwd`,
    myInfo: `${domain}user/my/info`,
    userPosts: (uid, page) => `${domain}user/posts/${uid}/${page}`,
    updateMyInfo: `${domain}user/update/normal`,
    updateMyPwd: `${domain}user/update/pwd`,
    syncWxInfo: `${domain}user/update/wx`,
    forumList: `${domain}forum/list`,
    threadCreate: `${domain}thread/create`,
    threadList: (fid, page) => `${domain}thread/list/${fid}/${page}`,
    threadInfo: (tid, page) => `${domain}thread/info/${tid}/${page}`,
    threadUpdate: tid => `${domain}thread/update/${tid}`,
    threadReply: `${domain}thread/reply`,
    groupMemberList: gid => `${domain}group/users/${gid}`,
    userInfo: uid => `${domain}user/info/${uid}`,
    userThreadList: (uid, page) => `${domain}user/threads/${uid}/${page}`,
    userGroup: uid => `${domain}group/user/${uid}`,
    messageList: page => `${domain}message/list/${page}`,
    messageRead: mid => `${domain}message/read/${mid}`,
    messageDelete: mid => `${domain}message/delete/${mid}`,
    messageReadAll: `${domain}message/all/read`,
    messageDeleteAll: `${domain}message/all/delete`,
    messageCount: `${domain}message/count`,
    closeThread: `${domain}thread/close`,
    diamondThread: `${domain}thread/diamond`,
    topThread: `${domain}thread/top`,
    postInfo: pid => `${domain}post/info/${pid}`,
    postUpdate: pid => `${domain}post/update/${pid}`,
    deleteThread: tid => `${domain}thread/delete/${tid}`,
    deletePost: pid => `${domain}post/delete/${pid}`,
    deleteThreadHard: tid => `${domain}thread/deleteHard/${tid}`,
    deletePostHard: pid => `${domain}post/deleteHard/${pid}`,
    recoveryThread: tid => `${domain}thread/recovery/${tid}`,
    recoveryPost: pid => `${domain}post/recovery/${pid}`,
    groupList: `${domain}group/list`,
    groupUsers: gid => `${domain}group/users/${gid}`,
    forumListSimple: `${domain}forum/listSimple`,
    wxLoginGetKey: `${domain}user/login/qrcode`,
    wxLoginGetStatus: key => `${domain}user/login/scan/${key}/status`,
    fileUpload: `${domain}attach/upload`,
    attachUnlink: `${domain}attach/unlink`,
    attachRemove: aid => `${domain}attach/remove/${aid}`,
    attachDownload: (aid, token) => `${domain}attach/download/${aid}/${token}`,
    attachPreview: aid => `${domain}attach/preview/${aid}`,
    attachExpire: tid => `${domain}attach/expire/${tid}`,
    reportList: (uid, page) => `${domain}report/list/${uid}/${page}`,
    reportGraph: uid => `${domain}report/graph/${uid}`,
    reportCan: `${domain}report/can`,
    reportCreate: `${domain}report/create`,
    reportUpdate: rid => `${domain}report/update/${rid}`,
    reportInfo: rid => `${domain}report/info/${rid}`,
    mentorInfo: uid => `${domain}user/mentor/info/${uid}`,
    mentorMyInfo: `${domain}user/mentor/my`,
    mentorMyStudents: `${domain}user/mentor/students`,
    mentorSet: `${domain}user/mentor/set`,
    atResult: `${domain}at`,
    messagePush: `${domain}message/push`,
    search: page => `${domain}post/search/${page}`,
    socket: socket
};
export default urls;
