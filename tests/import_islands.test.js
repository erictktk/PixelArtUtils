/**
 * @jest-environment jsdom
 */

import {jest, test, it, describe, expect} from '@jest/globals';
import { GetDuplicateIslands, PixelArrayToPArrayIslands } from '../Islands.js';
import { PixelArray } from '../PixelArray.js';
 
import * as PixelArrayLoading from "../PixelArrayLoading.js";
 

const fileDir ="file:///C:/_js/";
const dir = fileDir + "JSPixelPaint/src/PixelArtUtils/tests/";

test("test number of islands", ()=>{
        const file = dir + "12_gCenter-Layer-7-Layer-6.png";

        return PixelArrayLoading.AsyncUrlToPixelArray(file).then( data => {
            //console.log(data);

            //console.log(PixelArrayToPArrayIslands(data).length);
            const pArrays = PixelArrayToPArrayIslands(data);
            expect(pArrays.length).toBe(3);

            expect(GetDuplicateIslands(pArrays).length).toBe(3);
        }
        );
    }
)