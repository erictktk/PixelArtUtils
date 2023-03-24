import { PixelArray } from "./PixelArray.js";

/**
 * 
 * @param {Array<PixelArray>} listPixelArrays 
 */
export function GetDuplicateIslands(listPixelArrays){
    const sizes = [];
    const sets = [];

    const firstPixelArray = listPixelArrays[0];

    sizes.push( {width: firstPixelArray.width, height: firstPixelArray.height});
    sets.push( [firstPixelArray] );
    
    for(let i = 1; i < listPixelArrays.length; i += 1){
        const curPixelArray = listPixelArrays[i];
        let added = false;
        for(let j = 0; j < sizes.length; j += 1){
            const curSize = sizes[j];
            if( curSize.width === curPixelArray.width && curSize.height === curPixelArray.height){
                added = true;
                sets[j].push(curPixelArray);
                break;
            }
        }
        if (!added){
            sizes.push( {width: curPixelArray.width, height: curPixelArray.height});
            sets.push( [curPixelArray] );
        }
    }

    return sets;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @returns {Array<Int>} color
 */
export function GetColorFromIslandPArray(pixelArray){
    //
    for(let i = 0; i < pixelArray.width; i += 1){
        for(let j = 0; j < pixelArray.height; j += 1){
            //
            const color = pixelArray.getColorValue(i, j);
            if (color[3] >= 1){
                return color;
            }
        }
    }
    return null;
}


/**Returns an array of arrays of int
 * 
 * @param {PixelArray} pixelArray 
 * @return {Array<Array<Int>>}
 */
export function PixelArrayToIslands(pixelArray, anyColor=false, testAlpha=true, minAlpha=1){
    const width = pixelArray.width;
    const height = pixelArray.height;

    console.log(width + ', ' + height);

    const visitedArray = new Uint8ClampedArray(width*height);

    let curIndex = 0;

    const islands = [];
    //let curIsland = null;
    //let placesToVisit = [];
    
    for(let i = 0; i < pixelArray.width; i += 1){
        for(let j = 0; j < pixelArray.height; j += 1){

            if (visitedArray[i+j*width] !== 0){
                continue;
            }
            //console.log(pixelArray.getColorValue(i, j)[3]);
            
            if (pixelArray.getColorValue(i, j)[3] >= minAlpha){
                const curIsland = FloodFillSelect(pixelArray, i, j, visitedArray, anyColor=false, testAlpha=true);
                visitedArray[i+j*width] = 1;
                islands.push(curIsland);
            }
        }
    }
    return islands;
}

/**
 * 
 * @param {Array<Array<Int>>} islandArray 
 * @return {Array<Int>} returns bounds [xMin, xMax, yMin, yMax]
 */
export function GetIslandBounds(islandArray){
    let [xMin, xMax, yMin, yMax] = [100000, -100000, 100000, -100000];

    for(let i = 0; i < islandArray.length; i += 1){
        const x = islandArray[i][0];
        const y = islandArray[i][1];

        if (x < xMin){
            xMin = x;
        }
        if (x > xMax){
            xMax = x;
        }
        if (y < yMin){
            yMin = y;
        }
        if (y > yMax){
            yMax = y;
        }
    }

    return [xMin, xMax, yMin, yMax];
}

/** Returns an array of pixelArrays
 * 
 * @param {PixelArray} pixelArray 
 * @param {Boolean} anyColor 
 * @param {Boolean} testAlpha 
 * @param {Int} minAlpha 
 */
export function PixelArrayToPArrayIslands(pixelArray, anyColor=false, testAlpha=true, minAlpha=1){
    const islands = PixelArrayToIslands(pixelArray, anyColor=false, testAlpha=true, minAlpha=1);
    console.log(islands.length);
    const island0 = islands[0];
    
    console.log(island0);
    //

    /**@type{Array<PixelArray>} */
    const pixelArrays = [];
    for( let i = 0; i < islands.length; i += 1){
        const bounds = GetIslandBounds(islands[i]);

        console.log(bounds);
        
        const xOffset = bounds[0];
        const yOffset = bounds[2];
        const width = bounds[1]-bounds[0]+1; //add 1 because the bounds are inclusive
        const height = bounds[3]-bounds[2]+1; //add 1 because the bounds are inclusive

        const curPixelArray = new PixelArray(null, width, height);

        let oldX = -1;
        let oldY = -1;
        let curX = -1;
        let curY = -1;
        let curColor = null;
        let newColor = null;
        for(let j = 0; j < islands[i].length; j += 1){
            //console.log(j);
            curX = islands[i][j][0] - xOffset;
            curY = islands[i][j][1] - yOffset;
            oldX = islands[i][j][0];
            oldY = islands[i][j][1];

            //console.log(curX);
            curColor = pixelArray.getColorValue(oldX, oldY);
            //console.log(curColor);

            newColor = [curColor[0], curColor[1], curColor[2], curColor[3]];

            curPixelArray.xPos = xOffset;
            curPixelArray.yPos = yOffset;

            //
            curPixelArray.setColorValue(curX, curY, newColor);
        }

        pixelArrays.push(curPixelArray);
    }

    return pixelArrays;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Int} x 
 * @param {Int} y 
 * @param {Array<Int>} visitedArray 
 * @param {*} anyColor 
 * @param {*} testAlpha 
 * @param {*} minAlpha 
 * @param {Boolean} noWhite 
 * @returns 
 */
export function FloodFillSelect(pixelArray, x, y, visitedArray=null, anyColor=false, testAlpha=false, minAlpha=1, noWhite=false){
    /**@type{Array<Int>} */
    const color = pixelArray.getColorValue(x, y);

    //console.log(color);

    // #region funcs
    let func = (curColor) => {
        if (curColor[0] !== color[0]){
            return false;
        }
        if (curColor[1] !== color[1]){
            return false;
        }
        if (curColor[2] !== color[2]){
            return false;
        }
        if (testAlpha){
            if (curColor[3] !== color[3]){
                return false;
            }
        }
        return true;
    }
    if (anyColor){
        func = (curColor) => {
            if(curColor[3] >= minAlpha){
                return true;
            }
            return false;
        };
    }
    if (noWhite){
        //func
    }
    //#endregion

    const getIndex = (x, y, width) => {
        return (x + y * width);
    }
    
    const width = pixelArray.width;
    const height = pixelArray.height;
    let actualVisitedArray = visitedArray;
    if (actualVisitedArray === null){
        console.log('ava is null!');
        for (let i = 0; i < width*height; i += 1){
            actualVisitedArray.push(0);
        }
    }
    const placesToVisit = [[x, y]];
    const island = [[x, y]];
    let iters = 0;
    while (placesToVisit.length !== 0 && iters < 100000000){ 
        let curPlace = placesToVisit[0];
        placesToVisit.splice(0, 1);

        let curX = curPlace[0];
        let curY = curPlace[1];

        if (actualVisitedArray[getIndex(curX, curY, width)] === 1){
            continue;
        }
        actualVisitedArray[getIndex(curX, curY, width)] = 1;
        //console.log(visitedArray);
        for(let a = -1; a < 2; a += 1){
            let visitX = curX + a;
            if (visitX < 0 || visitX >= width){
                continue;
            }

            for(let b = -1; b < 2; b += 1){
                let visitY = curY + b;

                if (visitY < 0 || visitY >= height){
                    continue;
                }
                const nextColor = pixelArray.getColorValue(visitX, visitY);
                //actualVisitedArray[getIndex(visitX, visitY, width)] === 0
                if (true){
                    if (func(nextColor)){
                        island.push([visitX, visitY]);
    
                        placesToVisit.push([visitX, visitY]);
                    }
                }
            }
        }
        iters += 1;
    }
    //console.log(iters);
    return island;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Array<Array<Int>>} indices
 * @param {Array<Int>} color
 */
export function FloodFill(pixelArray, indices, color){
    for(let i = 0; i < indices.length; i +=1){
        const [x, y] = [...indices[i]];

        pixelArray.setColorValue(x, y, color);
    }
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Array<Array<Int>>} indices 
 * @param {Array<Int>} color 
 * @returns 
 */
export function FloodFillNew(pixelArray, indices, color){
    const newPixelArray = PixelArray.CopyPixelFactory(pixelArray);

    FloodFill(newPixelArray, indices, color);

    return newPixelArray;
}