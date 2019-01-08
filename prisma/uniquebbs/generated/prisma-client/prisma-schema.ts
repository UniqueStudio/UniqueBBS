export const typeDefs = /* GraphQL */ `type AggregateAttach {
  count: Int!
}

type AggregateForum {
  count: Int!
}

type AggregateGroup {
  count: Int!
}

type AggregatePost {
  count: Int!
}

type AggregateThread {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type Attach {
  aid: Int!
  user: User!
  post: Post!
  thread: Thread!
  forum: Forum!
  filesize: Int!
  time: DateTime!
  downloads: Int!
  fileName: String!
}

type AttachConnection {
  pageInfo: PageInfo!
  edges: [AttachEdge]!
  aggregate: AggregateAttach!
}

input AttachCreateInput {
  aid: Int!
  user: UserCreateOneInput!
  post: PostCreateOneInput!
  thread: ThreadCreateOneWithoutAttachInput!
  forum: ForumCreateOneInput!
  filesize: Int!
  time: DateTime!
  downloads: Int
  fileName: String!
}

input AttachCreateManyWithoutThreadInput {
  create: [AttachCreateWithoutThreadInput!]
  connect: [AttachWhereUniqueInput!]
}

input AttachCreateWithoutThreadInput {
  aid: Int!
  user: UserCreateOneInput!
  post: PostCreateOneInput!
  forum: ForumCreateOneInput!
  filesize: Int!
  time: DateTime!
  downloads: Int
  fileName: String!
}

type AttachEdge {
  node: Attach!
  cursor: String!
}

enum AttachOrderByInput {
  aid_ASC
  aid_DESC
  filesize_ASC
  filesize_DESC
  time_ASC
  time_DESC
  downloads_ASC
  downloads_DESC
  fileName_ASC
  fileName_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type AttachPreviousValues {
  aid: Int!
  filesize: Int!
  time: DateTime!
  downloads: Int!
  fileName: String!
}

input AttachScalarWhereInput {
  aid: Int
  aid_not: Int
  aid_in: [Int!]
  aid_not_in: [Int!]
  aid_lt: Int
  aid_lte: Int
  aid_gt: Int
  aid_gte: Int
  filesize: Int
  filesize_not: Int
  filesize_in: [Int!]
  filesize_not_in: [Int!]
  filesize_lt: Int
  filesize_lte: Int
  filesize_gt: Int
  filesize_gte: Int
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
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
  aid: Int
  user: UserUpdateOneRequiredInput
  post: PostUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutAttachInput
  forum: ForumUpdateOneRequiredInput
  filesize: Int
  time: DateTime
  downloads: Int
  fileName: String
}

input AttachUpdateManyDataInput {
  aid: Int
  filesize: Int
  time: DateTime
  downloads: Int
  fileName: String
}

input AttachUpdateManyMutationInput {
  aid: Int
  filesize: Int
  time: DateTime
  downloads: Int
  fileName: String
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
  aid: Int
  user: UserUpdateOneRequiredInput
  post: PostUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  filesize: Int
  time: DateTime
  downloads: Int
  fileName: String
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
  aid: Int
  aid_not: Int
  aid_in: [Int!]
  aid_not_in: [Int!]
  aid_lt: Int
  aid_lte: Int
  aid_gt: Int
  aid_gte: Int
  user: UserWhereInput
  post: PostWhereInput
  thread: ThreadWhereInput
  forum: ForumWhereInput
  filesize: Int
  filesize_not: Int
  filesize_in: [Int!]
  filesize_not_in: [Int!]
  filesize_lt: Int
  filesize_lte: Int
  filesize_gt: Int
  filesize_gte: Int
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
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
  AND: [AttachWhereInput!]
  OR: [AttachWhereInput!]
  NOT: [AttachWhereInput!]
}

input AttachWhereUniqueInput {
  aid: Int
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type Forum {
  fid: Int!
  name: String!
  master(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User!]
  threads: Int!
  lastPost: Post
}

type ForumConnection {
  pageInfo: PageInfo!
  edges: [ForumEdge]!
  aggregate: AggregateForum!
}

input ForumCreateInput {
  fid: Int!
  name: String!
  master: UserCreateManyInput
  threads: Int
  lastPost: PostCreateOneWithoutForumInput
}

input ForumCreateOneInput {
  create: ForumCreateInput
  connect: ForumWhereUniqueInput
}

input ForumCreateOneWithoutLastPostInput {
  create: ForumCreateWithoutLastPostInput
  connect: ForumWhereUniqueInput
}

input ForumCreateWithoutLastPostInput {
  fid: Int!
  name: String!
  master: UserCreateManyInput
  threads: Int
}

type ForumEdge {
  node: Forum!
  cursor: String!
}

enum ForumOrderByInput {
  fid_ASC
  fid_DESC
  name_ASC
  name_DESC
  threads_ASC
  threads_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ForumPreviousValues {
  fid: Int!
  name: String!
  threads: Int!
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
  fid: Int
  name: String
  master: UserUpdateManyInput
  threads: Int
  lastPost: PostUpdateOneWithoutForumInput
}

input ForumUpdateInput {
  fid: Int
  name: String
  master: UserUpdateManyInput
  threads: Int
  lastPost: PostUpdateOneWithoutForumInput
}

input ForumUpdateManyMutationInput {
  fid: Int
  name: String
  threads: Int
}

input ForumUpdateOneRequiredInput {
  create: ForumCreateInput
  update: ForumUpdateDataInput
  upsert: ForumUpsertNestedInput
  connect: ForumWhereUniqueInput
}

input ForumUpdateOneRequiredWithoutLastPostInput {
  create: ForumCreateWithoutLastPostInput
  update: ForumUpdateWithoutLastPostDataInput
  upsert: ForumUpsertWithoutLastPostInput
  connect: ForumWhereUniqueInput
}

input ForumUpdateWithoutLastPostDataInput {
  fid: Int
  name: String
  master: UserUpdateManyInput
  threads: Int
}

input ForumUpsertNestedInput {
  update: ForumUpdateDataInput!
  create: ForumCreateInput!
}

input ForumUpsertWithoutLastPostInput {
  update: ForumUpdateWithoutLastPostDataInput!
  create: ForumCreateWithoutLastPostInput!
}

input ForumWhereInput {
  fid: Int
  fid_not: Int
  fid_in: [Int!]
  fid_not_in: [Int!]
  fid_lt: Int
  fid_lte: Int
  fid_gt: Int
  fid_gte: Int
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
  master_every: UserWhereInput
  master_some: UserWhereInput
  master_none: UserWhereInput
  threads: Int
  threads_not: Int
  threads_in: [Int!]
  threads_not_in: [Int!]
  threads_lt: Int
  threads_lte: Int
  threads_gt: Int
  threads_gte: Int
  lastPost: PostWhereInput
  AND: [ForumWhereInput!]
  OR: [ForumWhereInput!]
  NOT: [ForumWhereInput!]
}

input ForumWhereUniqueInput {
  fid: Int
}

type Group {
  gid: Int!
  name: String!
  master(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User!]
}

type GroupConnection {
  pageInfo: PageInfo!
  edges: [GroupEdge]!
  aggregate: AggregateGroup!
}

input GroupCreateInput {
  gid: Int!
  name: String!
  master: UserCreateManyWithoutGroupInput
}

input GroupCreateOneWithoutMasterInput {
  create: GroupCreateWithoutMasterInput
  connect: GroupWhereUniqueInput
}

input GroupCreateWithoutMasterInput {
  gid: Int!
  name: String!
}

type GroupEdge {
  node: Group!
  cursor: String!
}

enum GroupOrderByInput {
  gid_ASC
  gid_DESC
  name_ASC
  name_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type GroupPreviousValues {
  gid: Int!
  name: String!
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

input GroupUpdateInput {
  gid: Int
  name: String
  master: UserUpdateManyWithoutGroupInput
}

input GroupUpdateManyMutationInput {
  gid: Int
  name: String
}

input GroupUpdateOneRequiredWithoutMasterInput {
  create: GroupCreateWithoutMasterInput
  update: GroupUpdateWithoutMasterDataInput
  upsert: GroupUpsertWithoutMasterInput
  connect: GroupWhereUniqueInput
}

input GroupUpdateWithoutMasterDataInput {
  gid: Int
  name: String
}

input GroupUpsertWithoutMasterInput {
  update: GroupUpdateWithoutMasterDataInput!
  create: GroupCreateWithoutMasterInput!
}

input GroupWhereInput {
  gid: Int
  gid_not: Int
  gid_in: [Int!]
  gid_not_in: [Int!]
  gid_lt: Int
  gid_lte: Int
  gid_gt: Int
  gid_gte: Int
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
  master_every: UserWhereInput
  master_some: UserWhereInput
  master_none: UserWhereInput
  AND: [GroupWhereInput!]
  OR: [GroupWhereInput!]
  NOT: [GroupWhereInput!]
}

input GroupWhereUniqueInput {
  gid: Int
}

scalar Long

type Mutation {
  createAttach(data: AttachCreateInput!): Attach!
  updateAttach(data: AttachUpdateInput!, where: AttachWhereUniqueInput!): Attach
  updateManyAttaches(data: AttachUpdateManyMutationInput!, where: AttachWhereInput): BatchPayload!
  upsertAttach(where: AttachWhereUniqueInput!, create: AttachCreateInput!, update: AttachUpdateInput!): Attach!
  deleteAttach(where: AttachWhereUniqueInput!): Attach
  deleteManyAttaches(where: AttachWhereInput): BatchPayload!
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
  createPost(data: PostCreateInput!): Post!
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateManyPosts(data: PostUpdateManyMutationInput!, where: PostWhereInput): BatchPayload!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  deletePost(where: PostWhereUniqueInput!): Post
  deleteManyPosts(where: PostWhereInput): BatchPayload!
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
  pid: Int!
  forum: Forum!
  user: User!
  thread: Thread!
  time: DateTime!
  isFirst: Int!
  quote: Int!
  message: String!
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  pid: Int!
  forum: ForumCreateOneWithoutLastPostInput!
  user: UserCreateOneInput!
  thread: ThreadCreateOneWithoutPostInput!
  time: DateTime!
  isFirst: Int
  quote: Int
  message: String!
}

input PostCreateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  connect: [PostWhereUniqueInput!]
}

input PostCreateOneInput {
  create: PostCreateInput
  connect: PostWhereUniqueInput
}

input PostCreateOneWithoutForumInput {
  create: PostCreateWithoutForumInput
  connect: PostWhereUniqueInput
}

input PostCreateWithoutForumInput {
  pid: Int!
  user: UserCreateOneInput!
  thread: ThreadCreateOneWithoutPostInput!
  time: DateTime!
  isFirst: Int
  quote: Int
  message: String!
}

input PostCreateWithoutThreadInput {
  pid: Int!
  forum: ForumCreateOneWithoutLastPostInput!
  user: UserCreateOneInput!
  time: DateTime!
  isFirst: Int
  quote: Int
  message: String!
}

type PostEdge {
  node: Post!
  cursor: String!
}

enum PostOrderByInput {
  pid_ASC
  pid_DESC
  time_ASC
  time_DESC
  isFirst_ASC
  isFirst_DESC
  quote_ASC
  quote_DESC
  message_ASC
  message_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PostPreviousValues {
  pid: Int!
  time: DateTime!
  isFirst: Int!
  quote: Int!
  message: String!
}

input PostScalarWhereInput {
  pid: Int
  pid_not: Int
  pid_in: [Int!]
  pid_not_in: [Int!]
  pid_lt: Int
  pid_lte: Int
  pid_gt: Int
  pid_gte: Int
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
  isFirst: Int
  isFirst_not: Int
  isFirst_in: [Int!]
  isFirst_not_in: [Int!]
  isFirst_lt: Int
  isFirst_lte: Int
  isFirst_gt: Int
  isFirst_gte: Int
  quote: Int
  quote_not: Int
  quote_in: [Int!]
  quote_not_in: [Int!]
  quote_lt: Int
  quote_lte: Int
  quote_gt: Int
  quote_gte: Int
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
  pid: Int
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
}

input PostUpdateInput {
  pid: Int
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
}

input PostUpdateManyDataInput {
  pid: Int
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
}

input PostUpdateManyMutationInput {
  pid: Int
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
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

input PostUpdateOneRequiredInput {
  create: PostCreateInput
  update: PostUpdateDataInput
  upsert: PostUpsertNestedInput
  connect: PostWhereUniqueInput
}

input PostUpdateOneWithoutForumInput {
  create: PostCreateWithoutForumInput
  update: PostUpdateWithoutForumDataInput
  upsert: PostUpsertWithoutForumInput
  delete: Boolean
  disconnect: Boolean
  connect: PostWhereUniqueInput
}

input PostUpdateWithoutForumDataInput {
  pid: Int
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
}

input PostUpdateWithoutThreadDataInput {
  pid: Int
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  time: DateTime
  isFirst: Int
  quote: Int
  message: String
}

input PostUpdateWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  data: PostUpdateWithoutThreadDataInput!
}

input PostUpsertNestedInput {
  update: PostUpdateDataInput!
  create: PostCreateInput!
}

input PostUpsertWithoutForumInput {
  update: PostUpdateWithoutForumDataInput!
  create: PostCreateWithoutForumInput!
}

input PostUpsertWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  update: PostUpdateWithoutThreadDataInput!
  create: PostCreateWithoutThreadInput!
}

input PostWhereInput {
  pid: Int
  pid_not: Int
  pid_in: [Int!]
  pid_not_in: [Int!]
  pid_lt: Int
  pid_lte: Int
  pid_gt: Int
  pid_gte: Int
  forum: ForumWhereInput
  user: UserWhereInput
  thread: ThreadWhereInput
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
  isFirst: Int
  isFirst_not: Int
  isFirst_in: [Int!]
  isFirst_not_in: [Int!]
  isFirst_lt: Int
  isFirst_lte: Int
  isFirst_gt: Int
  isFirst_gte: Int
  quote: Int
  quote_not: Int
  quote_in: [Int!]
  quote_not_in: [Int!]
  quote_lt: Int
  quote_lte: Int
  quote_gt: Int
  quote_gte: Int
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
  AND: [PostWhereInput!]
  OR: [PostWhereInput!]
  NOT: [PostWhereInput!]
}

input PostWhereUniqueInput {
  pid: Int
}

type Query {
  attach(where: AttachWhereUniqueInput!): Attach
  attaches(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attach]!
  attachesConnection(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): AttachConnection!
  forum(where: ForumWhereUniqueInput!): Forum
  forums(where: ForumWhereInput, orderBy: ForumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Forum]!
  forumsConnection(where: ForumWhereInput, orderBy: ForumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ForumConnection!
  group(where: GroupWhereUniqueInput!): Group
  groups(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group]!
  groupsConnection(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): GroupConnection!
  post(where: PostWhereUniqueInput!): Post
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  thread(where: ThreadWhereUniqueInput!): Thread
  threads(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Thread]!
  threadsConnection(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ThreadConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  attach(where: AttachSubscriptionWhereInput): AttachSubscriptionPayload
  forum(where: ForumSubscriptionWhereInput): ForumSubscriptionPayload
  group(where: GroupSubscriptionWhereInput): GroupSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  thread(where: ThreadSubscriptionWhereInput): ThreadSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type Thread {
  tid: Int!
  user: User!
  forum: Forum!
  time: DateTime!
  subject: String!
  post(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post!]
  top: Boolean!
  closed: Boolean!
  diamond: Boolean!
  attach(where: AttachWhereInput, orderBy: AttachOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attach!]
}

type ThreadConnection {
  pageInfo: PageInfo!
  edges: [ThreadEdge]!
  aggregate: AggregateThread!
}

input ThreadCreateInput {
  tid: Int!
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  time: DateTime!
  subject: String!
  post: PostCreateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
  attach: AttachCreateManyWithoutThreadInput
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
  tid: Int!
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  time: DateTime!
  subject: String!
  post: PostCreateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
}

input ThreadCreateWithoutPostInput {
  tid: Int!
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  time: DateTime!
  subject: String!
  top: Boolean
  closed: Boolean
  diamond: Boolean
  attach: AttachCreateManyWithoutThreadInput
}

type ThreadEdge {
  node: Thread!
  cursor: String!
}

enum ThreadOrderByInput {
  tid_ASC
  tid_DESC
  time_ASC
  time_DESC
  subject_ASC
  subject_DESC
  top_ASC
  top_DESC
  closed_ASC
  closed_DESC
  diamond_ASC
  diamond_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ThreadPreviousValues {
  tid: Int!
  time: DateTime!
  subject: String!
  top: Boolean!
  closed: Boolean!
  diamond: Boolean!
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
  tid: Int
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  time: DateTime
  subject: String
  post: PostUpdateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
  attach: AttachUpdateManyWithoutThreadInput
}

input ThreadUpdateManyMutationInput {
  tid: Int
  time: DateTime
  subject: String
  top: Boolean
  closed: Boolean
  diamond: Boolean
}

input ThreadUpdateOneRequiredWithoutAttachInput {
  create: ThreadCreateWithoutAttachInput
  update: ThreadUpdateWithoutAttachDataInput
  upsert: ThreadUpsertWithoutAttachInput
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateOneRequiredWithoutPostInput {
  create: ThreadCreateWithoutPostInput
  update: ThreadUpdateWithoutPostDataInput
  upsert: ThreadUpsertWithoutPostInput
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateWithoutAttachDataInput {
  tid: Int
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  time: DateTime
  subject: String
  post: PostUpdateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
}

input ThreadUpdateWithoutPostDataInput {
  tid: Int
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  time: DateTime
  subject: String
  top: Boolean
  closed: Boolean
  diamond: Boolean
  attach: AttachUpdateManyWithoutThreadInput
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
  tid: Int
  tid_not: Int
  tid_in: [Int!]
  tid_not_in: [Int!]
  tid_lt: Int
  tid_lte: Int
  tid_gt: Int
  tid_gte: Int
  user: UserWhereInput
  forum: ForumWhereInput
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
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
  post_every: PostWhereInput
  post_some: PostWhereInput
  post_none: PostWhereInput
  top: Boolean
  top_not: Boolean
  closed: Boolean
  closed_not: Boolean
  diamond: Boolean
  diamond_not: Boolean
  attach_every: AttachWhereInput
  attach_some: AttachWhereInput
  attach_none: AttachWhereInput
  AND: [ThreadWhereInput!]
  OR: [ThreadWhereInput!]
  NOT: [ThreadWhereInput!]
}

input ThreadWhereUniqueInput {
  tid: Int
}

type User {
  uid: Int!
  openid: Int!
  isAdmin: Boolean!
  group: Group!
  posts: Int!
  time: DateTime!
  lastLogin: Int!
  signature: String!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  uid: Int!
  openid: Int!
  isAdmin: Boolean
  group: GroupCreateOneWithoutMasterInput!
  posts: Int
  time: DateTime!
  lastLogin: Int!
  signature: String
}

input UserCreateManyInput {
  create: [UserCreateInput!]
  connect: [UserWhereUniqueInput!]
}

input UserCreateManyWithoutGroupInput {
  create: [UserCreateWithoutGroupInput!]
  connect: [UserWhereUniqueInput!]
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutGroupInput {
  uid: Int!
  openid: Int!
  isAdmin: Boolean
  posts: Int
  time: DateTime!
  lastLogin: Int!
  signature: String
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  uid_ASC
  uid_DESC
  openid_ASC
  openid_DESC
  isAdmin_ASC
  isAdmin_DESC
  posts_ASC
  posts_DESC
  time_ASC
  time_DESC
  lastLogin_ASC
  lastLogin_DESC
  signature_ASC
  signature_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  uid: Int!
  openid: Int!
  isAdmin: Boolean!
  posts: Int!
  time: DateTime!
  lastLogin: Int!
  signature: String!
}

input UserScalarWhereInput {
  uid: Int
  uid_not: Int
  uid_in: [Int!]
  uid_not_in: [Int!]
  uid_lt: Int
  uid_lte: Int
  uid_gt: Int
  uid_gte: Int
  openid: Int
  openid_not: Int
  openid_in: [Int!]
  openid_not_in: [Int!]
  openid_lt: Int
  openid_lte: Int
  openid_gt: Int
  openid_gte: Int
  isAdmin: Boolean
  isAdmin_not: Boolean
  posts: Int
  posts_not: Int
  posts_in: [Int!]
  posts_not_in: [Int!]
  posts_lt: Int
  posts_lte: Int
  posts_gt: Int
  posts_gte: Int
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
  lastLogin: Int
  lastLogin_not: Int
  lastLogin_in: [Int!]
  lastLogin_not_in: [Int!]
  lastLogin_lt: Int
  lastLogin_lte: Int
  lastLogin_gt: Int
  lastLogin_gte: Int
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
  uid: Int
  openid: Int
  isAdmin: Boolean
  group: GroupUpdateOneRequiredWithoutMasterInput
  posts: Int
  time: DateTime
  lastLogin: Int
  signature: String
}

input UserUpdateInput {
  uid: Int
  openid: Int
  isAdmin: Boolean
  group: GroupUpdateOneRequiredWithoutMasterInput
  posts: Int
  time: DateTime
  lastLogin: Int
  signature: String
}

input UserUpdateManyDataInput {
  uid: Int
  openid: Int
  isAdmin: Boolean
  posts: Int
  time: DateTime
  lastLogin: Int
  signature: String
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
  uid: Int
  openid: Int
  isAdmin: Boolean
  posts: Int
  time: DateTime
  lastLogin: Int
  signature: String
}

input UserUpdateManyWithoutGroupInput {
  create: [UserCreateWithoutGroupInput!]
  delete: [UserWhereUniqueInput!]
  connect: [UserWhereUniqueInput!]
  disconnect: [UserWhereUniqueInput!]
  update: [UserUpdateWithWhereUniqueWithoutGroupInput!]
  upsert: [UserUpsertWithWhereUniqueWithoutGroupInput!]
  deleteMany: [UserScalarWhereInput!]
  updateMany: [UserUpdateManyWithWhereNestedInput!]
}

input UserUpdateManyWithWhereNestedInput {
  where: UserScalarWhereInput!
  data: UserUpdateManyDataInput!
}

input UserUpdateOneRequiredInput {
  create: UserCreateInput
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutGroupDataInput {
  uid: Int
  openid: Int
  isAdmin: Boolean
  posts: Int
  time: DateTime
  lastLogin: Int
  signature: String
}

input UserUpdateWithWhereUniqueNestedInput {
  where: UserWhereUniqueInput!
  data: UserUpdateDataInput!
}

input UserUpdateWithWhereUniqueWithoutGroupInput {
  where: UserWhereUniqueInput!
  data: UserUpdateWithoutGroupDataInput!
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserUpsertWithWhereUniqueNestedInput {
  where: UserWhereUniqueInput!
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserUpsertWithWhereUniqueWithoutGroupInput {
  where: UserWhereUniqueInput!
  update: UserUpdateWithoutGroupDataInput!
  create: UserCreateWithoutGroupInput!
}

input UserWhereInput {
  uid: Int
  uid_not: Int
  uid_in: [Int!]
  uid_not_in: [Int!]
  uid_lt: Int
  uid_lte: Int
  uid_gt: Int
  uid_gte: Int
  openid: Int
  openid_not: Int
  openid_in: [Int!]
  openid_not_in: [Int!]
  openid_lt: Int
  openid_lte: Int
  openid_gt: Int
  openid_gte: Int
  isAdmin: Boolean
  isAdmin_not: Boolean
  group: GroupWhereInput
  posts: Int
  posts_not: Int
  posts_in: [Int!]
  posts_not_in: [Int!]
  posts_lt: Int
  posts_lte: Int
  posts_gt: Int
  posts_gte: Int
  time: DateTime
  time_not: DateTime
  time_in: [DateTime!]
  time_not_in: [DateTime!]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
  lastLogin: Int
  lastLogin_not: Int
  lastLogin_in: [Int!]
  lastLogin_not_in: [Int!]
  lastLogin_lt: Int
  lastLogin_lte: Int
  lastLogin_gt: Int
  lastLogin_gte: Int
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
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  uid: Int
}
`