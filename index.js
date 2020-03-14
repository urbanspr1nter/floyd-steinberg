const Jimp = require('jimp');
const { performance } = require('perf_hooks');

// Your input parameter:
const inputFile = './nature-fly.jpg';

// Your outputs:
const intermediateOutput = './posterized.png';
const outputFile = './result.png';

const startTime = performance.now();
Jimp.read(inputFile).then(image => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const frame = initializeFrame(image, width, height);

    new Jimp(width, height, (err, posterized) => {
        if(err) {
            console.log(err);
            return;
        }
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const c = frame[y][x];
                const c_p = posterizePixel(c);

                posterized.setPixelColor(rgbaToInt(c_p), x, y);
            }
        }

        const posterizedTime = performance.now() - startTime;

        posterized.quality(100).write(intermediateOutput, () => {
            // Now produce the dithered
            new Jimp(width, height, (err, working) => {
                if(err) {
                    console.log(err);
                    return;
                }

                for(let y = 0; y < height; y++) {
                    for(let x = 0; x < width; x++) {
                        const c = frame[y][x];
                        const c_p = posterizePixel(c);

                        const errors = findErrors(c_p, c);
                        working.setPixelColor(rgbaToInt(c_p), x, y);
        
                        if(x + 1 < width)
                            frame[y][x + 1] = distributeError(frame[y][x + 1], (7/16), errors);
        
                        if(y + 1 < height)
                            frame[y + 1][x] = distributeError(frame[y + 1][x], (5/16), errors);
        
                        if(x + 1 < width && y + 1 < height)
                            frame[y + 1][x + 1] = distributeError(frame[y + 1][x + 1], (3/16), errors);
        
                        if(x - 1 >= 0 && y + 1 < height)
                            frame[y + 1][x - 1] = distributeError(frame[y + 1][x - 1], (1/16), errors);
                    }
                }

                working.quality(100).write(outputFile, () => {
                    const totalTime = performance.now() - startTime;
                    const ditheredTime = totalTime - posterizedTime;

                    console.log(`Posterized in ${posterizedTime.toFixed(4)} ms`);
                    console.log(`Dithered in ${ditheredTime.toFixed(4)} ms`);
                    console.log(`Processed in ${totalTime.toFixed(4)} ms`);
                });
            });

        });
    });
}).catch(e => console.log(e));

function initializeFrame(image, width, height) {
    const frame = [];

    for(let y = 0; y < height; y++) {
        frame[y] = [];
        for(let x = 0; x < width; x++) {
            const fpix = Jimp.intToRGBA(image.getPixelColor(x, y)); 

            const result = {
                r: (fpix.r / 255).toFixed(4),
                g: (fpix.g / 255).toFixed(4),
                b: (fpix.b / 255).toFixed(4),
                a: (fpix.a / 255).toFixed(4)
            };

            frame[y].push(result);
        }
    }

    return frame;
}

function posterizePixel(pixel) {
    const c_p = {
        r: pixel.r < 0.5 ? 0 : 1, 
        g: pixel.g < 0.5 ? 0 : 1,
        b: pixel.b < 0.5 ? 0 : 1,
        a: pixel.a < 0.5 ? 0 : 1
    };

    return c_p;
}

function findErrors(currentPixel, originalPixel) {
    return {
        r: currentPixel.r - originalPixel.r,
        g: currentPixel.g - originalPixel.g,
        b: currentPixel.b - originalPixel.b,
        a: currentPixel.a - originalPixel.a
    };
}

function clampValue(value) {
    if(value < 0.0)
        return 0.0;
    if (value > 1.0)
        return 1.0;
    return value;
}

function distributeError(pixel, weight, errors) {
    const resultPixel = ({
        r: clampValue(pixel.r - (weight * errors.r)),
        g: clampValue(pixel.g - (weight * errors.g)),
        b: clampValue(pixel.b - (weight * errors.b)),
        a: clampValue(pixel.a - (weight * errors.a))
    });

    return resultPixel;
}

function rgbaToInt(pixel) {
    return Jimp.rgbaToInt(
        Math.trunc(pixel.r * 255),
        Math.trunc(pixel.g * 255),
        Math.trunc(pixel.b * 255),
        Math.trunc(pixel.a * 255)
    );
}
