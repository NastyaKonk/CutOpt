var BestFit = {  
    // cutBlocks: function (blocks, sheetWidth, sheetHeight) {
    //     blocks.sort((a, b) => b.area - a.area);
    //     const sheets = [];
    //     let currentSheet = new Sheet(sheetWidth, sheetHeight);
        
    //     for (const block of blocks) {
    //       let placed = false;
      
    //       //for (let i = sheets.length - 1; i >= 0; i--) {
    //         for (const sheet of sheets) {
    //         if (sheet.placeBlock(block)) {
    //           placed = true;
    //           break;
    //         }
    //       }
      
    //       if (!placed) {
    //         // Пробуємо повернути блок
    //         block.rotate();
    //         for (const sheet of sheets) {
    //           if (sheet.placeBlock(block)) {
    //             placed = true;
    //             break;
    //           }
    //         }
    //         if (!placed){
    //            block.rotate();
    //         }
    //         if (!placed && !currentSheet.placeBlock(block)) {
    //           // // Пробуємо повернути блок
    //            block.rotate();
        
    //           if (!currentSheet.placeBlock(block)) {
    //             sheets.push(currentSheet);
    //             currentSheet = new Sheet(sheetWidth, sheetHeight);
    //             block.rotate(); //вертаємо блок в початковий стан
    //             currentSheet.placeBlock(block);
    //           }
    //         }
    //       }
      
          
    //     }
      
    //     sheets.push(currentSheet);
    //     return sheets;
    // },

      // Method to place a block on the sheet
  
  cutBlocks: function (blocks, sheetWidth, sheetHeight) {
        blocks.sort((a, b) => b.area - a.area);
        const sheets = [];
        for(block of blocks){
          if(block.rotation === 1){
            block.rotate;
          }
        }
        let currentSheet = new Sheet(sheetWidth, sheetHeight);
        
        for (const block of blocks) {
          let placed = false;
      
          //for (let i = sheets.length - 1; i >= 0; i--) {
            for (const sheet of sheets) {
            if (BestFit.placeBlock(block, sheet)) {
              placed = true;
              break;
            }
          }
      
          if (!placed) {
            // Пробуємо повернути блок
            block.rotate();
            for (const sheet of sheets) {
              if (BestFit.placeBlock(block, sheet)) {
                placed = true;
                break;
              }
            }
            if (!placed){
               block.rotate();
            }
            if (!placed && !BestFit.placeBlock(block, currentSheet)) {
              // // Пробуємо повернути блок
               //block.rotate();
        
              if (!BestFit.placeBlock(block, currentSheet)) {
                sheets.push(currentSheet);
                currentSheet = new Sheet(sheetWidth, sheetHeight);
                //block.rotate(); //вертаємо блок в початковий стан
                BestFit.placeBlock(block, currentSheet);
              }
            }
          }          
        }
      
        sheets.push(currentSheet);
        return sheets;
  },
  
  placeBlock: function (block,sheet) {
    if (BestFit.findFittingPosition(block, sheet)) {
      // block.isPlaced = true;
      sheet.blocks.push(block);
      return true;
    }
    return false;
  },

  // Method to find a fitting position for a block on the sheet
  findFittingPosition: function (block, sheet) {
    let fittingPositions = [];

    for (let y = 0; y <= sheet.h - block.h; y++) {
      for (let x = 0; x <= sheet.w - block.w; x++) {
        if (BestFit.isPositionAvailable(x, y, block.w, block.h, block.rotation, sheet)) {
          fittingPositions.push({ x, y, area: (sheet.w - x) * (sheet.h - y) });
        } else if (BestFit.isPositionAvailable(x, y, block.h, block.w, block.rotation, sheet)) {
          fittingPositions.push({ x, y, area: (sheet.h - x) * (sheet.w - y) });
        }
      }
    }

    if (fittingPositions.length > 0) {
      fittingPositions.sort((a, b) => b.area - a.area);
      const { x, y } = fittingPositions[0];
      block.x = x;
      block.y = y;
      return true;
    }

    return false;
  },

  // Method to check if a position is available for a block on the sheet
  isPositionAvailable: function (x, y, w, h, rotation, sheet) {
    for (const block of sheet.blocks) {
      if (
        x < block.x + block.w &&
        x + w > block.x &&
        y < block.y + block.h &&
        y + h > block.y
      ) {
        return false;
      }
    }

    if (rotation === 1) {
      // Rotated block orientation
      if (x + h > sheet.w || y + w > sheet.h) {
        return false;
      }
    } else {
      // Current block orientation
      if (x + w > sheet.w || y + h > sheet.h) {
        return false;
      }
    }

    return true;
  },
}