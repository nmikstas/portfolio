//This node program takes a csv file of capitalized words and converts it into a 2D array.

const fs = require('fs');
const lineReader = require('line-reader');

//Create an empty array for all the words.
let wordArray = new Array(26);

//Get the file to parse.
const wordFile = process.argv[2];

//Read each line of the file and add it to the words array.
lineReader.eachLine(wordFile, (line, last) => 
{
    //Convert first character into ascii and use it to find the proper index into the word array.
    let arrayIndex = line[0].charCodeAt(0) - 65;

    if(wordArray[arrayIndex] === undefined)
    {
        wordArray[arrayIndex] = "";
        wordArray[arrayIndex] = [...wordArray[arrayIndex], line];
    }
    else
    {
        wordArray[arrayIndex] = [...wordArray[arrayIndex], line];
    }        
    
    if(last)
    {
        //Save the final word into the last spot of the array.
        wordArray[arrayIndex] = [...wordArray[arrayIndex], line];

        console.log(wordArray);

        let wordText = "let wordArray =[\n";

        for(let i = 0; i < wordArray.length; i++)
        {
            //Open first dimension of array.
            wordText += "[";

            let itemCount = 0;
            for(let j = 0; j < wordArray[i].length; j++)
            {
                wordText += "\"";
                wordText += wordArray[i][j];
                wordText += "\"";

                //Only put in a comma if not last elemint in this dimension.
                if(j < wordArray[i].length - 1)
                {
                    wordText += ", ";
                }

                itemCount++;
                if(itemCount > 10)
                {
                    itemCount = 0;
                    wordText += "\n";
                }
            }

            //Close first dimension of array.
            wordText += "]";

            //Add comma unless at last element in the first dimension.
            if(i < wordArray.length - 1)
            {
                wordText += ",\n\n";
            }
        }
        wordText += "];\n";

        fs.writeFile('./wordArray.js', wordText, err =>
        {
            if (err)
            {
              console.error(err);
            }
            // file written successfully
          });
    }
});


