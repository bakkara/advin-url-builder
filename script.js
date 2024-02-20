

function generateURL(buttonType) {
    const urlInput = document.querySelector('.urlInput').value;
    const sourceInput = document.querySelector('.sourceInput').value;
    const mediumInput = document.querySelector('.mediumInput').value;
    const outputUrl = document.querySelector('.outputUrl');
    const urlObject = new URL(urlInput);
    const pathArray = urlObject.pathname.split('/');
    
    const content = pathArray[pathArray.length - 1].split('.')[0]; 

    const utmParams = {
        source: sourceInput,
        medium: mediumInput,
        content: content + '_' + buttonType.toUpperCase()
    };

    urlObject.searchParams.set('utm_source', utmParams.source);
    urlObject.searchParams.set('utm_medium', utmParams.medium);
    urlObject.searchParams.set('utm_content', utmParams.content);
    
    outputUrl.innerHTML = `<p>Згенерований URL: <a href="${urlObject.toString()}" target="_blank">${urlObject.toString()}</a></p>`;
}

