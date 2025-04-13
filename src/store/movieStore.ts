import {defineStore} from "pinia";
import {ref} from "vue";
export const useMovieStore = defineStore("movieStore",{
    state: () => ({
        movie: {
            id :0,
            movieChineseName :'',
            type :'',
            ratings :0,
            introduction:''
        },
    }),
    actions: {
      async  setMovie(movie: {
            id :number;
            movieChineseName :string;
            type :string;
            ratings :number;
            introduction:string;

        }) {
            this.movie = movie;
        }
    }
});
