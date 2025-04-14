import request from "@/utils/request";

export const reqGetMovies = (pages: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total: number;
    movies: {
      id: number;
      movieChineseName : string;
      type: string;
      ratings: number;
      introduction : string;
      yearOfRelease: number;
      good: number;
      bad: number;
      general : number;
    }[];
  };
}> => request.get(`/movies/page?pages=${pages}`);

export const reqGetMovie = (name :string): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    id: number;
    movieChineseName : string;
    type: string;
    ratings: number;
    good: number;
    bad: number;
    general : number;
  };
}> => request.get(`/movies/getMovieByName?name=${name}`);

export const reqGetAiResult =(data: {
  sentence: string;
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    result: string;
    // reliability: number;
  };
}> => request.post(`http://127.0.0.1:8000/predict`,data);

export const reqGetMovieCommentById = (id: number, pageNum: number, pageSize: number,type: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total: number;
    list: string[];
  };
}> => request.get(`/movies/page/getMovieCommentById?id=${id}&pageNum=${pageNum}&pageSize=${pageSize}&type=${type}`);

export const reqPostComment = (data: {
  id: number;
  comment: string;
  type: number;
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => request.post(`/movies/postComment`,data);

export  const login = (data: {
  username: string;
  password: string;
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    id: number;
    name : string;
    email: string;
    profilePicture: string;
    token: string;
    admin: boolean;
  };
}> => request.post(`http://127.0.0.1:8080/login`,data);