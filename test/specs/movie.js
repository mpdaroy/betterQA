const expectChai = require('chai').expect;
import Movie from  '../pageobjects/movie.page';
import Data from  '../../data/movie.json';



describe('Movie functional regression tests', () => {
    it('Should be able to open the application and make sure a list of movie tiles is displayed', async () => {
        await Movie.open();
        let arrData = await Movie.tiles();
    
        //validate names of the movies and compare to array (expected JSON of movie titles)
        let x = 0;
        for (const field of arrData) {                     
            //console.log(field);  //- for debugging
            // console.log(Data.movietitle[x])    //- for debugging          
            expectChai(field).to.equal(Data.movietitle[x]);
            x = x + 1;              
        }
    });

    it('Should show correctly movie release date', async () => {
        await Movie.open();
        let releaseDate = await Movie.movieDates(Data.movieReleaseDate.title);
        expectChai(releaseDate).to.equal(Data.movieReleaseDate.date); // validate it correctly set the Release Date
    }); 
    
    it('Should be able to search movie titles correctly', async () => {
        await Movie.open();
        let arrResult = await Movie.movieSearch(Data.movieSearch[0]);
        let isearch = 0;
        let iNOTsearch = 0;
        //console.log(arrResult);  //- for debugging  
        for (const field of arrResult) {                     
            
            if(await field === Data.movieSearch[1]){
                isearch = isearch + 1; 
            }
            if(await field === Data.movieSearch[2]){
                iNOTsearch = iNOTsearch + 1; 
            }              
        }
        expectChai(isearch).to.equal(1);    // Verify for search to be able show expected search
        expectChai(iNOTsearch).to.equal(0); // Verify for search should NOT be able to show NOT expected search result      
    }); 

    it('Should show movie details correctly', async () => {
        await Movie.open();
        let arrResult = await Movie.movieDetails(Data.movieDetails[0]);
        
        //validate details of the movies and compare to array (expected JSON of movie details)
        let x = 1;
        for (const field of arrResult) {                     
            //console.log(field);  //- for debugging
            //console.log(Data.movieDetails[x])    //- for debugging          
            expectChai(field).to.equal(Data.movieDetails[x]);
            x = x + 1;              
        }

    }); 

    // Did you encounter any bugs in the application? If so add a test that shows that bug
    // test start here
    it('should show all search results with valid and not broken images - Expected Fail', async () => {
        await Movie.open();
        let arrResult = await Movie.verify404Images(Data.movieSearch[0]);

        let x = 0;
        for (const field of arrResult) {                     
            //console.log(field);  //- for debugging       
            expectChai(field).to.have.string('http://');
            expectChai(field).to.have.string('.jpg');  // Failing on this validation
        }
    });

    it('clicking x(cancel) on search, should get back to default movie lists', async () => {
        await Movie.open();
        let arrDefaultData = await Movie.tiles();  //default array of movie titles
        let arrSearchCancel = await Movie.verifySearchCancel(Data.movieSearch[0]);
        let x = 0;
        for (const field of arrDefaultData) {                     
            //console.log(field);  //- for debugging
            //console.log(await arrSearchCancel[x])    //- for debugging          
            if (await field === await arrSearchCancel[x]){
                x = x + 1; 
            }            
        }
        //expectChai(x).to.be.equal(arrDefaultData.length);
        expectChai(x).to.be.equal(0);
    });

    it('searching for blank, should get back to default movie lists', async () => {
        await Movie.open();
        let arrDefaultData = await Movie.tiles();  //default array of movie titles
        let arrSearchBlank = await Movie.movieSearch();
        let x = 0;
        for (const field of arrDefaultData) {                     
            //console.log(field);  //- for debugging
            //console.log(await arrSearchBlank[x])    //- for debugging          
            if (await field === await arrSearchBlank[x]){
                x = x + 1; 
            }            
        }
        expectChai(x).to.be.equal(arrDefaultData.length);
    }); 

});


