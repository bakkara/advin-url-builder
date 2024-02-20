function generateURL(buttonType) {
    const urlInput = document.querySelector('.urlInput').value;
    let sourceInput = document.querySelector('.sourceInput').value;
    let mediumInput = document.querySelector('.mediumInput').value;
    let contentInput = document.querySelector('.contentInput').value;
    const outputUrl = document.querySelector('.outputUrl');
    const urlObject = new URL(urlInput);
    let path = urlObject.pathname;


    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    const pathArray = path.split('/');
    
    
    sourceInput = sourceInput.trim() || urlObject.hostname.split('.')[0];
    mediumInput = mediumInput.trim() || 'site';
    contentInput = contentInput.trim() || pathArray[pathArray.length - 1].split('.')[0];;

    if (buttonType === 'qr') {
        mediumInput += '_QR';
    }

    const utmParams = {
        source: sourceInput,
        medium: mediumInput,
        content: contentInput + '_' + buttonType.toUpperCase()
    };

    urlObject.searchParams.set('utm_source', utmParams.source);
    urlObject.searchParams.set('utm_medium', utmParams.medium);
    urlObject.searchParams.set('utm_content', utmParams.content);

    outputUrl.innerHTML = `<p>Згенерований URL: <a href="${urlObject.toString()}" target="_blank">${urlObject.toString()}</a></p>`;
}

