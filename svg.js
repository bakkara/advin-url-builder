const generatedUrls = {};

function generateURL(buttonType) {
    const urlInput = document.querySelector('.urlInput').value;
    let sourceInput = document.querySelector('.sourceInput').value;
    let mediumInput = document.querySelector('.mediumInput').value;
    let contentInput = document.querySelector('.contentInput').value;
    const outputUrl = document.querySelector('.outputUrl');
    outputUrl.innerHTML = ''
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
        sourceInput += '_QR'
    }

    const utmParams = {
        source: sourceInput,
        medium: mediumInput,
        content: contentInput + '_' + buttonType.toUpperCase()
    };

    if (buttonType === 'utm') {
        utmParams.content = contentInput
    }

    urlObject.searchParams.set('utm_source', utmParams.source);
    urlObject.searchParams.set('utm_medium', utmParams.medium);
    urlObject.searchParams.set('utm_content', utmParams.content);

    const generatedUrl = urlObject.toString();


    if (buttonType === 'qr') {
       
            generateQRCodeSvg(generatedUrl, utmParams.content);
        }

    generatedUrls[urlInput] = generatedUrls[urlInput] || {};
    generatedUrls[urlInput][buttonType] = generatedUrl;

    updateTable(urlInput);

    outputUrl.innerHTML = `

    <p>Згенерований URL: <p class="new-url">${generatedUrl}</p></p>

    <button type='button' class="shorten-button" onclick="shortenUrl('${generatedUrl}')">Short link</button>

`;
}

function shortenUrl(originalUrl) {
const apiUrl = 'https://is.gd/create.php?format=json&url=' + encodeURIComponent(originalUrl);
const outputUrl = document.querySelector('.outputUrl');
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const shortenedUrl = data.shorturl;
        // Додайте скорочений URL до вмісту
        outputUrl.insertAdjacentHTML('beforeend', `<p>Скорочений URL: <p class="new-url">${shortenedUrl}</p></p>`);
    })
    .catch(error => {
        console.error('Помилка при скороченні URL:', error);
    });
}

function shortenUrlWithParams(originalUrl) {
    const apiUrl = 'https://is.gd/create.php?format=json&url=' + encodeURIComponent(originalUrl);
    const outputUrlWithParams = document.querySelector('.outputUrlWithParams');
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const shortenedUrl = data.shorturl;
            outputUrlWithParams.insertAdjacentHTML('beforeend', `<p>Скорочений URL: <p class="new-url">${shortenedUrl}</p></p>`);
        })
        .catch(error => {
            console.error('Помилка при скороченні URL:', error);
        });
    }

function updateTable(urlInput) {
    const tableBody = document.querySelector('.links-table tbody');
    let row = tableBody.querySelector(`tr[data-url="${urlInput}"]`);

    if (!row) {
        row = document.createElement('tr');
        row.setAttribute('data-url', urlInput);
        tableBody.appendChild(row);
    }

    const cellTypes = ['back', 'buy', 'utm', 'qr'];


    row.innerHTML = '';

    cellTypes.forEach((cellType) => {
        const cell = document.createElement('td');
        const generatedUrl = generatedUrls[urlInput] && generatedUrls[urlInput][cellType];
        cell.textContent = generatedUrl || '';
        cell.setAttribute('data-type', cellType);
        row.appendChild(cell);
    })
}

function generateURLWithParams(buttonType) {
    const urlInputWithParams = document.querySelector('.urlInputWithParams').value;
    const sourceInputWithParams = document.querySelector('.sourceInputWithParams').value;
    const mediumInputWithParams = document.querySelector('.mediumInputWithParams').value;
    const contentInputWithParams = document.querySelector('.contentInputWithParams').value;

    const outputUrlWithParams = document.querySelector('.outputUrlWithParams');
    const urlObjectWithParams = new URL(urlInputWithParams);

    const content = contentInputWithParams || urlObjectWithParams.searchParams.get('model') || '';
    let source = sourceInputWithParams || urlObjectWithParams.searchParams.get('client');
    let medium = mediumInputWithParams || 'site';

    if (buttonType === 'qr') {
        medium += '_QR';
        source += '_QR'
    }


    const utmParams = {
        source: source,
        medium: medium,
        content: content + '_' + buttonType.toUpperCase()
    };

    if (buttonType === 'utm') {
        utmParams.content = content
    }

    urlObjectWithParams.searchParams.set('utm_source', utmParams.source);
    urlObjectWithParams.searchParams.set('utm_medium', utmParams.medium);
    urlObjectWithParams.searchParams.set('utm_content', utmParams.content);

    const urlParamsString = new URLSearchParams(urlObjectWithParams.searchParams).toString();
    
    const generatedUrl = (urlObjectWithParams.origin + urlObjectWithParams.pathname + '?' + urlParamsString).toString();
    
    if (buttonType === 'qr') {
        generateQRCodeSvg(generatedUrl, utmParams.content);
    }
    generatedUrls[urlInputWithParams] = generatedUrls[urlInputWithParams] || {};
    generatedUrls[urlInputWithParams][buttonType] = generatedUrl;

    updateTable(urlInputWithParams);

    outputUrlWithParams.innerHTML = ` <p>Згенерований URL: <p class="new-url">${generatedUrl}</p></p>

    <button type='button' class="shorten-button" onclick="shortenUrlWithParams('${generatedUrl}')">Short link</button>`;
}


function generateQRCodeSvg(url, name) {
    const qrCodeName = document.createElement("p");
    qrCodeName.textContent = `${name}: `;
    document.getElementById("qrcode").appendChild(qrCodeName);

    const qrcodeSvg = new QRCode({
        content: url,
        padding: 4,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "M",
        join: true,
        xmlDeclaration: false,
    });

    const svgString = qrcodeSvg.svg();

    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:image/svg+xml,' + encodeURIComponent(svgString);
    downloadLink.download = `${name}.svg`;
    downloadLink.textContent = 'Завантажити SVG';
    downloadLink.click();

    document.getElementById("qrcode").innerHTML = '';
}