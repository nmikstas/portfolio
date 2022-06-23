document.addEventListener("mousemove", (event) => 
{
    if(this.animActive) return;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    if(!this.isDown && this.letterDiv)this.letterDiv.style.cursor = "pointer";
});

document.addEventListener("touchmove", (event) => 
{
    if(this.animActive) return;
    this.mouseX = event.touches[0].clientX;
    this.mouseY = event.touches[0].clientY;
    if(!this.isDown && this.letterDiv)this.letterDiv.style.cursor = "pointer";
});

document.addEventListener("mouseup", (event) => 
{
    if(this.animActive) return;
    this.isDown = false;
});

document.addEventListener("touchup", (event) => 
{
    if(this.animActive) return;
    this.isDown = false;
});

document.addEventListener("mousemove", this.move);
document.addEventListener("touchmove", this.move);
document.addEventListener("mouseup", this.updateColumnDrag);
document.addEventListener("touchup", this.updateColumnDrag);

end = (e) =>
    {
        if(this.animActive) return;
        if(!this.isDown) return;

        let yTop = this.scrollDiv.getBoundingClientRect().y;
        let yBottom = this.scrollDiv.getBoundingClientRect().height + yTop;

        if(this.mouseY > yBottom || this.mouseY < yTop)
        {
            this.isDown = false;
            this.letterDiv.style.cursor = "pointer";
        }
    }

    release = (e) =>
    {
        if(this.animActive) return;
        this.isDown = false;
        this.letterDiv.style.cursor = "pointer";

        //Check if there was a quick click, indicating a column swap is desired.
        if(this.singleClick)
        {
            this.columnSwap();
        }
        else //Cancel any column swap if second click was a long click.
        {
            this.colIndex1 = undefined;
            this.colIndex2 = undefined;
        }
    }

    start = (e) =>
    {
        if(this.animActive) return;

        //Set a timer to check for a column swap(single fast click).
        setTimeout(this.checkColumnSwap, 200);
        this.singleClick = true; 
        this.isDown = true;
        this.scrollDiv = e.target.parentNode;
        this.letterDiv = e.target;
        this.letterDiv.style.cursor = "grab";
        this.startY = e.pageY || e.touches[0].pageY - this.scrollDiv.offsetTop;
        this.scrollOffset = this.scrollDiv.scrollTop;

        //Get the index of the clicked column for column swapping purposes.
        this.tempIndex = parseInt(this.scrollDiv.getAttribute("index"));
    }

    move = (e) =>
    {
        //Exit if in middle of column swap.
        if(this.colIndex1 !== undefined) return;

        if(this.animActive) return;
        if(!this.isDown) return;

        e.preventDefault();

        const bottom = this.scrollDiv.getBoundingClientRect().bottom;
        const top = this.scrollDiv.getBoundingClientRect().top;
        const y = e.pageY || e.touches[0].pageY - this.scrollDiv.offsetTop;
        const dist = (y - this.startY);

        //Don't scroll if above or below column.
        if(y < bottom && y > top)
        {
            this.scrollDiv.scrollTop = this.scrollOffset - dist;
        }
    }

//Column swap timer expired. Indicate single click did not happen.
checkColumnSwap = () =>
{
    this.singleClick = false;
}

//Update the rotation of the column after a user has clicked and dragged it.
updateColumnDrag = () =>
{
    if(this.isGo)
    {
        this.isGo = false;
        return;
    }

    if(this.animActive) return;
    if(this.singleClick) return;

    let gameObject = this.getGameObject();

    for(let i = 0; i < gameObject.columns; i++)
    {
        //Get number of letters remaining in current column.
        let lettersRemaining = gameObject.remainArray[i];

        //Get the scroll offset for current column.
        let thisScrollOffset = this.columnArray[i].scrollTop;

        //Caclulate the scroll offset for the first character.
        let zeroScroll = Math.floor(this.letterHeight * lettersRemaining);

        //Calculate how many letters away from zero scroll.
        let lettersOffset = Math.round((thisScrollOffset - zeroScroll) / this.letterHeight) % lettersRemaining;
    
        //Update the column in the game engine.
        this.scrollColumn(i, lettersOffset);
    }

    this.redraw();
}