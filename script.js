document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      let inpword = document.getElementById('inpsearch').value.toLowerCase();
      console.log(inpword);
      const data = { value: inpword };
      fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        const documents = encodeURIComponent(JSON.stringify(data.documents));
        window.location.href = `http://localhost:3000/display?documents=${documents}&query=${encodeURIComponent(inpword)}`;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }

  const params = new URLSearchParams(window.location.search);
  const documents = params.get('documents');
  const inpword = params.get('query');
  
  if (documents && inpword) {
    const documentsDiv = document.getElementById('documents');
    const result = document.getElementById('result');
    const docs = JSON.parse(decodeURIComponent(documents));
    
    if (docs && docs.length > 0) {
      let htmlContent = '';
      docs.forEach(doc => {
        let docContent = '';
        const keys = Object.keys(doc);
        for (let i = 1; i < keys.length; i++) { 
          const key = keys[i];
          if(key != 'image'){
            docContent += `${key}: ${JSON.stringify(doc[key], null, 2)}\n`;
          }
        }
        htmlContent += 
        `
        <div class="card" style="width: 90%;">
          ${doc.image ? `<img src="${doc.image}" class="card-img-top" alt="...">` : ''}
          <div class="card-body">
            <h5 class="card-title">${doc.Name}</h5>
              <p class="card-text"><span class="title">Description:</span> ${doc.Description}</p>
              <p class="card-text"><span class="title">Manufacturer:</span> ${doc.Manufacturer}</p>
              <p class="card-text"><span class="title">Price:</span> ${doc.Price}</p>
          </div>
        </div>
        `;
      });
      result.innerHTML = `MEDICINES FOR ${inpword.toUpperCase()}`;
      documentsDiv.innerHTML = htmlContent;
    } else {
      documentsDiv.innerHTML = 'Medicines not found';
    }
  } else {
    const documentsDiv = document.getElementById('documents');
    documentsDiv.innerHTML = 'Medicines not found';
  }
});


