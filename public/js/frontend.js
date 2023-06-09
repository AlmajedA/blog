function likeArticle(){
    let numberOfLikes = document.querySelector(".nLikes")
    numberOfLikes.innerHTML = 1 + parseInt(numberOfLikes.innerHTML)
    // make an AJAX request to the server to like the article
    let url = window.location.href;
    
    fetch(url.match(/\/article\/\d+/) + "/like", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })

}

async function setLanguage(event){
    
  
  let main = document.querySelector("#main-div");
  localStorage.setItem('currentLang', event.value);
  const currentLang = localStorage.getItem('currentLang');
    
  if (currentLang == 'arabic'){
    main.className = 'ar';
    
  }
  else{
    main.className = 'en'
  }

  // make an AJAX request to the server to change language
  const httpRequest = new XMLHttpRequest();

  httpRequest.open("GET", "/lang?lang=" + main.className);
  // httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.onreadystatechange = function() {
    location.reload();
    
  };
  httpRequest.send();

}

function deleteArticle(event){
  const parentElement = event.parentElement.parentElement.parentElement;
  const articleID = parentElement.id
  console.log(articleID)
          
  // remove the parent element
  //   parentElement.remove();
  if (confirm('Are you sure you want to delete this article?')) {
    parentElement.remove();
    // make an AJAX request to the server to delete the article
    fetch(`/articles/${articleID}`, {
      method: 'DELETE'
    })
  }

}


function initForm(){

  let editor = new FroalaEditor('textarea#content', {
    imageUploadMethod: 'POST', 
    charCounterMin: 10, 
    imageUploadURL: '/upload'
});
  let arabic_editor = new FroalaEditor('textarea#arabic_content', {
    imageUploadMethod: 'POST', 
    charCounterMin: 10, 
    imageUploadURL: '/upload'
  });
  
}



function validateContent(event){
    
    
  const unStrippedContent = document.querySelector("#content");
  const unStrippedArabicContent = document.querySelector("#arabic_content");

  const content = unStrippedContent.value.replaceAll(/<\/?[^>]+(>|$)/gi, "");

  const arabicContent = unStrippedArabicContent.value.replaceAll(/<\/?[^>]+(>|$)/gi, "");
  
  
  if (content.length < 10 || arabicContent.length < 10) {
    alert('Content and arabic content should be more than or equatl to 10 characters');
    event.preventDefault();
    return false;
  }

  return true;
    
}

document.addEventListener('DOMContentLoaded', function() {
  const currentLang = localStorage.getItem('currentLang');
  if (currentLang === 'arabic') {
    document.querySelector('#lang').value = 'arabic';
    document.querySelector('#main-div').className = 'ar';
  } else {
    document.querySelector('#lang').value = 'english';
    document.querySelector('#main-div').className = 'en';
  }
});



