function changeImgOfSearchIcon(action, idFrame, idImg){
    const contentFrameRef = document.getElementById(idFrame);
    const contentImgRef = document.getElementById(idImg);
    if(action == 'add'){
        contentFrameRef.style = "border:1px solid #29ABE2;";
        contentImgRef.src = '../assets/img/search_click.svg';
    }else if(action == 'remove'){
        contentFrameRef.style = "border:1px solid #D1D1D1;";
        contentImgRef.src = '../assets/img/search.svg';
    }
}