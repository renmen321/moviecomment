import request from "@/utils/request";
export const reqGetAdminMovies = (pageNum: number, pageSize: number): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data: {
        total: number;
        list: {
            id: number;
            movieChineseName : string;
            type: string;
            introduction : string;
            yearOfRelease: number;
            director: string;
            image: string;
        }[];
    };
}> => request.get(`/admin/movies/page?pageNum=${pageNum}&pageSize=${pageSize}`);
export const reqGetAdminMoviesByName = (movieName: string): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data: {
        total: number;
        list: {
            id: number;
            movieChineseName : string;
            type: string;
            introduction : string;
            yearOfRelease: number;
            director: string;
            image: string;
        }[];
    };
}> => request.get(`/admin/movies/getMoviesByName?movieName=${movieName}`);

export const UpdateMovie = (data: {
    id: number;
    movieChineseName: string;
    type: string;
    introduction: string;
    yearOfRelease: number;
    director: string;
    image: string;
    movieImage?: File; // 可选字段
}): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data:{
        id: number;
        movieChineseName: string;
        type: string;
        introduction: string;
        yearOfRelease: number;
        director: string;
        image: string;
    }
}> => {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('movieChineseName', data.movieChineseName);
    formData.append('type', data.type);
    formData.append('introduction', data.introduction);
    formData.append('yearOfRelease', data.yearOfRelease.toString());
    formData.append('director', data.director);
    formData.append('image', data.image);

    if (data.movieImage) {
        formData.append('movieImage', data.movieImage);
    }

    return request.put(`/admin/movies/updateMovieById`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const addMovie = (data: {
    movieChineseName: string;
    type: string;
    introduction: string;
    yearOfRelease: number;
    director: string;
    image: string;
    movieImage?: File; // 可选字段
}): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data:{
        id: number;
        movieChineseName: string;
        type: string;
        introduction: string;
        yearOfRelease: number;
        director: string;
        image: string;
    }
}> => {
    const formData = new FormData();
    formData.append('movieChineseName', data.movieChineseName);
    formData.append('type', data.type);
    formData.append('introduction', data.introduction);
    formData.append('yearOfRelease', data.yearOfRelease.toString());
    formData.append('director', data.director);
    formData.append('image', data.image);

    if (data.movieImage) {
        formData.append('movieImage', data.movieImage);
    }

    return request.post(`/admin/movies/addMovie`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const deleteMovieById = (id: number): Promise<{
    code: number;
    message: string;
    ok: boolean;
}> => request.delete(`/admin/movies/deleteMovieById?id=${id}`);

export const getAllMovieName = (): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data: {
        total: number;
        list: string[];
    };
}> => request.get(`/admin/movies/getAllMovieName`);

export const getMovieCommentByName = (movieName: string,pageNum: number, pageSize: number,type: number): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data: {
        total: number;
        list: {
            id: number;
            username: string;
            date: string;
            comment: string;
        }[];
    };
}> => request.get(`/admin/movies/getMovieCommentByName?movieName=${movieName}&pageSize=${pageSize}&pageNum=${pageNum}&type=${type}`);

export const getCommentTypeCountByName= (movieName: string): Promise<{
    code: number;
    message: string;
    ok: boolean;
    data: {
        total: number;
        list: {
            type: number;
            count: number;
        }[];
    };
}> => request.get(`/admin/movies/getCommentTypeCountByName?movieName=${movieName}`);