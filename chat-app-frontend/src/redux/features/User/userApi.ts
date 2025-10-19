import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserForSingleConversation: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
      }),
      providesTags: ["User"],
    }),
    getUserForGroupConversation: builder.query({
      query: (userId) => ({
        url: `/user/${userId}/group`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createConversation: builder.mutation({
      query: (userInfo) => ({
        url: "/conversation",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserForSingleConversationQuery,
  useGetUserForGroupConversationQuery,
  useCreateConversationMutation,
} = userApi;
