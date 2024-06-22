class DisneyMovie {
    constructor(movieId, title, year, link, image, runtime, genre, summary, rating, metascore, directors, stars) {
        this.movieId = movieId;
        this.title = title;
        this.year = year;
        this.link = link;
        this.image = image;
        this.runtime = runtime;
        this.genre = genre;
        this.summary = summary;
        this.rating = rating;
        this.metascore = metascore;
        this.directors = directors;
        this.stars = stars;
    }
}

module.exports = DisneyMovie;