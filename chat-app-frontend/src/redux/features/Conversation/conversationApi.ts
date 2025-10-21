import { baseApi } from "../../api/baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserForSingleConversation: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
      }),
      providesTags: ["Conversation"],
    }),
    getUserForGroupConversation: builder.query({
      query: (userId) => ({
        url: `/user/${userId}/group`,
        method: "GET",
      }),
      providesTags: ["Conversation"],
    }),
    createConversation: builder.mutation({
      query: (userInfo) => ({
        url: "/conversation",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Conversation"],
    }),
    getConversation: builder.query({
      query: (userId) => ({
        url: `/conversation/${userId}`,
        method: "GET",
      }),
      providesTags: ["Conversation"],
    }),
  }),
});

export const {
  useGetUserForSingleConversationQuery,
  useGetUserForGroupConversationQuery,
  useCreateConversationMutation,
  useGetConversationQuery
} = conversationApi;
