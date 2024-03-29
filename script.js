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
        sourceInput += '_QR'
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


    if (buttonType === 'qr') {
        const radioButtons = document.getElementsByName('qrType');
        let selectedType;

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedType = radioButton.value;
                break;
            }
        }
        if (selectedType === 'svg') {
            generateQRCodeSvg(generatedUrl, utmParams.content);
        } else if (selectedType === 'png') {
            generateQRCodePng(generatedUrl, utmParams.content);
        }

        }

    generatedUrls[urlInput] = generatedUrls[urlInput] || {};
    generatedUrls[urlInput][buttonType] = generatedUrl;

    updateTable(urlInput);

    outputUrl.innerHTML = `<p>Згенерований URL: <p class="new-url">${generatedUrl}</a></p>`;
}

function updateTable(urlInput) {
    const tableBody = document.querySelector('.links-table tbody');
    let row = tableBody.querySelector(`tr[data-url="${urlInput}"]`);

    if (!row) {
        row = document.createElement('tr');
        row.setAttribute('data-url', urlInput);
        tableBody.appendChild(row);
    }

    const cellTypes = ['back', 'buy', 'qr'];


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

    const content = contentInputWithParams || urlObjectWithParams.searchParams.get('android') || '';
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

    urlObjectWithParams.searchParams.set('utm_source', utmParams.source);
    urlObjectWithParams.searchParams.set('utm_medium', utmParams.medium);
    urlObjectWithParams.searchParams.set('utm_content', utmParams.content);

    const urlParamsString = new URLSearchParams(urlObjectWithParams.searchParams).toString();
    
    const generatedUrl = (urlObjectWithParams.origin + urlObjectWithParams.pathname + '?' + urlParamsString).toString();
    
    if (buttonType === 'qr') {
        generateQRCode(generatedUrl, utmParams.content);
    }
    generatedUrls[urlInputWithParams] = generatedUrls[urlInputWithParams] || {};
    generatedUrls[urlInputWithParams][buttonType] = generatedUrl;

    updateTable(urlInputWithParams);
    outputUrlWithParams.innerHTML = `<p>Згенерований URL: <p class="new-url">${generatedUrl}</=></p>`;
}
function generateQRCodePng(url, name) {
    const qrCodeName = document.createElement("p");
    qrCodeName.textContent = `${name}: `;
    document.getElementById("qrcode").appendChild(qrCodeName);

    const qrcodePng = new QRCode(document.createElement("div"), url);

    const canvas = qrcodePng._htOption.canvas;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(qrcodePng._oQRCode.createImgTag(), 0, 0, canvas.width, canvas.height);

    const qrCodeDataURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCodeDataURL;
    downloadLink.download = `${name}.png`;
    downloadLink.click();
    document.getElementById("qrcode").innerHTML = '';
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

// function generateQRCodePng(url, name) {
    
//     const qrCodeName = document.createElement("p");
//     qrCodeName.textContent = `${name}: `;
//     document.getElementById("qrcode").appendChild(qrCodeName);

//     const qrcode = new QRCode(document.getElementById("qrcode"), url);
    
//     // Якщо треба задати колір, розмір
//     // const qrcode = new QRCode(document.getElementById("qrcode"), {
//     //     text: url,
//     //     width: 128,
//     //     height: 128,
//     //     colorDark : "#000000",
//     //     colorLight : "#ffffff",
//     //     correctLevel : QRCode.CorrectLevel.H
//     // });    

//     const qrCodeDataURL = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL("image/png");
//     const downloadLink = document.createElement('a');
//     downloadLink.href = qrCodeDataURL;
//     downloadLink.download = `${name}.png`;
//     downloadLink.click();
// }

// function generateQRCodeSvg(url, name) {
//     const qrCodeName = document.createElement("p");
//     qrCodeName.textContent = `${name}: `;
//     document.getElementById("qrcode").appendChild(qrCodeName);

//     const qrcode = new QRCode({
//         content: url,
//         padding: 4,
//         width: 256,
//         height: 256,
//         color: "#000000",
//         background: "#ffffff",
//         ecl: "M",
//         join: true,
//         xmlDeclaration: false,
//     });

//      const svgString = qrcode.svg();

//     const downloadLink = document.createElement('a');
//     downloadLink.href = 'data:image/svg+xml,' + encodeURIComponent(svgString);
//     downloadLink.download = `${name}.svg`;
//     downloadLink.textContent = 'Завантажити SVG';
//     downloadLink.click();
//     document.getElementById("qrcode").appendChild(downloadLink);
// }
