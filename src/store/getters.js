const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  baseUrl: state => state.common.baseUrl
}
export default getters
