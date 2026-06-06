let qrData = null;

function generateQR(){

    const text =
        document.getElementById("urlInput")
        .value
        .trim();

    if(!text){
        alert("URL을 입력하세요.");
        return;
    }

    const qr = qrcode(0,"M");

    qr.addData(text);
    qr.make();

    qrData = qr;

    const size =
        qr.getModuleCount();

    const canvas =
        document.getElementById("canvas");

    const ctx =
        canvas.getContext("2d");

    const cellSize = 8;

    canvas.width =
        size * cellSize;

    canvas.height =
        size * cellSize;

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let darkCount = 0;

    for(let y=0;y<size;y++){

        for(let x=0;x<size;x++){

            const dark =
                qr.isDark(y,x);

            if(dark){
                darkCount++;
            }

            ctx.fillStyle =
                dark ? "black" : "white";

            ctx.fillRect(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            );

        }

    }

    document.getElementById("sizeText")
        .textContent =
        `${size} × ${size}`;

    document.getElementById("blockText")
        .textContent =
        darkCount.toLocaleString();

    document.getElementById("pixelText")
        .textContent =
        (size * size).toLocaleString();

    document.getElementById("downloadBtn")
        .disabled = false;
}

function downloadFunction(){

    if(!qrData){
        return;
    }

    const size =
        qrData.getModuleCount();

    const darkBlock =
        document.getElementById("darkBlock")
        .value;

    const lightBlock =
        document.getElementById("lightBlock")
        .value;

    const commands = [];

    commands.push(
        `fill ~ ~ ~ ~${size} ~ ~${size} minecraft:air`
    );

    for(let y=0;y<size;y++){

        for(let x=0;x<size;x++){

            const block =
                qrData.isDark(y,x)
                ? darkBlock
                : lightBlock;

            commands.push(
                `setblock ~${x} ~ ~${y} ${block}`
            );

        }

    }

    const blob =
        new Blob(
            [commands.join("\n")],
            {
                type:"text/plain"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "qr_build.mcfunction";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}