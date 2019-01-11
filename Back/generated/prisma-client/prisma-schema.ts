export const typeDefs = /* GraphQL */ `type AggregateAttach {
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

type AggregateThread {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type Attach {
  id: ID!
  user: User!
  post: Post!
  thread: Thread!
  forum: Forum!
  filesize: Int!
  downloads: Int!
  fileName: String!
}

type AttachConnection {
  pageInfo: PageInfo!
  edges: [AttachEdge]!
  aggregate: AggregateAttach!
}

input AttachCreateInput {
  user: UserCreateOneInput!
  post: PostCreateOneInput!
  thread: ThreadCreateOneWithoutAttachInput!
  forum: ForumCreateOneInput!
  filesize: Int!
  downloads: Int
  fileName: String!
}

input AttachCreateManyWithoutThreadInput {
  create: [AttachCreateWithoutThreadInput!]
  connect: [AttachWhereUniqueInput!]
}

input AttachCreateWithoutThreadInput {
  user: UserCreateOneInput!
  post: PostCreateOneInput!
  forum: ForumCreateOneInput!
  filesize: Int!
  downloads: Int
  fileName: String!
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
  user: UserUpdateOneRequiredInput
  post: PostUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutAttachInput
  forum: ForumUpdateOneRequiredInput
  filesize: Int
  downloads: Int
  fileName: String
}

input AttachUpdateManyDataInput {
  filesize: Int
  downloads: Int
  fileName: String
}

input AttachUpdateManyMutationInput {
  filesize: Int
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
  user: UserUpdateOneRequiredInput
  post: PostUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  filesize: Int
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
  id: ID
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type Forum {
  id: ID!
  name: String!
  threads: Int!
  lastPost: Post
}

type ForumConnection {
  pageInfo: PageInfo!
  edges: [ForumEdge]!
  aggregate: AggregateForum!
}

input ForumCreateInput {
  name: String!
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
  name: String!
  threads: Int
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
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ForumPreviousValues {
  id: ID!
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
  name: String
  threads: Int
  lastPost: PostUpdateOneWithoutForumInput
}

input ForumUpdateInput {
  name: String
  threads: Int
  lastPost: PostUpdateOneWithoutForumInput
}

input ForumUpdateManyMutationInput {
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
  name: String
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
  AND: [ForumWhereInput!]
  OR: [ForumWhereInput!]
  NOT: [ForumWhereInput!]
}

input ForumWhereUniqueInput {
  id: ID
}

type Group {
  id: ID!
  name: String!
  master: User
  key: Int!
}

type GroupConnection {
  pageInfo: PageInfo!
  edges: [GroupEdge]!
  aggregate: AggregateGroup!
}

input GroupCreateInput {
  name: String!
  master: UserCreateOneWithoutGroupInput
  key: Int!
}

input GroupCreateManyWithoutMasterInput {
  create: [GroupCreateWithoutMasterInput!]
  connect: [GroupWhereUniqueInput!]
}

input GroupCreateWithoutMasterInput {
  name: String!
  key: Int!
}

type GroupEdge {
  node: Group!
  cursor: String!
}

enum GroupOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  key_ASC
  key_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type GroupPreviousValues {
  id: ID!
  name: String!
  key: Int!
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
  key: Int
  key_not: Int
  key_in: [Int!]
  key_not_in: [Int!]
  key_lt: Int
  key_lte: Int
  key_gt: Int
  key_gte: Int
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

input GroupUpdateInput {
  name: String
  master: UserUpdateOneWithoutGroupInput
  key: Int
}

input GroupUpdateManyDataInput {
  name: String
  key: Int
}

input GroupUpdateManyMutationInput {
  name: String
  key: Int
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
  name: String
  key: Int
}

input GroupUpdateWithWhereUniqueWithoutMasterInput {
  where: GroupWhereUniqueInput!
  data: GroupUpdateWithoutMasterDataInput!
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
  master: UserWhereInput
  key: Int
  key_not: Int
  key_in: [Int!]
  key_not_in: [Int!]
  key_lt: Int
  key_lte: Int
  key_gt: Int
  key_gte: Int
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
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type MessagePreviousValues {
  id: ID!
  message: String!
  isRead: Boolean!
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
}

input MessageUpdateManyMutationInput {
  message: String
  isRead: Boolean
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
  forum: Forum!
  user: User!
  thread: Thread!
  isFirst: Boolean!
  quote: Int!
  message: String!
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  forum: ForumCreateOneWithoutLastPostInput!
  user: UserCreateOneInput!
  thread: ThreadCreateOneWithoutPostInput!
  isFirst: Boolean
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
  user: UserCreateOneInput!
  thread: ThreadCreateOneWithoutPostInput!
  isFirst: Boolean
  quote: Int
  message: String!
}

input PostCreateWithoutThreadInput {
  forum: ForumCreateOneWithoutLastPostInput!
  user: UserCreateOneInput!
  isFirst: Boolean
  quote: Int
  message: String!
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
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PostPreviousValues {
  id: ID!
  isFirst: Boolean!
  quote: Int!
  message: String!
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
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  isFirst: Boolean
  quote: Int
  message: String
}

input PostUpdateInput {
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  isFirst: Boolean
  quote: Int
  message: String
}

input PostUpdateManyDataInput {
  isFirst: Boolean
  quote: Int
  message: String
}

input PostUpdateManyMutationInput {
  isFirst: Boolean
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
  user: UserUpdateOneRequiredInput
  thread: ThreadUpdateOneRequiredWithoutPostInput
  isFirst: Boolean
  quote: Int
  message: String
}

input PostUpdateWithoutThreadDataInput {
  forum: ForumUpdateOneRequiredWithoutLastPostInput
  user: UserUpdateOneRequiredInput
  isFirst: Boolean
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
  forum: ForumWhereInput
  user: UserWhereInput
  thread: ThreadWhereInput
  isFirst: Boolean
  isFirst_not: Boolean
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
  id: ID
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
  message(where: MessageWhereUniqueInput!): Message
  messages(where: MessageWhereInput, orderBy: MessageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Message]!
  messagesConnection(where: MessageWhereInput, orderBy: MessageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): MessageConnection!
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
  message(where: MessageSubscriptionWhereInput): MessageSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
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
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
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
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
  post: PostCreateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
}

input ThreadCreateWithoutPostInput {
  user: UserCreateOneInput!
  forum: ForumCreateOneInput!
  subject: String!
  active: Boolean
  postCount: Int
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
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
  post: PostUpdateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
  attach: AttachUpdateManyWithoutThreadInput
}

input ThreadUpdateManyMutationInput {
  subject: String
  active: Boolean
  postCount: Int
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
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
  post: PostUpdateManyWithoutThreadInput
  top: Boolean
  closed: Boolean
  diamond: Boolean
}

input ThreadUpdateWithoutPostDataInput {
  user: UserUpdateOneRequiredInput
  forum: ForumUpdateOneRequiredInput
  subject: String
  active: Boolean
  postCount: Int
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
  id: ID
}

type User {
  id: ID!
  username: String!
  active: Boolean!
  mobile: String!
  avatar: String!
  userid: String!
  isAdmin: Boolean!
  group(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group!]
  posts: Int!
  lastLogin: DateTime!
  signature: String!
  mentor: User
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  username: String!
  active: Boolean
  mobile: String
  avatar: String
  userid: String!
  isAdmin: Boolean
  group: GroupCreateManyWithoutMasterInput
  posts: Int
  lastLogin: DateTime!
  signature: String
  mentor: UserCreateOneInput
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutGroupInput {
  create: UserCreateWithoutGroupInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutGroupInput {
  username: String!
  active: Boolean
  mobile: String
  avatar: String
  userid: String!
  isAdmin: Boolean
  posts: Int
  lastLogin: DateTime!
  signature: String
  mentor: UserCreateOneInput
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
  posts_ASC
  posts_DESC
  lastLogin_ASC
  lastLogin_DESC
  signature_ASC
  signature_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  username: String!
  active: Boolean!
  mobile: String!
  avatar: String!
  userid: String!
  isAdmin: Boolean!
  posts: Int!
  lastLogin: DateTime!
  signature: String!
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
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  group: GroupUpdateManyWithoutMasterInput
  posts: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
}

input UserUpdateInput {
  username: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  group: GroupUpdateManyWithoutMasterInput
  posts: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
}

input UserUpdateManyMutationInput {
  username: String
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  posts: Int
  lastLogin: DateTime
  signature: String
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
  active: Boolean
  mobile: String
  avatar: String
  userid: String
  isAdmin: Boolean
  posts: Int
  lastLogin: DateTime
  signature: String
  mentor: UserUpdateOneInput
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserUpsertWithoutGroupInput {
  update: UserUpdateWithoutGroupDataInput!
  create: UserCreateWithoutGroupInput!
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
  posts: Int
  posts_not: Int
  posts_in: [Int!]
  posts_not_in: [Int!]
  posts_lt: Int
  posts_lte: Int
  posts_gt: Int
  posts_gte: Int
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
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  userid: String
}
`