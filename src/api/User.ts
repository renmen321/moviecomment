import request from "@/utils/request";
export const getUserPage = (pageNum: number, pageSize: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total: number;
    list: {
      id: number;
      name : string;
      email: string;
      profilePicture: string;
      admin: boolean;
      username: string;
      personalLabel: string;
      favoriteType: string;
      likedMovies: string[];
    }[]
  }
}> => request.get(`/admin/user/page?pageNum=${pageNum}&pageSize=${pageSize}`)