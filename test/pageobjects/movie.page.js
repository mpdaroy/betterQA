import Page from './page';


/**
 * sub page containing specific selectors and methods for a specific page
 */


class MoviePage extends Page {
  
    /**
     * a method to verify movie tiles with titles
     *
     */
    async tiles () {  
        const movieTiles = "//div[2]/h2";  
        let arrTitles = [];     
        const arrDiv = await $$(movieTiles);   
        for (const elem of arrDiv) {
            //console.log(await elem.getText()); //- for debugging
            arrTitles.push(await elem.getText())
        } 
        //console.log(arrTitles); //- for debugging
        return(arrTitles) ;
    }

    /**
     * a method to verify movie release dates for a specific movie
     * e.g movieDates(title)
     * returns Release Date
     */
    async movieDates (title) {  
        const movieDivs = "//div[@class='movies']/div";
        const releaseDate = "//div[@role='document']//div[2]/div/input";     
        let relDate = "";  

        const arrDiv = await $$(movieDivs);          
        for (const elem of arrDiv) {
            let textTitle = await elem.$$("div")[1].$("h2");            

            let txtTitle = await textTitle.getText();
            //console.log("Title Here " +  await txtTitle); //- for debugging
            //console.log("Title Here 2 " +  await title); //- for debugging

            if(txtTitle === title){
                await elem.$$("div")[2].$("button").click();
                await $(releaseDate).waitForDisplayed({ timeout: 1000 });
                relDate = await $(releaseDate).getAttribute('value');   
                //console.log("Release Date " +  relDate);    //- for debugging          
                break;
            }
        }
        $("///div[@role='document']//button[@type='button']").click();
        return relDate;
    }
    /**
     * a method to verify movie searches and display results correctly
     *  e.g movieSearch(title)
     *  returns array of search results of movie titles
     */
    async movieSearch (title) {  
        const inputSearch = "//input[@type='search']"
        const movieTiles = "//div[2]/h2";  
        let arrSearchTitles = [];  
        
        await $(inputSearch).setValue(title);
        await browser.keys("Enter")

        if(title != null){
            const searchDiv = await $("//div[@title='" + title +"']");
            await searchDiv.waitForDisplayed({ timeout: 1000 });
        }
        

        const arrDiv = await $$(movieTiles);   
        for (const elem of arrDiv) {
            // console.log(await elem.getText()); //- for debugging
            arrSearchTitles.push(await elem.getText())
        } 
        //console.log(await arrSearchTitles); //- for debugging
        return(arrSearchTitles) ;
    }

    /**
     * a method to verify movie details for a specific movie
     * e.g movieDetails(title)
     * returns Movie details for Release Date, Popularity
    */
    async movieDetails (title) {  
        const movieDivs = "//div[@class='movies']/div";
        let arrDetails = [];    
        const arrDiv = await $$(movieDivs);          

        for (const elem of arrDiv) {
            let textTitle = await elem.$$("div")[1].$("h2");
            let txtTitle = await textTitle.getText();
            //console.log("Title Here " +  await txtTitle); //- for debugging
            //console.log("Title Here 2 " +  await title); //- for debugging

            if(txtTitle === title){
                await elem.$$("div")[2].$("button").click();
                await $("//div[@role='document']").waitForDisplayed({ timeout: 1000 });

                for(let i = 2; i <=5; i++){
                    let releaseDate = "//div[@role='document']//div[" +  i + "]/div/input";  
                    let strValue = await $(releaseDate).getAttribute('value');
                    arrDetails.push(await strValue);
                }
                break;
            }
        }
        $("///div[@role='document']//button[@type='button']").click();
        //console.log("Movie Details Here " +  arrDetails); //- for debugging
        return arrDetails;

    }

    async verify404Images(title) {  
        await this.movieSearch(title);
        //await browser.pause(1000);
        const movieDivs = "//div[@class='movies']/div/div[1]"; 
        await $(movieDivs).waitForDisplayed({ timeout: 1000 });
        let arrImgDetails = []; 

        const arrDiv = await $$(movieDivs);          
        for (const elem of arrDiv) {       

            let txtTitle = await elem.getAttribute('style');
            arrImgDetails.push(await txtTitle);
        }
        //console.log("Movie Details Here " + arrImgDetails); //- for debugging
        return arrImgDetails;
    }

    /**
     * a method to returns data retrieved after search cancel
     * e.g verifySearchCancel(title)
     * returns Movie details for Release Date, Popularity
    */
    async verifySearchCancel (title) {  
        await this.movieSearch(title);
        //await browser.pause(1000);
        await $("//input[@type='search']").waitForExist({ timeout: 1000 });
        await $("//input[@type='search']").click();
        //esc key to cancel -->  UI is using webkit which is can't be dealt with XPATH, thus workaround with sendKeys
        await browser.keys("Escape"); 
        await browser.pause(1000);
        await browser.keys("Enter");
        let arrCancel = await this.tiles(); // getting movie titles after cancelling to be compared to defaults
        // console.log(arrCancel);  // - for debugging
        return (arrCancel);
    }
}

export default new MoviePage();
