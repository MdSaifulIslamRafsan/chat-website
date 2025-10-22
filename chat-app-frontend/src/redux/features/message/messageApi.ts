import { baseApi } from "../../api/baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (userInfo) => ({
        url: "/message",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Message"],
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/message/${conversationId}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const { useCreateMessageMutation, useGetMessagesQuery } =
  conversationApi;
