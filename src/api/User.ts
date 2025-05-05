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
      likeMovies: string[];
    }[]
  }
}> => request.get(`/user/page?pageNum=${pageNum}&pageSize=${pageSize}`)

export const deleteUserById = (id: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
}> => request.delete(`/user/${id}`)

export const getCommentByUid= (uid: number, pageNum: number, pageSize: number): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    total: number;
    list: {
      username: string;
      date: string;
      comment: string;
      type: string;
      movieName: string;
    }[]
  }
}> => request.get(`/movies/getCommentByUid?uid=${uid}&pageNum=${pageNum}&pageSize=${pageSize}`)

export const updateUserVO = (data: {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
  username: string;
  personalLabel: string;
  favoriteType: string;
  likeMovies: string[];
  picture: File;
}): Promise<{
  code: number;
  message: string;
  ok: boolean;
  data: {
    id: number;
    name: string;
    email: string;
    profilePicture: string;
    token: string;
    admin: boolean;
    username: string;
    personalLabel: string;
    favoriteType: string;
    likeMovies: string[];
  };
}> => {
  const formData = new FormData();
  formData.append('id', data.id.toString());
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('username', data.username);
  formData.append('personalLabel', data.personalLabel);
  formData.append('favoriteType', data.favoriteType);

  data.likeMovies.forEach((data)=>{
    formData.append('likeMovies', data);
  })

  if (data.picture instanceof File) {
    formData.append('picture', data.picture);
  }

  return request.put(`/user`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
