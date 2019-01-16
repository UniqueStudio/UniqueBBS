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
  groupMemberList: gid => `${domain}group/members/${gid}`,
  userInfo: uid => `${domain}user/info/${uid}`
};
export default urls;
