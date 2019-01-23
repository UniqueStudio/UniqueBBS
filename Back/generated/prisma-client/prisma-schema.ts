export const typeDefs = /* GraphQL */ `type AggregateAttach {
  count: Int!
}

type AggregateFilter {
  count: Int!
}

type AggregateForum {
  count: Int!
}

type AggregateGroup {
  count: Int!
}

type AggregateMessage {
  count: Int!
}

type AggregatePost {
  count: Int!
}

type AggregateReport {
  count: Int!
}

type AggregateThread {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type Attach {
  id: ID!
  thread: Thread
  user: User!
  filesize: Int!
  downloads: Int!
  fileName: String!
  originalName: String!
  createDate: DateTime!
}

type AttachConnection {
  pageInfo: PageInfo!
  edges: [AttachEdge]!
  aggregate: AggregateAttach!
}

input AttachCreateInput {
  thread: ThreadCreateOneWithoutAttachInput
  user: UserCreateOneInput!
  filesize: Int!
  downloads: Int
  fileName: String!
  originalName: String!
  createDate: DateTime!
}

input AttachCreateManyWithoutThreadInput {
  create: [AttachCreateWithoutThreadInput!]
  connect: [AttachWhereUniqueInput!]
}

input AttachCreateWithoutThreadInput {
  user: UserCreateOneInput!
  filesize: Int!
  downloads: Int
  fileName: String!
  originalName: String!
  createDate: DateTime!
}

type AttachEdge {
  node: Attach!
  cursor: String!
}

enum AttachOrderByInput {
  id_ASC
  id_DESC
  filesize_ASC
  filesize_DESC
  downloads_ASC
  downloads_DESC
  fileName_ASC
  fileName_DESC
  originalName_ASC
  originalName_DESC
  createDate_ASC
  createDate_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type AttachPreviousValues {
  id: ID!
  filesize: Int!
  downloads: Int!
  fileName: String!
  originalName: String!
  createDate: DateTime!
}

input AttachScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  filesize: Int
  filesize_not: Int
  filesize_in: [Int!]
  filesize_not_in: [Int!]
  filesize_lt: Int
  filesize_lte: Int
  filesize_gt: Int
  filesize_gte: Int
  downloads: Int
  downloads_not: Int
  downloads_in: [Int!]
  downloads_not_in: [Int!]
  downloads_lt: Int
  downloads_lte: Int
  downloads_gt: Int
  downloads_gte: Int
  fileName: String
  fileName_not: String
  fileName_in: [String!]
  fileName_not_in: [String!]
  fileName_lt: String
  fileName_lte: String
  fileName_gt: String
  fileName_gte: String
  fileName_contains: String
  fileName_not_contains: String
  fileName_starts_with: String
  fileName_not_starts_with: String
  fileName_ends_with: String
  fileName_not_ends_with: String
  originalName: String
  originalName_not: String
  originalName_in: [String!]
  originalName_not_in: [String!]
  originalName_lt: String
  originalName_lte: String
  originalName_gt: String
  originalName_gte: String
  originalName_contains: String
  originalName_not_contains: String
  originalName_starts_with: String
  originalName_not_starts_with: String
  originalName_ends_with: String
  originalName_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  AND: [AttachScalarWhereInput!]
  OR: [AttachScalarWhereInput!]
  NOT: [AttachScalarWhereInput!]
}

type AttachSubscriptionPayload {
  mutation: MutationType!
  node: Attach
  updatedFields: [String!]
  previousValues: AttachPreviousValues
}

input AttachSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: AttachWhereInput
  AND: [AttachSubscriptionWhereInput!]
  OR: [AttachSubscriptionWhereInput!]
  NOT: [AttachSubscriptionWhereInput!]
}

input AttachUpdateInput {
  thread: ThreadUpdateOneWithoutAttachInput
  user: UserUpdateOneRequiredInput
  filesize: Int
  downloads: Int
  fileName: String
  originalName: String
  createDate: DateTime
}

input AttachUpdateManyDataInput {
  filesize: Int
  downloads: Int
  fileName: String
  originalName: String
  createDate: DateTime
}

input AttachUpdateManyMutationInput {
  filesize: Int
  downloads: Int
  fileName: String
  originalName: String
  createDate: DateTime
}

input AttachUpdateManyWithoutThreadInput {
  create: [AttachCreateWithoutThreadInput!]
  delete: [AttachWhereUniqueInput!]
  connect: [AttachWhereUniqueInput!]
  disconnect: [AttachWhereUniqueInput!]
  update: [AttachUpdateWithWhereUniqueWithoutThreadInput!]
  upsert: [AttachUpsertWithWhereUniqueWithoutThreadInput!]
  deleteMany: [AttachScalarWhereInput!]
  updateMany: [AttachUpdateManyWithWhereNestedInput!]
}

input AttachUpdateManyWithWhereNestedInput {
  where: AttachScalarWhereInput!
  data: AttachUpdateManyDataInput!
}

input AttachUpdateWithoutThreadDataInput {
  user: UserUpdateOneRequiredInput
  filesize: Int
  downloads: Int
  fileName: String
  originalName: String
  createDate: DateTime
}

input AttachUpdateWithWhereUniqueWithoutThreadInput {
  where: AttachWhereUniqueInput!
  data: AttachUpdateWithoutThreadDataInput!
}

input AttachUpsertWithWhereUniqueWithoutThreadInput {
  where: AttachWhereUniqueInput!
  update: AttachUpdateWithoutThreadDataInput!
  create: AttachCreateWithoutThreadInput!
}

input AttachWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  thread: ThreadWhereInput
  user: UserWhereInput
  filesize: Int
  filesize_not: Int
  filesize_in: [Int!]
  filesize_not_in: [Int!]
  filesize_lt: Int
  filesize_lte: Int
  filesize_gt: Int
  filesize_gte: Int
  downloads: Int
  downloads_not: Int
  downloads_in: [Int!]
  downloads_not_in: [Int!]
  downloads_lt: Int
  downloads_lte: Int
  downloads_gt: Int
  downloads_gte: Int
  fileName: String
  fileName_not: String
  fileName_in: [String!]
  fileName_not_in: [String!]
  fileName_lt: String
  fileName_lte: String
  fileName_gt: String
  fileName_gte: String
  fileName_contains: String
  fileName_not_contains: String
  fileName_starts_with: String
  fileName_not_starts_with: String
  fileName_ends_with: String
  fileName_not_ends_with: String
  originalName: String
  originalName_not: String
  originalName_in: [String!]
  originalName_not_in: [String!]
  originalName_lt: String
  originalName_lte: String
  originalName_gt: String
  originalName_gte: String
  originalName_contains: String
  originalName_not_contains: String
  originalName_starts_with: String
  originalName_not_starts_with: String
  originalName_ends_with: String
  originalName_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  AND: [AttachWhereInput!]
  OR: [AttachWhereInput!]
  NOT: [AttachWhereInput!]
}

input AttachWhereUniqueInput {
  id: ID
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type Filter {
  id: ID!
  userList(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User!]
  groupList(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group!]
  userType: Int!
  groupType: Int!
}

type FilterConnection {
  pageInfo: PageInfo!
  edges: [FilterEdge]!
  aggregate: AggregateFilter!
}

input FilterCreateInput {
  userList: UserCreateManyInput
  groupList: GroupCreateManyInput
  userType: Int!
  groupType: Int!
}

input FilterCreateOneInput {
  create: FilterCreateInput
  connect: FilterWhereUniqueInput
}

type FilterEdge {
  node: Filter!
  cursor: String!
}

enum FilterOrderByInput {
  id_ASC
  id_DESC
  userType_ASC
  userType_DESC
  groupType_ASC
  groupType_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type FilterPreviousValues {
  id: ID!
  userType: Int!
  groupType: Int!
}

type FilterSubscriptionPayload {
  mutation: MutationType!
  node: Filter
  updatedFields: [String!]
  previousValues: FilterPreviousValues
}

input FilterSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: FilterWhereInput
  AND: [FilterSubscriptionWhereInput!]
  OR: [FilterSubscriptionWhereInput!]
  NOT: [FilterSubscriptionWhereInput!]
}

input FilterUpdateDataInput {
  userList: UserUpdateManyInput
  groupList: GroupUpdateManyInput
  userType: Int
  groupType: Int
}

input FilterUpdateInput {
  userList: UserUpdateManyInput
  groupList: GroupUpdateManyInput
  userType: Int
  groupType: Int
}

input FilterUpdateManyMutationInput {
  userType: Int
  groupType: Int
}

input FilterUpdateOneInput {
  create: FilterCreateInput
  update: FilterUpdateDataInput
  upsert: FilterUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: FilterWhereUniqueInput
}

input FilterUpsertNestedInput {
  update: FilterUpdateDataInput!
  create: FilterCreateInput!
}

input FilterWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  userList_every: UserWhereInput
  userList_some: UserWhereInput
  userList_none: UserWhereInput
  groupList_every: GroupWhereInput
  groupList_some: GroupWhereInput
  groupList_none: GroupWhereInput
  userType: Int
  userType_not: Int
  userType_in: [Int!]
  userType_not_in: [Int!]
  userType_lt: Int
  userType_lte: Int
  userType_gt: Int
  userType_gte: Int
  groupType: Int
  groupType_not: Int
  groupType_in: [Int!]
  groupType_not_in: [Int!]
  groupType_lt: Int
  groupType_lte: Int
  groupType_gt: Int
  groupType_gte: Int
  AND: [FilterWhereInput!]
  OR: [FilterWhereInput!]
  NOT: [FilterWhereInput!]
}

input FilterWhereUniqueInput {
  id: ID
}

type Forum {
  id: ID!
  name: String!
  threads: Int!
  lastPost: Post
  icon: String!
  description: String
}

type ForumConnection {
  pageInfo: PageInfo!
  edges: [ForumEdge]!
  aggregate: AggregateForum!
}

input ForumCreateInput {
  name: String!
  threads: Int
  lastPost: PostCreateOneInput
  icon: String!
  description: String
}

input ForumCreateOneInput {
  create: ForumCreateInput
  connect: ForumWhereUniqueInput
}

type ForumEdge {
  node: Forum!
  cursor: String!
}

enum ForumOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  threads_ASC
  threads_DESC
  icon_ASC
  icon_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ForumPreviousValues {
  id: ID!
  name: String!
  threads: Int!
  icon: String!
  description: String
}

type ForumSubscriptionPayload {
  mutation: MutationType!
  node: Forum
  updatedFields: [String!]
  previousValues: ForumPreviousValues
}

input ForumSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ForumWhereInput
  AND: [ForumSubscriptionWhereInput!]
  OR: [ForumSubscriptionWhereInput!]
  NOT: [ForumSubscriptionWhereInput!]
}

input ForumUpdateDataInput {
  name: String
  threads: Int
  lastPost: PostUpdateOneInput
  icon: String
  description: String
}

input ForumUpdateInput {
  name: String
  threads: Int
  lastPost: PostUpdateOneInput
  icon: String
  description: String
}

input ForumUpdateManyMutationInput {
  name: String
  threads: Int
  icon: String
  description: String
}

input ForumUpdateOneRequiredInput {
  create: ForumCreateInput
  update: ForumUpdateDataInput
  upsert: ForumUpsertNestedInput
  connect: ForumWhereUniqueInput
}

input ForumUpsertNestedInput {
  update: ForumUpdateDataInput!
  create: ForumCreateInput!
}

input ForumWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  threads: Int
  threads_not: Int
  threads_in: [Int!]
  threads_not_in: [Int!]
  threads_lt: Int
  threads_lte: Int
  threads_gt: Int
  threads_gte: Int
  lastPost: PostWhereInput
  icon: String
  icon_not: String
  icon_in: [String!]
  icon_not_in: [String!]
  icon_lt: String
  icon_lte: String
  icon_gt: String
  icon_gte: String
  icon_contains: String
  icon_not_contains: String
  icon_starts_with: String
  icon_not_starts_with: String
  icon_ends_with: String
  icon_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  AND: [ForumWhereInput!]
  OR: [ForumWhereInput!]
  NOT: [ForumWhereInput!]
}

input ForumWhereUniqueInput {
  id: ID
}

type Group {
  id: ID!
  key: Int!
  name: String!
  color: String!
  master: User
}

type GroupConnection {
  pageInfo: PageInfo!
  edges: [GroupEdge]!
  aggregate: AggregateGroup!
}

input GroupCreateInput {
  key: Int!
  name: String!
  color: String
  master: UserCreateOneWithoutGroupInput
}

input GroupCreateManyInput {
  create: [GroupCreateInput!]
  connect: [GroupWhereUniqueInput!]
}

input GroupCreateManyWithoutMasterInput {
  create: [GroupCreateWithoutMasterInput!]
  connect: [GroupWhereUniqueInput!]
}

input GroupCreateWithoutMasterInput {
  key: Int!
  name: String!
  color: String
}

type GroupEdge {
  node: Group!
  cursor: String!
}

enum GroupOrderByInput {
  id_ASC
  id_DESC
  key_ASC
  key_DESC
  name_ASC
  name_DESC
  color_ASC
  color_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type GroupPreviousValues {
  id: ID!
  key: Int!
  name: String!
  color: String!
}

input GroupScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  key: Int
  key_not: Int
  key_in: [Int!]
  key_not_in: [Int!]
  key_lt: Int
  key_lte: Int
  key_gt: Int
  key_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  color: String
  color_not: String
  color_in: [String!]
  color_not_in: [String!]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
  AND: [GroupScalarWhereInput!]
  OR: [GroupScalarWhereInput!]
  NOT: [GroupScalarWhereInput!]
}

type GroupSubscriptionPayload {
  mutation: MutationType!
  node: Group
  updatedFields: [String!]
  previousValues: GroupPreviousValues
}

input GroupSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: GroupWhereInput
  AND: [GroupSubscriptionWhereInput!]
  OR: [GroupSubscriptionWhereInput!]
  NOT: [GroupSubscriptionWhereInput!]
}

input GroupUpdateDataInput {
  key: Int
  name: String
  color: String
  master: UserUpdateOneWithoutGroupInput
}

input GroupUpdateInput {
  key: Int
  name: String
  color: String
  master: UserUpdateOneWithoutGroupInput
}

input GroupUpdateManyDataInput {
  key: Int
  name: String
  color: String
}

input GroupUpdateManyInput {
  create: [GroupCreateInput!]
  update: [GroupUpdateWithWhereUniqueNestedInput!]
  upsert: [GroupUpsertWithWhereUniqueNestedInput!]
  delete: [GroupWhereUniqueInput!]
  connect: [GroupWhereUniqueInput!]
  disconnect: [GroupWhereUniqueInput!]
  deleteMany: [GroupScalarWhereInput!]
  updateMany: [GroupUpdateManyWithWhereNestedInput!]
}

input GroupUpdateManyMutationInput {
  key: Int
  name: String
  color: String
}

input GroupUpdateManyWithoutMasterInput {
  create: [GroupCreateWithoutMasterInput!]
  delete: [GroupWhereUniqueInput!]
  connect: [GroupWhereUniqueInput!]
  disconnect: [GroupWhereUniqueInput!]
  update: [GroupUpdateWithWhereUniqueWithoutMasterInput!]
  upsert: [GroupUpsertWithWhereUniqueWithoutMasterInput!]
  deleteMany: [GroupScalarWhereInput!]
  updateMany: [GroupUpdateManyWithWhereNestedInput!]
}

input GroupUpdateManyWithWhereNestedInput {
  where: GroupScalarWhereInput!
  data: GroupUpdateManyDataInput!
}

input GroupUpdateWithoutMasterDataInput {
  key: Int
  name: String
  color: String
}

input GroupUpdateWithWhereUniqueNestedInput {
  where: GroupWhereUniqueInput!
  data: GroupUpdateDataInput!
}

input GroupUpdateWithWhereUniqueWithoutMasterInput {
  where: GroupWhereUniqueInput!
  data: GroupUpdateWithoutMasterDataInput!
}

input GroupUpsertWithWhereUniqueNestedInput {
  where: GroupWhereUniqueInput!
  update: GroupUpdateDataInput!
  create: GroupCreateInput!
}

input GroupUpsertWithWhereUniqueWithoutMasterInput {
  where: GroupWhereUniqueInput!
  update: GroupUpdateWithoutMasterDataInput!
  create: GroupCreateWithoutMasterInput!
}

input GroupWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  key: Int
  key_not: Int
  key_in: [Int!]
  key_not_in: [Int!]
  key_lt: Int
  key_lte: Int
  key_gt: Int
  key_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  color: String
  color_not: String
  color_in: [String!]
  color_not_in: [String!]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
  master: UserWhereInput
  AND: [GroupWhereInput!]
  OR: [GroupWhereInput!]
  NOT: [GroupWhereInput!]
}

input GroupWhereUniqueInput {
  id: ID
  key: Int
}

scalar Long

type Message {
  id: ID!
  fromUser: User!
  toUser: User!
  message: String!
  isRead: Boolean!
  createDate: DateTime!
  url: String
}

type MessageConnection {
  pageInfo: PageInfo!
  edges: [MessageEdge]!
  aggregate: AggregateMessage!
}

input MessageCreateInput {
  fromUser: UserCreateOneInput!
  toUser: UserCreateOneInput!
  message: String!
  isRead: Boolean
  createDate: DateTime!
  url: String
}

type MessageEdge {
  node: Message!
  cursor: String!
}

enum MessageOrderByInput {
  id_ASC
  id_DESC
  message_ASC
  message_DESC
  isRead_ASC
  isRead_DESC
  createDate_ASC
  createDate_DESC
  url_ASC
  url_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type MessagePreviousValues {
  id: ID!
  message: String!
  isRead: Boolean!
  createDate: DateTime!
  url: String
}

type MessageSubscriptionPayload {
  mutation: MutationType!
  node: Message
  updatedFields: [String!]
  previousValues: MessagePreviousValues
}

input MessageSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: MessageWhereInput
  AND: [MessageSubscriptionWhereInput!]
  OR: [MessageSubscriptionWhereInput!]
  NOT: [MessageSubscriptionWhereInput!]
}

input MessageUpdateInput {
  fromUser: UserUpdateOneRequiredInput
  toUser: UserUpdateOneRequiredInput
  message: String
  isRead: Boolean
  createDate: DateTime
  url: String
}

input MessageUpdateManyMutationInput {
  message: String
  isRead: Boolean
  createDate: DateTime
  url: String
}

input MessageWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  fromUser: UserWhereInput
  toUser: UserWhereInput
  message: String
  message_not: String
  message_in: [String!]
  message_not_in: [String!]
  message_lt: String
  message_lte: String
  message_gt: String
  message_gte: String
  message_contains: String
  message_not_contains: String
  message_starts_with: String
  message_not_starts_with: String
  message_ends_with: String
  message_not_ends_with: String
  isRead: Boolean
  isRead_not: Boolean
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  url: String
  url_not: String
  url_in: [String!]
  url_not_in: [String!]
  url_lt: String
  url_lte: String
  url_gt: String
  url_gte: String
  url_contains: String
  url_not_contains: String
  url_starts_with: String
  url_not_starts_with: String
  url_ends_with: String
  url_not_ends_with: String
  AND: [MessageWhereInput!]
  OR: [MessageWhereInput!]
  NOT: [MessageWhereInput!]
}

input MessageWhereUniqueInput {
  id: ID
}

type Mutation {
  createAttach(data: AttachCreateInput!): Attach!
  updateAttach(data: AttachUpdateInput!, where: AttachWhereUniqueInput!): Attach
  updateManyAttaches(data: AttachUpdateManyMutationInput!, where: AttachWhereInput): BatchPayload!
  upsertAttach(where: AttachWhereUniqueInput!, create: AttachCreateInput!, update: AttachUpdateInput!): Attach!
  deleteAttach(where: AttachWhereUniqueInput!): Attach
  deleteManyAttaches(where: AttachWhereInput): BatchPayload!
  createFilter(data: FilterCreateInput!): Filter!
  updateFilter(data: FilterUpdateInput!, where: FilterWhereUniqueInput!): Filter
  updateManyFilters(data: FilterUpdateManyMutationInput!, where: FilterWhereInput): BatchPayload!
  upsertFilter(where: FilterWhereUniqueInput!, create: FilterCreateInput!, update: FilterUpdateInput!): Filter!
  deleteFilter(where: FilterWhereUniqueInput!): Filter
  deleteManyFilters(where: FilterWhereInput): BatchPayload!
  createForum(data: ForumCreateInput!): Forum!
  updateForum(data: ForumUpdateInput!, where: ForumWhereUniqueInput!): Forum
  updateManyForums(data: ForumUpdateManyMutationInput!, where: ForumWhereInput): BatchPayload!
  upsertForum(where: ForumWhereUniqueInput!, create: ForumCreateInput!, update: ForumUpdateInput!): Forum!
  deleteForum(where: ForumWhereUniqueInput!): Forum
  deleteManyForums(where: ForumWhereInput): BatchPayload!
  createGroup(data: GroupCreateInput!): Group!
  updateGroup(data: GroupUpdateInput!, where: GroupWhereUniqueInput!): Group
  updateManyGroups(data: GroupUpdateManyMutationInput!, where: GroupWhereInput): BatchPayload!
  upsertGroup(where: GroupWhereUniqueInput!, create: GroupCreateInput!, update: GroupUpdateInput!): Group!
  deleteGroup(where: GroupWhereUniqueInput!): Group
  deleteManyGroups(where: GroupWhereInput): BatchPayload!
  createMessage(data: MessageCreateInput!): Message!
  updateMessage(data: MessageUpdateInput!, where: MessageWhereUniqueInput!): Message
  updateManyMessages(data: MessageUpdateManyMutationInput!, where: MessageWhereInput): BatchPayload!
  upsertMessage(where: MessageWhereUniqueInput!, create: MessageCreateInput!, update: MessageUpdateInput!): Message!
  deleteMessage(where: MessageWhereUniqueInput!): Message
  deleteManyMessages(where: MessageWhereInput): BatchPayload!
  createPost(data: PostCreateInput!): Post!
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateManyPosts(data: PostUpdateManyMutationInput!, where: PostWhereInput): BatchPayload!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  deletePost(where: PostWhereUniqueInput!): Post
  deleteManyPosts(where: PostWhereInput): BatchPayload!
  createReport(data: ReportCreateInput!): Report!
  updateReport(data: ReportUpdateInput!, where: ReportWhereUniqueInput!): Report
  updateManyReports(data: ReportUpdateManyMutationInput!, where: ReportWhereInput): BatchPayload!
  upsertReport(where: ReportWhereUniqueInput!, create: ReportCreateInput!, update: ReportUpdateInput!): Report!
  deleteReport(where: ReportWhereUniqueInput!): Report
  deleteManyReports(where: ReportWhereInput): BatchPayload!
  createThread(data: ThreadCreateInput!): Thread!
  updateThread(data: ThreadUpdateInput!, where: ThreadWhereUniqueInput!): Thread
  updateManyThreads(data: ThreadUpdateManyMutationInput!, where: ThreadWhereInput): BatchPayload!
  upsertThread(where: ThreadWhereUniqueInput!, create: ThreadCreateInput!, update: ThreadUpdateInput!): Thread!
  deleteThread(where: ThreadWhereUniqueInput!): Thread
  deleteManyThreads(where: ThreadWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Post {
  id: ID!
  user: User!
  thread: Thread!
  isFirst: Boolean!
  quote: String!
  message: String!
  createDate: DateTime!
  active: Boolean!
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  user: UserCreateOneInput!
  thread: ThreadCreateOneWithoutPostInput!
  isFirst: Boolean
  quote: String
  message: String!
  createDate: DateTime!
  active: Boolean
}

input PostCreateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  connect: [PostWhereUniqueInput!]
}

input PostCreateOneInput {
  create: PostCreateInput
  connect: PostWhereUniqueInput
}

input PostCreateWithoutThreadInput {
  user: UserCreateOneInput!
  isFirst: Boolean
  quote: String
  message: String!
  createDate: DateTime!
  active: Boolean
}

type PostEdge {
  node: Post!
  cursor: String!
}

enum PostOrderByInput {
  id_ASC
  id_DESC
  isFirst_ASC
  isFirst_DESC
  quote_ASC
  quote_DESC
  message_ASC
  message_DESC
  createDate_ASC
  createDate_DESC
  active_ASC
  active_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PostPreviousValues {
  id: ID!
  isFirst: Boolean!
  quote: String!
  message: String!
  createDate: DateTime!
  active: Boolean!
}

input PostScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  isFirst: Boolean
  isFirst_not: Boolean
  quote: String
  quote_not: String
  quote_in: [String!]
  quote_not_in: [String!]
  quote_lt: String
  quote_lte: String
  quote_gt: String
  quote_gte: String
  quote_contains: String
  quote_not_contains: String
  quote_starts_with: String
  quote_not_starts_with: String
  quote_ends_with: String
  quote_not_ends_with: String
  message: String
  message_not: String
  message_in: [String!]
  message_not_in: [String!]
  message_lt: String
  message_lte: String
  message_gt: String
  message_gte: String
  message_contains: String
  message_not_contains: String
  message_starts_with: String
  message_not_starts_with: String
  message_ends_with: String
  message_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  active: Boolean
  active_not: Boolean
  AND: [PostScalarWhereInput!]
  OR: [PostScalarWhereInput!]
  NOT: [PostScalarWhereInput!]
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
  updatedFields: [String!]
  previousValues: PostPreviousValues
}

input PostSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PostWhereInput
  AND: [PostSubscriptionWhereInput!]
  OR: [PostSubscriptionWhereInput!]
  NOT: [PostSubscriptionWhereInput!]
}

input PostUpdateDataInput {
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  isFirst: Boolean
  quote: String
  message: String
  createDate: DateTime
  active: Boolean
}

input PostUpdateInput {
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  isFirst: Boolean
  quote: String
  message: String
  createDate: DateTime
  active: Boolean
}

input PostUpdateManyDataInput {
  isFirst: Boolean
  quote: String
  message: String
  createDate: DateTime
  active: Boolean
}

input PostUpdateManyMutationInput {
  isFirst: Boolean
  quote: String
  message: String
  createDate: DateTime
  active: Boolean
}

input PostUpdateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  delete: [PostWhereUniqueInput!]
  connect: [PostWhereUniqueInput!]
  disconnect: [PostWhereUniqueInput!]
  update: [PostUpdateWithWhereUniqueWithoutThreadInput!]
  upsert: [PostUpsertWithWhereUniqueWithoutThreadInput!]
  deleteMany: [PostScalarWhereInput!]
  updateMany: [PostUpdateManyWithWhereNestedInput!]
}

input PostUpdateManyWithWhereNestedInput {
  where: PostScalarWhereInput!
  data: PostUpdateManyDataInput!
}

input PostUpdateOneInput {
  create: PostCreateInput
  update: PostUpdateDataInput
  upsert: PostUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: PostWhereUniqueInput
}

input PostUpdateWithoutThreadDataInput {
  user: UserUpdateOneRequiredInput
  isFirst: Boolean
  quote: String
  message: String
  createDate: DateTime
  active: Boolean
}

input PostUpdateWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  data: PostUpdateWithoutThreadDataInput!
}

input PostUpsertNestedInput {
  update: PostUpdateDataInput!
  create: PostCreateInput!
}

input PostUpsertWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  update: PostUpdateWithoutThreadDataInput!
  create: PostCreateWithoutThreadInput!
}

input PostWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  user: UserWhereInput
  thread: ThreadWhereInput
  isFirst: Boolean
  isFirst_not: Boolean
  quote: String
  quote_not: String
  quote_in: [String!]
  quote_not_in: [String!]
  quote_lt: String
  quote_lte: String
  quote_gt: String
  quote_gte: String
  quote_contains: String
  quote_not_contains: String
  quote_starts_with: String
  quote_not_starts_with: String
  quote_ends_with: String
  quote_not_ends_with: String
  message: String
  message_not: String
  message_in: [String!]
  message_not_in: [String!]
  message_lt: String
  message_lte: String
  message_gt: String
  message_gte: String
  message_contains: String
  message_not_contains: String
  message_starts_with: String
  message_not_starts_with: String
  message_ends_with: String
  message_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  active: Boolean
  active_not: Boolean
  AND: [PostWhereInput!]
  OR: [PostWhereInput!]
  NOT: [PostWhereInput!]
}

input PostWhereUniqueInput {
  id: ID
}

type Query {
  attach(where: AttachWhereUniqueInput!): Attach
  attaches(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attach]!
  attachesConnection(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): AttachConnection!
  filter(where: FilterWhereUniqueInput!): Filter
  filters(where: FilterWhereInput, orderBy: FilterOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Filter]!
  filtersConnection(where: FilterWhereInput, orderBy: FilterOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): FilterConnection!
  forum(where: ForumWhereUniqueInput!): Forum
  forums(where: ForumWhereInput, orderBy: ForumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Forum]!
  forumsConnection(where: ForumWhereInput, orderBy: ForumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ForumConnection!
  group(where: GroupWhereUniqueInput!): Group
  groups(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group]!
  groupsConnection(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): GroupConnection!
  message(where: MessageWhereUniqueInput!): Message
  messages(where: MessageWhereInput, orderBy: MessageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Message]!
  messagesConnection(where: MessageWhereInput, orderBy: MessageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): MessageConnection!
  post(where: PostWhereUniqueInput!): Post
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  report(where: ReportWhereUniqueInput!): Report
  reports(where: ReportWhereInput, orderBy: ReportOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Report]!
  reportsConnection(where: ReportWhereInput, orderBy: ReportOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ReportConnection!
  thread(where: ThreadWhereUniqueInput!): Thread
  threads(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Thread]!
  threadsConnection(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ThreadConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Report {
  id: ID!
  message: String!
  createDate: DateTime!
  isWeek: Boolean!
  user: User!
}

type ReportConnection {
  pageInfo: PageInfo!
  edges: [ReportEdge]!
  aggregate: AggregateReport!
}

input ReportCreateInput {
  message: String!
  createDate: DateTime!
  isWeek: Boolean
  user: UserCreateOneWithoutReportInput!
}

input ReportCreateManyWithoutUserInput {
  create: [ReportCreateWithoutUserInput!]
  connect: [ReportWhereUniqueInput!]
}

input ReportCreateWithoutUserInput {
  message: String!
  createDate: DateTime!
  isWeek: Boolean
}

type ReportEdge {
  node: Report!
  cursor: String!
}

enum ReportOrderByInput {
  id_ASC
  id_DESC
  message_ASC
  message_DESC
  createDate_ASC
  createDate_DESC
  isWeek_ASC
  isWeek_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ReportPreviousValues {
  id: ID!
  message: String!
  createDate: DateTime!
  isWeek: Boolean!
}

input ReportScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  message: String
  message_not: String
  message_in: [String!]
  message_not_in: [String!]
  message_lt: String
  message_lte: String
  message_gt: String
  message_gte: String
  message_contains: String
  message_not_contains: String
  message_starts_with: String
  message_not_starts_with: String
  message_ends_with: String
  message_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  isWeek: Boolean
  isWeek_not: Boolean
  AND: [ReportScalarWhereInput!]
  OR: [ReportScalarWhereInput!]
  NOT: [ReportScalarWhereInput!]
}

type ReportSubscriptionPayload {
  mutation: MutationType!
  node: Report
  updatedFields: [String!]
  previousValues: ReportPreviousValues
}

input ReportSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ReportWhereInput
  AND: [ReportSubscriptionWhereInput!]
  OR: [ReportSubscriptionWhereInput!]
  NOT: [ReportSubscriptionWhereInput!]
}

input ReportUpdateInput {
  message: String
  createDate: DateTime
  isWeek: Boolean
  user: UserUpdateOneRequiredWithoutReportInput
}

input ReportUpdateManyDataInput {
  message: String
  createDate: DateTime
  isWeek: Boolean
}

input ReportUpdateManyMutationInput {
  message: String
  createDate: DateTime
  isWeek: Boolean
}

input ReportUpdateManyWithoutUserInput {
  create: [ReportCreateWithoutUserInput!]
  delete: [ReportWhereUniqueInput!]
  connect: [ReportWhereUniqueInput!]
  disconnect: [ReportWhereUniqueInput!]
  update: [ReportUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [ReportUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [ReportScalarWhereInput!]
  updateMany: [ReportUpdateManyWithWhereNestedInput!]
}

input ReportUpdateManyWithWhereNestedInput {
  where: ReportScalarWhereInput!
  data: ReportUpdateManyDataInput!
}

input ReportUpdateWithoutUserDataInput {
  message: String
  createDate: DateTime
  isWeek: Boolean
}

input ReportUpdateWithWhereUniqueWithoutUserInput {
  where: ReportWhereUniqueInput!
  data: ReportUpdateWithoutUserDataInput!
}

input ReportUpsertWithWhereUniqueWithoutUserInput {
  where: ReportWhereUniqueInput!
  update: ReportUpdateWithoutUserDataInput!
  create: ReportCreateWithoutUserInput!
}

input ReportWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  message: String
  message_not: String
  message_in: [String!]
  message_not_in: [String!]
  message_lt: String
  message_lte: String
  message_gt: String
  message_gte: String
  message_contains: String
  message_not_contains: String
  message_starts_with: String
  message_not_starts_with: String
  message_ends_with: String
  message_not_ends_with: String
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  isWeek: Boolean
  isWeek_not: Boolean
  user: UserWhereInput
  AND: [ReportWhereInput!]
  OR: [ReportWhereInput!]
  NOT: [ReportWhereInput!]
}

input ReportWhereUniqueInput {
  id: ID
}

type Subscription {
  attach(where: AttachSubscriptionWhereInput): AttachSubscriptionPayload
  filter(where: FilterSubscriptionWhereInput): FilterSubscriptionPayload
  forum(where: ForumSubscriptionWhereInput): ForumSubscriptionPayload
  group(where: GroupSubscriptionWhereInput): GroupSubscriptionPayload
  message(where: MessageSubscriptionWhereInput): MessageSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  report(where: ReportSubscriptionWhereInput): ReportSubscriptionPayload
  thread(where: ThreadSubscriptionWhereInput): ThreadSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type Thread {
  id: ID!
  user: User!
  forum: Forum!
  subject: String!
  active: Boolean!
  postCount: Int!
  post(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post!]
  top: Int!
  closed: Boolean!
  diamond: Boolean!
  attach(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attach!]
  lastDate: DateTime!
  createDate: DateTime!
  filter: Filter
}

type ThreadConnection {
  pageInfo: PageInfo!
  edges: [ThreadEdge]!
  aggregate: AggregateThread!
}

input ThreadCreateInput {
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
  post: PostCreateManyWithoutThreadInput
  top: Int
  closed: Boolean
  diamond: Boolean
  attach: AttachCreateManyWithoutThreadInput
  lastDate: DateTime!
  createDate: DateTime!
  filter: FilterCreateOneInput
}

input ThreadCreateOneWithoutAttachInput {
  create: ThreadCreateWithoutAttachInput
  connect: ThreadWhereUniqueInput
}

input ThreadCreateOneWithoutPostInput {
  create: ThreadCreateWithoutPostInput
  connect: ThreadWhereUniqueInput
}

input ThreadCreateWithoutAttachInput {
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
  post: PostCreateManyWithoutThreadInput
  top: Int
  closed: Boolean
  diamond: Boolean
  lastDate: DateTime!
  createDate: DateTime!
  filter: FilterCreateOneInput
}

input ThreadCreateWithoutPostInput {
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
  top: Int
  closed: Boolean
  diamond: Boolean
  attach: AttachCreateManyWithoutThreadInput
  lastDate: DateTime!
  createDate: DateTime!
  filter: FilterCreateOneInput
}

type ThreadEdge {
  node: Thread!
  cursor: String!
}

enum ThreadOrderByInput {
  id_ASC
  id_DESC
  subject_ASC
  subject_DESC
  active_ASC
  active_DESC
  postCount_ASC
  postCount_DESC
  top_ASC
  top_DESC
  closed_ASC
  closed_DESC
  diamond_ASC
  diamond_DESC
  lastDate_ASC
  lastDate_DESC
  createDate_ASC
  createDate_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ThreadPreviousValues {
  id: ID!
  subject: String!
  active: Boolean!
  postCount: Int!
  top: Int!
  closed: Boolean!
  diamond: Boolean!
  lastDate: DateTime!
  createDate: DateTime!
}

type ThreadSubscriptionPayload {
  mutation: MutationType!
  node: Thread
  updatedFields: [String!]
  previousValues: ThreadPreviousValues
}

input ThreadSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ThreadWhereInput
  AND: [ThreadSubscriptionWhereInput!]
  OR: [ThreadSubscriptionWhereInput!]
  NOT: [ThreadSubscriptionWhereInput!]
}

input ThreadUpdateInput {
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
  post: PostUpdateManyWithoutThreadInput
  top: Int
  closed: Boolean
  diamond: Boolean
  attach: AttachUpdateManyWithoutThreadInput
  lastDate: DateTime
  createDate: DateTime
  filter: FilterUpdateOneInput
}

input ThreadUpdateManyMutationInput {
  subject: String
  active: Boolean
  postCount: Int
  top: Int
  closed: Boolean
  diamond: Boolean
  lastDate: DateTime
  createDate: DateTime
}

input ThreadUpdateOneRequiredWithoutPostInput {
  create: ThreadCreateWithoutPostInput
  update: ThreadUpdateWithoutPostDataInput
  upsert: ThreadUpsertWithoutPostInput
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateOneWithoutAttachInput {
  create: ThreadCreateWithoutAttachInput
  update: ThreadUpdateWithoutAttachDataInput
  upsert: ThreadUpsertWithoutAttachInput
  delete: Boolean
  disconnect: Boolean
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateWithoutAttachDataInput {
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
  post: PostUpdateManyWithoutThreadInput
  top: Int
  closed: Boolean
  diamond: Boolean
  lastDate: DateTime
  createDate: DateTime
  filter: FilterUpdateOneInput
}

input ThreadUpdateWithoutPostDataInput {
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
  top: Int
  closed: Boolean
  diamond: Boolean
  attach: AttachUpdateManyWithoutThreadInput
  lastDate: DateTime
  createDate: DateTime
  filter: FilterUpdateOneInput
}

input ThreadUpsertWithoutAttachInput {
  update: ThreadUpdateWithoutAttachDataInput!
  create: ThreadCreateWithoutAttachInput!
}

input ThreadUpsertWithoutPostInput {
  update: ThreadUpdateWithoutPostDataInput!
  create: ThreadCreateWithoutPostInput!
}

input ThreadWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  user: UserWhereInput
  forum: ForumWhereInput
  subject: String
  subject_not: String
  subject_in: [String!]
  subject_not_in: [String!]
  subject_lt: String
  subject_lte: String
  subject_gt: String
  subject_gte: String
  subject_contains: String
  subject_not_contains: String
  subject_starts_with: String
  subject_not_starts_with: String
  subject_ends_with: String
  subject_not_ends_with: String
  active: Boolean
  active_not: Boolean
  postCount: Int
  postCount_not: Int
  postCount_in: [Int!]
  postCount_not_in: [Int!]
  postCount_lt: Int
  postCount_lte: Int
  postCount_gt: Int
  postCount_gte: Int
  post_every: PostWhereInput
  post_some: PostWhereInput
  post_none: PostWhereInput
  top: Int
  top_not: Int
  top_in: [Int!]
  top_not_in: [Int!]
  top_lt: Int
  top_lte: Int
  top_gt: Int
  top_gte: Int
  closed: Boolean
  closed_not: Boolean
  diamond: Boolean
  diamond_not: Boolean
  attach_every: AttachWhereInput
  attach_some: AttachWhereInput
  attach_none: AttachWhereInput
  lastDate: DateTime
  lastDate_not: DateTime
  lastDate_in: [DateTime!]
  lastDate_not_in: [DateTime!]
  lastDate_lt: DateTime
  lastDate_lte: DateTime
  lastDate_gt: DateTime
  lastDate_gte: DateTime
  createDate: DateTime
  createDate_not: DateTime
  createDate_in: [DateTime!]
  createDate_not_in: [DateTime!]
  createDate_lt: DateTime
  createDate_lte: DateTime
  createDate_gt: DateTime
  createDate_gte: DateTime
  filter: FilterWhereInput
  AND: [ThreadWhereInput!]
  OR: [ThreadWhereInput!]
  NOT: [ThreadWhereInput!]
}

input ThreadWhereUniqueInput {
  id: ID
}

type User {
  id: ID!
  username: String!
  nickname: String
  password: String
  email: String!
  studentID: String!
  dormitory: String!
  qq: String!
  wechat: String!
  major: String!
  className: String!
  active: Boolean!
  mobile: String!
  avatar: String!
  userid: String!
  isAdmin: Boolean!
  group(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group!]
  threads: Int!
  lastLogin: DateTime!
  signature: String!
  mentor: User
  report(where: ReportWhereInput, orderBy: ReportOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Report!]
  spaceQuota: Int
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  username: String!
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String!
  isAdmin: Boolean
  group: GroupCreateManyWithoutMasterInput
  threads: Int
  lastLogin: DateTime!
  signature: String
  mentor: UserCreateOneInput
  report: ReportCreateManyWithoutUserInput
  spaceQuota: Int
}

input UserCreateManyInput {
  create: [UserCreateInput!]
  connect: [UserWhereUniqueInput!]
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutGroupInput {
  create: UserCreateWithoutGroupInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutReportInput {
  create: UserCreateWithoutReportInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutGroupInput {
  username: String!
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String!
  isAdmin: Boolean
  threads: Int
  lastLogin: DateTime!
  signature: String
  mentor: UserCreateOneInput
  report: ReportCreateManyWithoutUserInput
  spaceQuota: Int
}

input UserCreateWithoutReportInput {
  username: String!
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String!
  isAdmin: Boolean
  group: GroupCreateManyWithoutMasterInput
  threads: Int
  lastLogin: DateTime!
  signature: String
  mentor: UserCreateOneInput
  spaceQuota: Int
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  username_ASC
  username_DESC
  nickname_ASC
  nickname_DESC
  password_ASC
  password_DESC
  email_ASC
  email_DESC
  studentID_ASC
  studentID_DESC
  dormitory_ASC
  dormitory_DESC
  qq_ASC
  qq_DESC
  wechat_ASC
  wechat_DESC
  major_ASC
  major_DESC
  className_ASC
  className_DESC
  active_ASC
  active_DESC
  mobile_ASC
  mobile_DESC
  avatar_ASC
  avatar_DESC
  userid_ASC
  userid_DESC
  isAdmin_ASC
  isAdmin_DESC
  threads_ASC
  threads_DESC
  lastLogin_ASC
  lastLogin_DESC
  signature_ASC
  signature_DESC
  spaceQuota_ASC
  spaceQuota_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  username: String!
  nickname: String
  password: String
  email: String!
  studentID: String!
  dormitory: String!
  qq: String!
  wechat: String!
  major: String!
  className: String!
  active: Boolean!
  mobile: String!
  avatar: String!
  userid: String!
  isAdmin: Boolean!
  threads: Int!
  lastLogin: DateTime!
  signature: String!
  spaceQuota: Int
}

input UserScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  username: String
  username_not: String
  username_in: [String!]
  username_not_in: [String!]
  username_lt: String
  username_lte: String
  username_gt: String
  username_gte: String
  username_contains: String
  username_not_contains: String
  username_starts_with: String
  username_not_starts_with: String
  username_ends_with: String
  username_not_ends_with: String
  nickname: String
  nickname_not: String
  nickname_in: [String!]
  nickname_not_in: [String!]
  nickname_lt: String
  nickname_lte: String
  nickname_gt: String
  nickname_gte: String
  nickname_contains: String
  nickname_not_contains: String
  nickname_starts_with: String
  nickname_not_starts_with: String
  nickname_ends_with: String
  nickname_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  studentID: String
  studentID_not: String
  studentID_in: [String!]
  studentID_not_in: [String!]
  studentID_lt: String
  studentID_lte: String
  studentID_gt: String
  studentID_gte: String
  studentID_contains: String
  studentID_not_contains: String
  studentID_starts_with: String
  studentID_not_starts_with: String
  studentID_ends_with: String
  studentID_not_ends_with: String
  dormitory: String
  dormitory_not: String
  dormitory_in: [String!]
  dormitory_not_in: [String!]
  dormitory_lt: String
  dormitory_lte: String
  dormitory_gt: String
  dormitory_gte: String
  dormitory_contains: String
  dormitory_not_contains: String
  dormitory_starts_with: String
  dormitory_not_starts_with: String
  dormitory_ends_with: String
  dormitory_not_ends_with: String
  qq: String
  qq_not: String
  qq_in: [String!]
  qq_not_in: [String!]
  qq_lt: String
  qq_lte: String
  qq_gt: String
  qq_gte: String
  qq_contains: String
  qq_not_contains: String
  qq_starts_with: String
  qq_not_starts_with: String
  qq_ends_with: String
  qq_not_ends_with: String
  wechat: String
  wechat_not: String
  wechat_in: [String!]
  wechat_not_in: [String!]
  wechat_lt: String
  wechat_lte: String
  wechat_gt: String
  wechat_gte: String
  wechat_contains: String
  wechat_not_contains: String
  wechat_starts_with: String
  wechat_not_starts_with: String
  wechat_ends_with: String
  wechat_not_ends_with: String
  major: String
  major_not: String
  major_in: [String!]
  major_not_in: [String!]
  major_lt: String
  major_lte: String
  major_gt: String
  major_gte: String
  major_contains: String
  major_not_contains: String
  major_starts_with: String
  major_not_starts_with: String
  major_ends_with: String
  major_not_ends_with: String
  className: String
  className_not: String
  className_in: [String!]
  className_not_in: [String!]
  className_lt: String
  className_lte: String
  className_gt: String
  className_gte: String
  className_contains: String
  className_not_contains: String
  className_starts_with: String
  className_not_starts_with: String
  className_ends_with: String
  className_not_ends_with: String
  active: Boolean
  active_not: Boolean
  mobile: String
  mobile_not: String
  mobile_in: [String!]
  mobile_not_in: [String!]
  mobile_lt: String
  mobile_lte: String
  mobile_gt: String
  mobile_gte: String
  mobile_contains: String
  mobile_not_contains: String
  mobile_starts_with: String
  mobile_not_starts_with: String
  mobile_ends_with: String
  mobile_not_ends_with: String
  avatar: String
  avatar_not: String
  avatar_in: [String!]
  avatar_not_in: [String!]
  avatar_lt: String
  avatar_lte: String
  avatar_gt: String
  avatar_gte: String
  avatar_contains: String
  avatar_not_contains: String
  avatar_starts_with: String
  avatar_not_starts_with: String
  avatar_ends_with: String
  avatar_not_ends_with: String
  userid: String
  userid_not: String
  userid_in: [String!]
  userid_not_in: [String!]
  userid_lt: String
  userid_lte: String
  userid_gt: String
  userid_gte: String
  userid_contains: String
  userid_not_contains: String
  userid_starts_with: String
  userid_not_starts_with: String
  userid_ends_with: String
  userid_not_ends_with: String
  isAdmin: Boolean
  isAdmin_not: Boolean
  threads: Int
  threads_not: Int
  threads_in: [Int!]
  threads_not_in: [Int!]
  threads_lt: Int
  threads_lte: Int
  threads_gt: Int
  threads_gte: Int
  lastLogin: DateTime
  lastLogin_not: DateTime
  lastLogin_in: [DateTime!]
  lastLogin_not_in: [DateTime!]
  lastLogin_lt: DateTime
  lastLogin_lte: DateTime
  lastLogin_gt: DateTime
  lastLogin_gte: DateTime
  signature: String
  signature_not: String
  signature_in: [String!]
  signature_not_in: [String!]
  signature_lt: String
  signature_lte: String
  signature_gt: String
  signature_gte: String
  signature_contains: String
  signature_not_contains: String
  signature_starts_with: String
  signature_not_starts_with: String
  signature_ends_with: String
  signature_not_ends_with: String
  spaceQuota: Int
  spaceQuota_not: Int
  spaceQuota_in: [Int!]
  spaceQuota_not_in: [Int!]
  spaceQuota_lt: Int
  spaceQuota_lte: Int
  spaceQuota_gt: Int
  spaceQuota_gte: Int
  AND: [UserScalarWhereInput!]
  OR: [UserScalarWhereInput!]
  NOT: [UserScalarWhereInput!]
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateDataInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  group: GroupUpdateManyWithoutMasterInput
  threads: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
  report: ReportUpdateManyWithoutUserInput
  spaceQuota: Int
}

input UserUpdateInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  group: GroupUpdateManyWithoutMasterInput
  threads: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
  report: ReportUpdateManyWithoutUserInput
  spaceQuota: Int
}

input UserUpdateManyDataInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  threads: Int
  lastLogin: DateTime
  signature: String
  spaceQuota: Int
}

input UserUpdateManyInput {
  create: [UserCreateInput!]
  update: [UserUpdateWithWhereUniqueNestedInput!]
  upsert: [UserUpsertWithWhereUniqueNestedInput!]
  delete: [UserWhereUniqueInput!]
  connect: [UserWhereUniqueInput!]
  disconnect: [UserWhereUniqueInput!]
  deleteMany: [UserScalarWhereInput!]
  updateMany: [UserUpdateManyWithWhereNestedInput!]
}

input UserUpdateManyMutationInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  threads: Int
  lastLogin: DateTime
  signature: String
  spaceQuota: Int
}

input UserUpdateManyWithWhereNestedInput {
  where: UserScalarWhereInput!
  data: UserUpdateManyDataInput!
}

input UserUpdateOneInput {
  create: UserCreateInput
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateOneRequiredInput {
  create: UserCreateInput
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneRequiredWithoutReportInput {
  create: UserCreateWithoutReportInput
  update: UserUpdateWithoutReportDataInput
  upsert: UserUpsertWithoutReportInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneWithoutGroupInput {
  create: UserCreateWithoutGroupInput
  update: UserUpdateWithoutGroupDataInput
  upsert: UserUpsertWithoutGroupInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutGroupDataInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  threads: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
  report: ReportUpdateManyWithoutUserInput
  spaceQuota: Int
}

input UserUpdateWithoutReportDataInput {
  username: String
  nickname: String
  password: String
  email: String
  studentID: String
  dormitory: String
  qq: String
  wechat: String
  major: String
  className: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  group: GroupUpdateManyWithoutMasterInput
  threads: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
  spaceQuota: Int
}

input UserUpdateWithWhereUniqueNestedInput {
  where: UserWhereUniqueInput!
  data: UserUpdateDataInput!
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserUpsertWithoutGroupInput {
  update: UserUpdateWithoutGroupDataInput!
  create: UserCreateWithoutGroupInput!
}

input UserUpsertWithoutReportInput {
  update: UserUpdateWithoutReportDataInput!
  create: UserCreateWithoutReportInput!
}

input UserUpsertWithWhereUniqueNestedInput {
  where: UserWhereUniqueInput!
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  username: String
  username_not: String
  username_in: [String!]
  username_not_in: [String!]
  username_lt: String
  username_lte: String
  username_gt: String
  username_gte: String
  username_contains: String
  username_not_contains: String
  username_starts_with: String
  username_not_starts_with: String
  username_ends_with: String
  username_not_ends_with: String
  nickname: String
  nickname_not: String
  nickname_in: [String!]
  nickname_not_in: [String!]
  nickname_lt: String
  nickname_lte: String
  nickname_gt: String
  nickname_gte: String
  nickname_contains: String
  nickname_not_contains: String
  nickname_starts_with: String
  nickname_not_starts_with: String
  nickname_ends_with: String
  nickname_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  studentID: String
  studentID_not: String
  studentID_in: [String!]
  studentID_not_in: [String!]
  studentID_lt: String
  studentID_lte: String
  studentID_gt: String
  studentID_gte: String
  studentID_contains: String
  studentID_not_contains: String
  studentID_starts_with: String
  studentID_not_starts_with: String
  studentID_ends_with: String
  studentID_not_ends_with: String
  dormitory: String
  dormitory_not: String
  dormitory_in: [String!]
  dormitory_not_in: [String!]
  dormitory_lt: String
  dormitory_lte: String
  dormitory_gt: String
  dormitory_gte: String
  dormitory_contains: String
  dormitory_not_contains: String
  dormitory_starts_with: String
  dormitory_not_starts_with: String
  dormitory_ends_with: String
  dormitory_not_ends_with: String
  qq: String
  qq_not: String
  qq_in: [String!]
  qq_not_in: [String!]
  qq_lt: String
  qq_lte: String
  qq_gt: String
  qq_gte: String
  qq_contains: String
  qq_not_contains: String
  qq_starts_with: String
  qq_not_starts_with: String
  qq_ends_with: String
  qq_not_ends_with: String
  wechat: String
  wechat_not: String
  wechat_in: [String!]
  wechat_not_in: [String!]
  wechat_lt: String
  wechat_lte: String
  wechat_gt: String
  wechat_gte: String
  wechat_contains: String
  wechat_not_contains: String
  wechat_starts_with: String
  wechat_not_starts_with: String
  wechat_ends_with: String
  wechat_not_ends_with: String
  major: String
  major_not: String
  major_in: [String!]
  major_not_in: [String!]
  major_lt: String
  major_lte: String
  major_gt: String
  major_gte: String
  major_contains: String
  major_not_contains: String
  major_starts_with: String
  major_not_starts_with: String
  major_ends_with: String
  major_not_ends_with: String
  className: String
  className_not: String
  className_in: [String!]
  className_not_in: [String!]
  className_lt: String
  className_lte: String
  className_gt: String
  className_gte: String
  className_contains: String
  className_not_contains: String
  className_starts_with: String
  className_not_starts_with: String
  className_ends_with: String
  className_not_ends_with: String
  active: Boolean
  active_not: Boolean
  mobile: String
  mobile_not: String
  mobile_in: [String!]
  mobile_not_in: [String!]
  mobile_lt: String
  mobile_lte: String
  mobile_gt: String
  mobile_gte: String
  mobile_contains: String
  mobile_not_contains: String
  mobile_starts_with: String
  mobile_not_starts_with: String
  mobile_ends_with: String
  mobile_not_ends_with: String
  avatar: String
  avatar_not: String
  avatar_in: [String!]
  avatar_not_in: [String!]
  avatar_lt: String
  avatar_lte: String
  avatar_gt: String
  avatar_gte: String
  avatar_contains: String
  avatar_not_contains: String
  avatar_starts_with: String
  avatar_not_starts_with: String
  avatar_ends_with: String
  avatar_not_ends_with: String
  userid: String
  userid_not: String
  userid_in: [String!]
  userid_not_in: [String!]
  userid_lt: String
  userid_lte: String
  userid_gt: String
  userid_gte: String
  userid_contains: String
  userid_not_contains: String
  userid_starts_with: String
  userid_not_starts_with: String
  userid_ends_with: String
  userid_not_ends_with: String
  isAdmin: Boolean
  isAdmin_not: Boolean
  group_every: GroupWhereInput
  group_some: GroupWhereInput
  group_none: GroupWhereInput
  threads: Int
  threads_not: Int
  threads_in: [Int!]
  threads_not_in: [Int!]
  threads_lt: Int
  threads_lte: Int
  threads_gt: Int
  threads_gte: Int
  lastLogin: DateTime
  lastLogin_not: DateTime
  lastLogin_in: [DateTime!]
  lastLogin_not_in: [DateTime!]
  lastLogin_lt: DateTime
  lastLogin_lte: DateTime
  lastLogin_gt: DateTime
  lastLogin_gte: DateTime
  signature: String
  signature_not: String
  signature_in: [String!]
  signature_not_in: [String!]
  signature_lt: String
  signature_lte: String
  signature_gt: String
  signature_gte: String
  signature_contains: String
  signature_not_contains: String
  signature_starts_with: String
  signature_not_starts_with: String
  signature_ends_with: String
  signature_not_ends_with: String
  mentor: UserWhereInput
  report_every: ReportWhereInput
  report_some: ReportWhereInput
  report_none: ReportWhereInput
  spaceQuota: Int
  spaceQuota_not: Int
  spaceQuota_in: [Int!]
  spaceQuota_not_in: [Int!]
  spaceQuota_lt: Int
  spaceQuota_lte: Int
  spaceQuota_gt: Int
  spaceQuota_gte: Int
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  userid: String
}
`