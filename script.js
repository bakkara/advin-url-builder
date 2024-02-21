const generatedUrls = {};

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
    contentInput = contentInput.trim() || pathArray[pathArray.length - 1].split('.')[0];

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

    const generatedUrl = urlObject.toString();

    generatedUrls[urlInput] = generatedUrls[urlInput] || {};
    generatedUrls[urlInput][buttonType] = generatedUrl;

    updateTable(urlInput);

    outputUrl.innerHTML = `<p>Згенерований URL: <a href="${generatedUrl}" target="_blank">${generatedUrl}</a></p>`;
}

function updateTable(urlInput) {
    const tableBody = document.querySelector('.links-table tbody');
    let row = tableBody.querySelector(`tr[data-url="${urlInput}"]`);

    if (!row) {
        row = document.createElement('tr');
        row.setAttribute('data-url', urlInput);
        tableBody.appendChild(row);
    }

    const backCell = document.createElement('td');
    const buyCell = document.createElement('td');
    const qrCell = document.createElement('td');

    backCell.textContent = (generatedUrls[urlInput] && generatedUrls[urlInput]['back']) ? generatedUrls[urlInput]['back'] : '';
    buyCell.textContent = (generatedUrls[urlInput] && generatedUrls[urlInput]['buy']) ? generatedUrls[urlInput]['buy'] : '';
    qrCell.textContent = (generatedUrls[urlInput] && generatedUrls[urlInput]['qr']) ? generatedUrls[urlInput]['qr'] : '';

    row.innerHTML = '';
    row.appendChild(backCell.cloneNode(true));
    row.appendChild(buyCell.cloneNode(true));
    row.appendChild(qrCell.cloneNode(true));

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = `<table class="links-table">${tableBody.innerHTML}</table>`;
}


function generateURLWithParams(buttonType) {
    const urlInputWithParams = document.querySelector('.urlInputWithParams').value;
    let sourceInputWithParams = document.querySelector('.sourceInputWithParams').value;
    let mediumInputWithParams = document.querySelector('.mediumInputWithParams').value;
    let contentInputWithParams = document.querySelector('.contentInputWithParams').value;
    
    const outputUrlWithParams = document.querySelector('.outputUrlWithParams');
    const urlObjectWithParams = new URL(urlInputWithParams);

    const content = contentInputWithParams || urlObjectWithParams.searchParams.get('android') || '';
    const source = sourceInputWithParams || urlObjectWithParams.searchParams.get('client');
    let medium = mediumInputWithParams || 'site';
    
    if (buttonType === 'qr') {
        medium += '_QR';
    }

    const utmParams = {
        source: source,
        medium: medium,
        content: content + '_' + buttonType.toUpperCase()
    };

    urlObjectWithParams.searchParams.set('utm_source', utmParams.source);
    urlObjectWithParams.searchParams.set('utm_medium', utmParams.medium);
    urlObjectWithParams.searchParams.set('utm_content', utmParams.content);

    const urlParamsString = new URLSearchParams(urlObjectWithParams.searchParams).toString();
    
    outputUrlWithParams.innerHTML = `<p>Згенерований URL: <a href="${urlObjectWithParams.origin + urlObjectWithParams.pathname + '?' + urlParamsString}" target="_blank">${urlObjectWithParams.origin + urlObjectWithParams.pathname + '?' + urlParamsString}</a></p>`;
}

