import request from "@/utils/request";

export const PostFeedback = (data: {
  username: string;
  content: string;
  type: number;
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => request.post('/feedback/add',data)

export const GetFeedback = (pageNum: number, pageSize: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total : number;
    list: {
      id: number;
      content: string;
      username: string;
      type: string;
      date: string;
      status: number;
    }[]
  }
}> => request.get(`/admin/feedback/page?pageNum=${pageNum}&pageSize=${pageSize}`)

export const UpdateFeedbackStatus = (id: number, status: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => request.put(`/admin/feedback/updateStatus?id=${id}&status=${status}`)