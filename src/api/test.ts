import request from "@/utils/request";

export const reqGetMovies = (pageNum: number, pageSize: number): Promise<{
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
      image: string;
    }[];
  };
}> => request.get(`/movies/page?pageNum=${pageNum}&pageSize=${pageSize}`);

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
    image: string;
  };
}> => request.get(`/movies/getMovieByName?name=${name}`);

export const reqGetAiResult =(data: {
  sentence: string;
}): Promise<{
    prediction_result: string;
    probabilities: number;
}> => request.post(`http://127.0.0.1:5000/predict`,data);

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
   movieId: number;
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
    username: string;
    personalLabel: string;
    favoriteType: string;
    likeMovies: string[];
  };
}> => request.post(`/user/login`,data);

export const register = (data: {
  username: string;
  password: string;
  email: string;
  code: string;
  profilePicture?: File; // 添加文件类型
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('email', data.email);
  formData.append('code', data.code);

  // 如果有 profilePicture 文件，则添加到 formData
  if (data.profilePicture) {
    formData.append('profilePicture', data.profilePicture);
  }

  return request.post(`/user/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const sendCode = (email: string): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => request.post(`/user/sendCode?email=${email}`);

//获取管理员看到的评论
export const reqGetAdminCommentByDate = (date: string,pageNum: number, pageSize: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total: number;
    list: {
      username : string;
      comment: string;
      type :string;
      movieName :string;
      date: string;
    }[];
  };
}> => request.get(`/admin/movies/page/getMovieCommentByDate?date=${date}&pageNum=${pageNum}&pageSize=${pageSize}`);

export const getTypePercentageByDate = (date: string): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    goodPercentage : number;
    badPercentage : number;
    generalPercentage : number;
    };
}> => request.get(`/admin/movies/getTypePercentageByDate?date=${date}`);

