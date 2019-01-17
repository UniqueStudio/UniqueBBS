const domain = "http://localhost:7010/";
const urls = {
  login: `${domain}user/login/pwd`,
  myInfo: `${domain}user/my/info`,
  updateMyInfo: `${domain}user/update/normal`,
  updateMyPwd: `${domain}user/update/pwd`,
  syncWxInfo: `${domain}user/update/wx`,
  forumList: `${domain}forum/list`,
  threadList: (fid, page) => `${domain}thread/list/${fid}/${page}`,
  threadInfo: (tid, page) => `${domain}thread/info/${tid}/${page}`,
  threadReply: `${domain}thread/reply`,
  groupMemberList: gid => `${domain}group/users/${gid}`,
  userInfo: uid => `${domain}user/info/${uid}`,
  userThreadList: (uid, page) => `${domain}user/threads/${uid}/${page}`,
  userGroup: uid => `${domain}group/user/${uid}`,
  messageList: page => `${domain}message/list/${page}`,
  messageRead: mid => `${domain}message/read/${mid}`,
  messageDelete: mid => `${domain}message/delete/${mid}`,
  messageReadAll: `${domain}message/all/read`,
  messageDeleteAll: `${domain}message/all/delete`
};
export default urls;
