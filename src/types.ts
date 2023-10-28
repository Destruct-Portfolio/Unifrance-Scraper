type Info<T extends any = string> = T | null;

export type FilmInfo = {
    url: Info;
    title: Info;
    realization: Info;
    production: Info;
    coproduction: Info;
    genre: Info;
    subgenre: Info;
    type: Info;
    theme: Info;
    year: Info;
};
