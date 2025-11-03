import { baseApi } from "../../api/baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (userInfo) => ({
        url: "/message",
        method: "POST",
        body: userInfo,
      }),
      // invalidatesTags: ["Message"],
    }),
    getMessages: builder.query({
      query: ({ conversationId, page, limit }) => ({
        url: `/message/${conversationId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const { useCreateMessageMutation, useGetMessagesQuery } =
  conversationApi;
