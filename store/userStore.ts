export interface IUserInfo {
  userId?: number | null;
  nickname?: string;
  avatar?: string;
}
export interface IUserStore {
  userinfo: IUserInfo;
  // eslint-disable-next-line no-unused-vars
  setUserInfo: (value: IUserInfo) => void;
}

const userSotre = (): IUserStore => {
  return {
    userinfo: {},
    setUserInfo: function (value) {
      this.userinfo = value;
    },
  };
};

export default userSotre;
